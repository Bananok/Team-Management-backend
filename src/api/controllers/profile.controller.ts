import { NextFunction, Request, Response } from 'express';

// Utils
import APIError, { ErrorCode } from 'utils/APIError';
import { apiJson, startTimer } from 'api/utils/ApiUtils';

// Models
import { IUser, IUserTransformType, User } from 'models/user.model';

/**
 * Get logged in user info
 * @public
 */
export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<Response<IUser> | void> => {
  try {
    startTimer({ req });

    const userId = req.context.user!.id;

    const user = await User.findUserByPk(userId);

    return apiJson({
      req,
      res,
      data: user!.transform(IUserTransformType.private),
    });
  } catch (e) {
    return next(e);
  }
};

/**
 * Update user info
 * @public
 */
export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response<IUser> | void> => {
  try {
    startTimer({ req });

    const { userId } = req.body as { userId: string };

    if (!req.body || !Object.keys(req.body).length) {
      const user = await User.findUserByPk(userId);

      return apiJson({
        req,
        res,
        data: user!.transform(IUserTransformType.private),
      });
    }

    const isProfileUpdated = await User.updateProfile(userId, req.body);

    if (!isProfileUpdated) {
      return next(new APIError(ErrorCode.BAD_REQUEST));
    }

    const updatedUser = await User.findUserByPk(userId);

    return apiJson({
      req,
      res,
      data: updatedUser!.transform(IUserTransformType.private),
    });
  } catch (e) {
    return next(e);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const users = await User.findAll();

    return apiJson({
      req,
      res,
      data: users.map((item) => item.transform(IUserTransformType.public)),
    });
  } catch (e) {
    return next(e);
  }
};
