// E2E
import { withSingleDatabase } from 'e2e/utils/api-test-helper';
import { generateUserResponse } from 'e2e/utils/response-generators';

// Models
import { Device } from 'models/device.model';
import { IUserTransformType, User } from 'models/user.model';

const USER_DEVICE_ID_1 = 'test';
const USER_DEVICE_ID_2 = 'test2';

const INVALID_JWT_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTMwMzk2MjAsImlhdCI6MTYxMjk1MzIyMCwic3ViIjoxfQ.1iqIFKIpoSOW1nRlk2WOhR1KUyFklDJDjlFgIfD7xPQ'; // eslint-disable-line max-len
const INCORRECT_JWT_TOKEN = 'token';

const UNAUTHORIZED_API_ERROR = {
  code: '1400',
  message: 'Unauthorized',
};

describe('getProfile', () => {
  withSingleDatabase('profile', ({ request, sequelize }) => {
    it('should return unauthorized error without token', async () => {
      const res = await request.get('/profile');

      expect(res.status).toEqual(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(UNAUTHORIZED_API_ERROR.message);
      expect(res.body.error.code).toBe(UNAUTHORIZED_API_ERROR.code);
    });

    it('should return unauthorized error with empty token', async () => {
      const res = await request.get('/profile').set({ Authorization: '' });

      expect(res.status).toEqual(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(UNAUTHORIZED_API_ERROR.message);
      expect(res.body.error.code).toBe(UNAUTHORIZED_API_ERROR.code);
    });

    it('should return unauthorized error with incorrect token', async () => {
      const res = await request.get('/profile').set({ Authorization: INCORRECT_JWT_TOKEN });

      expect(res.status).toEqual(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(UNAUTHORIZED_API_ERROR.message);
      expect(res.body.error.code).toBe(UNAUTHORIZED_API_ERROR.code);
    });

    it('should return unauthorized error with invalid jwt token', async () => {
      const res = await request.get('/profile').set({
        Authorization: INVALID_JWT_TOKEN,
      });

      expect(res.status).toEqual(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(UNAUTHORIZED_API_ERROR.message);
      expect(res.body.error.code).toBe(UNAUTHORIZED_API_ERROR.code);
    });

    it('should return a profile without avatar', async () => {
      const device = (await sequelize.models.Device.findOne({
        where: {
          deviceId: USER_DEVICE_ID_1,
        },
      })) as Device;

      const res = await request.get('/profile').set({ Authorization: device!.accessToken });

      const expectedUser = (await sequelize.models.User.findOne({
        where: {
          id: device.userId,
        },
      })) as User;

      expect(res.status).toEqual(200);
      expect(res.body.data).toEqual(
        generateUserResponse(
          {
            id: expectedUser.id,
            name: expectedUser.name,
            email: expectedUser.email,
            phone: expectedUser.phone,
            workDays: expectedUser.workDays,
            role: expectedUser.role,
            defaultRate: expectedUser.defaultRate,
            status: expectedUser.status,
            defaultLevel: expectedUser.defaultLevel,
            defaultLegalStatus: expectedUser.defaultLegalStatus,
            defaultWeeklyCapacity: expectedUser.defaultWeeklyCapacity,
            defaultExpertize: expectedUser.defaultExpertize,
            colour: expectedUser.colour,
          },
          IUserTransformType.private
        )
      );
      expect(res.body.data.avatar).toBeNull();
    });

    it('should return a profile with avatar', async () => {
      const device = (await sequelize.models.Device.findOne({
        where: {
          deviceId: USER_DEVICE_ID_2,
        },
      })) as Device;

      const res = await request.get('/profile').set({ Authorization: device!.accessToken });

      const expectedUser = (await sequelize.models.User.findOne({
        where: {
          id: device.userId,
        },
      })) as User;

      expect(res.status).toEqual(200);
      expect(res.body.data).toEqual(
        generateUserResponse(
          {
            id: expectedUser.id,
            name: expectedUser.name,
            email: expectedUser.email,
            phone: expectedUser.phone,
            workDays: expectedUser.workDays,
            role: expectedUser.role,
            defaultRate: expectedUser.defaultRate,
            status: expectedUser.status,
            defaultLevel: expectedUser.defaultLevel,
            defaultLegalStatus: expectedUser.defaultLegalStatus,
            defaultWeeklyCapacity: expectedUser.defaultWeeklyCapacity,
            defaultExpertize: expectedUser.defaultExpertize,
            colour: expectedUser.colour,
          },
          IUserTransformType.private
        )
      );
      expect(res.body.data.avatar).not.toBeNull();
    });
  });
});
