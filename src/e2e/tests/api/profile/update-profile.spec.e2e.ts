// E2E
import { withSingleDatabase } from 'e2e/utils/api-test-helper';
import { generateUserResponse } from 'e2e/utils/response-generators';

// Models
import { Device } from 'models/device.model';
import { IUserTransformType, User } from 'models/user.model';

const USER_DEVICE_ID = 'test2';

const INVALID_JWT_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTMwMzk2MjAsImlhdCI6MTYxMjk1MzIyMCwic3ViIjoxfQ.1iqIFKIpoSOW1nRlk2WOhR1KUyFklDJDjlFgIfD7xPQ'; // eslint-disable-line max-len
const INCORRECT_JWT_TOKEN = 'token';

const VALIDATION_API_ERROR = {
  code: '1001',
  message: 'Validation Error',
};
const UNAUTHORIZED_API_ERROR = {
  code: '1400',
  message: 'Unauthorized',
};

describe('updateProfile', () => {
  withSingleDatabase('profile', ({ request, sequelize }) => {
    it('should return unauthorized error without token', async () => {
      const res = await request.patch('/profile');

      expect(res.status).toEqual(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(UNAUTHORIZED_API_ERROR.message);
      expect(res.body.error.code).toBe(UNAUTHORIZED_API_ERROR.code);
    });

    it('should return unauthorized error with empty token', async () => {
      const res = await request.patch('/profile').set({ Authorization: '' });

      expect(res.status).toEqual(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(UNAUTHORIZED_API_ERROR.message);
      expect(res.body.error.code).toBe(UNAUTHORIZED_API_ERROR.code);
    });

    it('should return unauthorized error with incorrect token', async () => {
      const res = await request.patch('/profile').set({ Authorization: INCORRECT_JWT_TOKEN });

      expect(res.status).toEqual(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(UNAUTHORIZED_API_ERROR.message);
      expect(res.body.error.code).toBe(UNAUTHORIZED_API_ERROR.code);
    });

    it('should return unauthorized error with invalid jwt token', async () => {
      const res = await request.patch('/profile').set({
        Authorization: INVALID_JWT_TOKEN,
      });

      expect(res.status).toEqual(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(UNAUTHORIZED_API_ERROR.message);
      expect(res.body.error.code).toBe(UNAUTHORIZED_API_ERROR.code);
    });

    it('should return validation error / incorrect typeof firstName', async () => {
      const validationErrorMessage = '"firstName" must be a string';

      const device = (await sequelize.models.Device.findOne({
        where: {
          deviceId: USER_DEVICE_ID,
        },
      })) as Device;

      const res = await request.patch('/profile').set({ Authorization: device!.accessToken }).send({
        firstName: true,
      });

      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(VALIDATION_API_ERROR.message);
      expect(res.body.error.code).toBe(VALIDATION_API_ERROR.code);
      expect(res.body.error.fieldErrors.body.length).toBe(1);
      expect(res.body.error.fieldErrors.body[0].message).toBe(validationErrorMessage);
    });

    it('should return validation error / incorrect typeof firstName', async () => {
      const validationErrorMessage = '"firstName" must be a string';

      const device = (await sequelize.models.Device.findOne({
        where: {
          deviceId: USER_DEVICE_ID,
        },
      })) as Device;

      const res = await request.patch('/profile').set({ Authorization: device!.accessToken }).send({
        firstName: 100,
      });

      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(VALIDATION_API_ERROR.message);
      expect(res.body.error.code).toBe(VALIDATION_API_ERROR.code);
      expect(res.body.error.fieldErrors.body.length).toBe(1);
      expect(res.body.error.fieldErrors.body[0].message).toBe(validationErrorMessage);
    });

    it('should return validation error / short firstName', async () => {
      const validationErrorMessage = '"firstName" length must be at least 3 characters long';

      const device = (await sequelize.models.Device.findOne({
        where: {
          deviceId: USER_DEVICE_ID,
        },
      })) as Device;

      const res = await request.patch('/profile').set({ Authorization: device!.accessToken }).send({
        firstName: 'Ne',
        lastName: 'Foobar',
        displayName: 'Foobar',
      });

      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(VALIDATION_API_ERROR.message);
      expect(res.body.error.code).toBe(VALIDATION_API_ERROR.code);
      expect(res.body.error.fieldErrors.body.length).toBe(1);
      expect(res.body.error.fieldErrors.body[0].message).toBe(validationErrorMessage);
    });

    it('should return validation error / incorrect typeof lastName', async () => {
      const validationErrorMessage = '"lastName" must be a string';

      const device = (await sequelize.models.Device.findOne({
        where: {
          deviceId: USER_DEVICE_ID,
        },
      })) as Device;

      const res = await request.patch('/profile').set({ Authorization: device!.accessToken }).send({
        lastName: true,
      });

      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(VALIDATION_API_ERROR.message);
      expect(res.body.error.code).toBe(VALIDATION_API_ERROR.code);
      expect(res.body.error.fieldErrors.body.length).toBe(1);
      expect(res.body.error.fieldErrors.body[0].message).toBe(validationErrorMessage);
    });

    it('should return validation error / incorrect typeof lastName', async () => {
      const validationErrorMessage = '"lastName" must be a string';

      const device = (await sequelize.models.Device.findOne({
        where: {
          deviceId: USER_DEVICE_ID,
        },
      })) as Device;

      const res = await request.patch('/profile').set({ Authorization: device!.accessToken }).send({
        lastName: 100,
      });

      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(VALIDATION_API_ERROR.message);
      expect(res.body.error.code).toBe(VALIDATION_API_ERROR.code);
      expect(res.body.error.fieldErrors.body.length).toBe(1);
      expect(res.body.error.fieldErrors.body[0].message).toBe(validationErrorMessage);
    });

    it('should return validation error / short lastName', async () => {
      const validationErrorMessage = '"lastName" length must be at least 3 characters long';

      const device = (await sequelize.models.Device.findOne({
        where: {
          deviceId: USER_DEVICE_ID,
        },
      })) as Device;

      const res = await request.patch('/profile').set({ Authorization: device!.accessToken }).send({
        firstName: 'Ned',
        lastName: 'Fo',
        displayName: 'Foobar',
      });

      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(VALIDATION_API_ERROR.message);
      expect(res.body.error.code).toBe(VALIDATION_API_ERROR.code);
      expect(res.body.error.fieldErrors.body.length).toBe(1);
      expect(res.body.error.fieldErrors.body[0].message).toBe(validationErrorMessage);
    });

    it('should return validation error / short displayName', async () => {
      const validationErrorMessage = '"displayName" length must be at least 6 characters long';

      const device = (await sequelize.models.Device.findOne({
        where: {
          deviceId: USER_DEVICE_ID,
        },
      })) as Device;

      const res = await request.patch('/profile').set({ Authorization: device!.accessToken }).send({
        firstName: 'Ned',
        lastName: 'Foobar',
        displayName: 'te',
        email: 'te@gmail.com',
      });

      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(VALIDATION_API_ERROR.message);
      expect(res.body.error.code).toBe(VALIDATION_API_ERROR.code);
      expect(res.body.error.fieldErrors.body.length).toBe(1);
      expect(res.body.error.fieldErrors.body[0].message).toBe(validationErrorMessage);
    });

    it('should return validation error / short email', async () => {
      const validationErrorMessage = '"email" length must be at least 6 characters long';

      const device = (await sequelize.models.Device.findOne({
        where: {
          deviceId: USER_DEVICE_ID,
        },
      })) as Device;

      const res = await request.patch('/profile').set({ Authorization: device!.accessToken }).send({
        firstName: 'Ned',
        lastName: 'Foobar',
        displayName: 'testtest',
        email: 't@y.c',
      });

      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(VALIDATION_API_ERROR.message);
      expect(res.body.error.code).toBe(VALIDATION_API_ERROR.code);
      expect(res.body.error.fieldErrors.body.length).toBe(1);
      expect(res.body.error.fieldErrors.body[0].message).toBe(validationErrorMessage);
    });

    it('should return validation error / incorrect email', async () => {
      const validationErrorMessage = '"email" length must be at least 6 characters long';

      const device = (await sequelize.models.Device.findOne({
        where: {
          deviceId: USER_DEVICE_ID,
        },
      })) as Device;

      const res = await request.patch('/profile').set({ Authorization: device!.accessToken }).send({
        firstName: 'Ned',
        lastName: 'Foobar',
        displayName: 'testtest',
        email: 'test',
      });

      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(VALIDATION_API_ERROR.message);
      expect(res.body.error.code).toBe(VALIDATION_API_ERROR.code);
      expect(res.body.error.fieldErrors.body.length).toBe(1);
      expect(res.body.error.fieldErrors.body[0].message).toBe(validationErrorMessage);
    });

    it('should return an old user profile', async () => {
      const device = (await sequelize.models.Device.findOne({
        where: {
          deviceId: USER_DEVICE_ID,
        },
      })) as Device;

      const res = await request.patch('/profile').set({ Authorization: device!.accessToken }).send();

      const expectedUser = (await sequelize.models.User.findOne({
        where: {
          id: device.userId,
        },
      })) as User;

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('data');
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

    it('should return an updated profile', async () => {
      const device = (await sequelize.models.Device.findOne({
        where: {
          deviceId: USER_DEVICE_ID,
        },
      })) as Device;

      const res = await request.patch('/profile').set({ Authorization: device!.accessToken }).send({
        firstName: 'Ned',
        lastName: 'Foobar',
        displayName: 'wolf1k',
        email: 'wolf1k@gmail.com',
      });

      const updatedUser = (await sequelize.models.User.findOne({
        where: {
          id: device.userId,
        },
      })) as User;

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toEqual(
        generateUserResponse(
          {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            workDays: updatedUser.workDays,
            role: updatedUser.role,
            defaultRate: updatedUser.defaultRate,
            status: updatedUser.status,
            defaultLevel: updatedUser.defaultLevel,
            defaultLegalStatus: updatedUser.defaultLegalStatus,
            defaultWeeklyCapacity: updatedUser.defaultWeeklyCapacity,
            defaultExpertize: updatedUser.defaultExpertize,
            colour: updatedUser.colour,
          },
          IUserTransformType.private
        )
      );

      expect(updatedUser.name).toBe('Ned Foobar');
      expect(updatedUser.email).toBe('wolf1k@gmail.com');
    });

    it('should return an updated profile with null email', async () => {
      const device = (await sequelize.models.Device.findOne({
        where: {
          deviceId: USER_DEVICE_ID,
        },
      })) as Device;

      const res = await request.patch('/profile').set({ Authorization: device!.accessToken }).send({
        email: null,
      });

      const updatedUser = (await sequelize.models.User.findOne({
        where: {
          id: device.userId,
        },
      })) as User;

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toEqual(
        generateUserResponse(
          {
            id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            phone: updatedUser.phone,
            workDays: updatedUser.workDays,
            role: updatedUser.role,
            defaultRate: updatedUser.defaultRate,
            status: updatedUser.status,
            defaultLevel: updatedUser.defaultLevel,
            defaultLegalStatus: updatedUser.defaultLegalStatus,
            defaultWeeklyCapacity: updatedUser.defaultWeeklyCapacity,
            defaultExpertize: updatedUser.defaultExpertize,
            colour: updatedUser.colour,
          },
          IUserTransformType.private
        )
      );

      expect(updatedUser.email).toBe(null);
    });
  });
});
