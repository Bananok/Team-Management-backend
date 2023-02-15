import { v4 as uuid } from 'uuid';

// E2E
import { withSingleDatabase } from 'e2e/utils/api-test-helper';

// Models
import { RefreshToken } from 'models/refresh-token.model';
import { IUserTransformType, User } from 'models/user.model';
import { Device } from 'models/device.model';

// Generators
import { generateUserResponse, generateTokenResponse } from 'e2e/utils/response-generators';

const VALIDATION_API_ERROR = {
  code: '1001',
  message: 'Validation Error',
};
const REFRESH_NOT_FOUND_API_ERROR = {
  code: '1701',
  message: 'Refresh token not found',
};

const TEST_REFRESH_TOKEN = 'testRefreshToken';

describe('authRefreshToken', () => {
  withSingleDatabase('auth', ({ request, sequelize }) => {
    it('should return validation error / without field uuid', async () => {
      const validationErrorMessage = '"uuid" is required';

      const res = await request.post('/auth/refresh-token');

      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(VALIDATION_API_ERROR.message);
      expect(res.body.error.code).toBe(VALIDATION_API_ERROR.code);
      expect(res.body.error.fieldErrors.body.length).toBe(1);
      expect(res.body.error.fieldErrors.body[0].message).toBe(validationErrorMessage);
    });

    it('should return validation error / incorrect typeof uuid', async () => {
      const validationErrorMessage = '"uuid" must be a string';

      const res = await request.post('/auth/refresh-token').send({
        uuid: true,
      });

      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(VALIDATION_API_ERROR.message);
      expect(res.body.error.code).toBe(VALIDATION_API_ERROR.code);
      expect(res.body.error.fieldErrors.body.length).toBe(1);
      expect(res.body.error.fieldErrors.body[0].message).toBe(validationErrorMessage);
    });

    it('should return validation error / without field refreshToken', async () => {
      const validationErrorMessage = '"refreshToken" is required';

      const res = await request.post('/auth/refresh-token').send({
        uuid: uuid(),
      });

      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(VALIDATION_API_ERROR.message);
      expect(res.body.error.code).toBe(VALIDATION_API_ERROR.code);
      expect(res.body.error.fieldErrors.body.length).toBe(1);
      expect(res.body.error.fieldErrors.body[0].message).toBe(validationErrorMessage);
    });

    it('should return validation error / short uuid', async () => {
      const validationErrorMessage = '"uuid" length must be at least 6 characters long';

      const res = await request.post('/auth/refresh-token').send({
        uuid: 'test',
      });

      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(VALIDATION_API_ERROR.message);
      expect(res.body.error.code).toBe(VALIDATION_API_ERROR.code);
      expect(res.body.error.fieldErrors.body.length).toBe(1);
      expect(res.body.error.fieldErrors.body[0].message).toBe(validationErrorMessage);
    });

    it('should return validation error / incorrect typeof refreshToken', async () => {
      const validationErrorMessage = '"refreshToken" must be a string';

      const res = await request.post('/auth/refresh-token').send({
        uuid: uuid(),
        refreshToken: 4444,
      });

      expect(res.status).toEqual(400);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(VALIDATION_API_ERROR.message);
      expect(res.body.error.code).toBe(VALIDATION_API_ERROR.code);
      expect(res.body.error.fieldErrors.body.length).toBe(1);
      expect(res.body.error.fieldErrors.body[0].message).toBe(validationErrorMessage);
    });

    it('should return error / refreshToken not found', async () => {
      const res = await request.post('/auth/refresh-token').send({
        uuid: uuid(),
        refreshToken: TEST_REFRESH_TOKEN,
      });

      expect(res.status).toEqual(404);
      expect(res.body).toHaveProperty('error');
      expect(res.body.error.message).toBe(REFRESH_NOT_FOUND_API_ERROR.message);
      expect(res.body.error.code).toBe(REFRESH_NOT_FOUND_API_ERROR.code);
    });

    it('should return data / user, settings, new tokens', async () => {
      const refreshToken = (await sequelize.models.RefreshToken.findOne({
        where: {
          token: TEST_REFRESH_TOKEN,
        },
      })) as RefreshToken;

      const res = await request.post('/auth/refresh-token').send({
        uuid: refreshToken.deviceId,
        refreshToken: refreshToken.token,
      });

      const deletedRefreshToken = (await sequelize.models.RefreshToken.findOne({
        where: {
          token: TEST_REFRESH_TOKEN,
        },
      })) as RefreshToken;
      const device = (await sequelize.models.Device.findOne({
        where: {
          deviceId: refreshToken.deviceId,
        },
        include: [User],
      })) as Device & { user: User };
      const newRefreshToken = (await sequelize.models.RefreshToken.findOne({
        where: {
          deviceId: refreshToken.deviceId,
        },
      })) as RefreshToken;

      expect(res.status).toEqual(200);
      expect(res.body).toHaveProperty('data');
      expect(res.body.data.profile).toEqual(
        generateUserResponse(
          {
            id: device.user.id,
            name: device.user.name,
            email: device.user.email,
            phone: device.user.phone,
            workDays: device.user.workDays,
            role: device.user.role,
            defaultRate: device.user.defaultRate,
            status: device.user.status,
            defaultLevel: device.user.defaultLevel,
            defaultLegalStatus: device.user.defaultLegalStatus,
            defaultWeeklyCapacity: device.user.defaultWeeklyCapacity,
            defaultExpertize: device.user.defaultExpertize,
            colour: device.user.colour,
          },
          IUserTransformType.private
        )
      );
      expect(res.body.data.token).toEqual(
        generateTokenResponse({
          accessToken: device.accessToken,
          expiresIn: device.accessTokenExpires.toISOString(),
          refreshToken: newRefreshToken.token,
        })
      );

      expect(deletedRefreshToken).toBeNull();
    });
  });
});
