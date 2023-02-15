import moment from 'moment-timezone';

// E2E
import { withSingleDatabase } from 'e2e/utils/api-test-helper';

// Models
import { Device } from 'models/device.model';
import { RefreshToken } from 'models/refresh-token.model';

const USER_DEVICE_ID = 'testing';

const INVALID_JWT_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2MTMwMzk2MjAsImlhdCI6MTYxMjk1MzIyMCwic3ViIjoxfQ.1iqIFKIpoSOW1nRlk2WOhR1KUyFklDJDjlFgIfD7xPQ'; // eslint-disable-line max-len
const INCORRECT_JWT_TOKEN = 'token';

const UNAUTHORIZED_API_ERROR = {
  code: '1400',
  message: 'Unauthorized',
};

describe('authLogout', () => {
  withSingleDatabase('auth', ({ request, sequelize }) => {
    it('should return unauthorized error without token', async () => {
      const res = await request.post('/auth/logout');

      expect(res.status).toEqual(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(UNAUTHORIZED_API_ERROR.message);
      expect(res.body.error.code).toBe(UNAUTHORIZED_API_ERROR.code);
    });

    it('should return unauthorized error with empty token', async () => {
      const res = await request.post('/auth/logout').set({ Authorization: '' });

      expect(res.status).toEqual(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(UNAUTHORIZED_API_ERROR.message);
      expect(res.body.error.code).toBe(UNAUTHORIZED_API_ERROR.code);
    });

    it('should return unauthorized error with incorrect token', async () => {
      const res = await request.post('/auth/logout').set({ Authorization: INCORRECT_JWT_TOKEN });

      expect(res.status).toEqual(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(UNAUTHORIZED_API_ERROR.message);
      expect(res.body.error.code).toBe(UNAUTHORIZED_API_ERROR.code);
    });

    it('should return unauthorized error with invalid jwt token', async () => {
      const res = await request.post('/auth/logout').set({
        Authorization: INVALID_JWT_TOKEN,
      });

      expect(res.status).toEqual(401);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(UNAUTHORIZED_API_ERROR.message);
      expect(res.body.error.code).toBe(UNAUTHORIZED_API_ERROR.code);
    });

    it('should logout and return Ok message', async () => {
      const device = (await sequelize.models.Device.findOne({
        where: {
          deviceId: USER_DEVICE_ID,
        },
      })) as Device;

      const res = await request.post('/auth/logout').set({ Authorization: device!.accessToken });

      const logoutDevice = (await sequelize.models.Device.findOne({
        where: {
          deviceId: USER_DEVICE_ID,
        },
      })) as Device;
      const deletedRefreshToken = (await sequelize.models.RefreshToken.findOne({
        where: {
          deviceId: USER_DEVICE_ID,
        },
      })) as RefreshToken;

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data).toBe('ok');

      expect(logoutDevice).not.toBeNull();
      expect(moment(logoutDevice.accessTokenExpires).isBefore()).toBeTruthy();
      expect(deletedRefreshToken).toBeNull();
    });
  });
});
