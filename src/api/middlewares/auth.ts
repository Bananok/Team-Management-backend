import { NextFunction, Request, Response } from 'express';

// Services
import logger from 'services/logger';

// Utils
import APIError, { ErrorCode } from 'utils/APIError';

// Models
import { User } from 'models/user.model';
import { Device } from 'models/device.model';

// Types
import { UserRole } from 'interfaces/user';

export const authorize =
  (roles: UserRole[] = Object.values(UserRole), checkNameExists: boolean = true) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const token = (req.headers.authorization || '').trim().replace(/^Bearer /, '');
    const emulatedId = req.headers['x-emulated-id'] || null;

    if (!token.length) {
      return next(new APIError(ErrorCode.UNAUTHORIZED));
    }

    const device = await Device.findUserDeviceByAccessToken(token);

    if (!device || !device.user) {
      logger.warn(`Could not find user with token - ${token}`);

      return next(new APIError(ErrorCode.UNAUTHORIZED));
    }

    if (!roles.includes(device.user.role)) {
      logger.warn(`No access - ${token}, ${JSON.stringify(roles)}`);

      return next(new APIError(ErrorCode.UNAUTHORIZED));
    }

    if (checkNameExists && !device.user.name?.length) {
      logger.warn(`No names - ${JSON.stringify(device.user)}`);

      return next(new APIError(ErrorCode.UNAUTHORIZED));
    }

    const isAdmin = device.user.role === UserRole.ADMIN;
    let emulatedUser: User | null = null;

    if (device.user.role === UserRole.ADMIN && typeof emulatedId === 'string') {
      emulatedUser = await User.findUserByPk(emulatedId);
    }

    req.context = {
      user: emulatedUser || device.user,
      isAdmin,
      device,
    };

    return next();
  };
