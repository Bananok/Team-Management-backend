import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';

import { deleteValue, getValue, setValueWithExp } from 'services/redis';
import { sendRegistrationUrl } from 'services/mailer';
import { apiJson, startTimer } from 'api/utils/ApiUtils';
import configVars from 'config/vars';
import { IRedisAdmin, IRedisOwner, PersonStatus, UserRole, UserRoleForSendLinkAdmin } from 'interfaces/user';
import { IUserTransformType, User } from 'models/user.model';
import APIError, { ErrorCode } from 'utils/APIError';
import { colour } from 'utils/Utils';

const EXPIRATION_INVITE_SECONDS = 86400;

export async function sendRegisterUrlByOwner(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    startTimer({ req });

    const { name, email, role } = req.body as {
      name: string;
      email: string;
      role: UserRole;
    };
    const user: IRedisOwner = { name, email, role };

    const rounds = configVars.env === 'test' ? 1 : 10;
    const redisKey = bcrypt.hashSync(JSON.stringify({ ...user, date: Date.now() }), rounds);

    setValueWithExp(redisKey, { user }, EXPIRATION_INVITE_SECONDS);
    await sendRegistrationUrl(email, redisKey, name);

    return apiJson({
      req,
      res,
      data: true,
    });
  } catch (error) {
    return next(error);
  }
}

export async function sendRegisterUrlByAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    startTimer({ req });

    const { name, email, role } = req.body as {
      name: string;
      email: string;
      role: UserRoleForSendLinkAdmin;
    };
    const user: IRedisAdmin = { name, email, role };

    const rounds = configVars.env === 'test' ? 1 : 10;
    const redisKey = bcrypt.hashSync(JSON.stringify({ ...user, date: Date.now() }), rounds);

    setValueWithExp(redisKey, { user }, EXPIRATION_INVITE_SECONDS);
    await sendRegistrationUrl(email, redisKey, name);

    return apiJson({
      req,
      res,
      data: true,
    });
  } catch (error) {
    return next(error);
  }
}

export async function checkHash(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    startTimer({ req });

    const { hash } = req.query as {
      hash: string;
    };
    const redisUser = await getValue<IRedisOwner>(hash);

    return apiJson({
      req,
      res,
      data: !!redisUser,
    });
  } catch (error) {
    return next(error);
  }
}

export async function registration(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
  try {
    startTimer({ req });

    const { hash } = req.query as {
      hash: string;
    };
    const { password } = req.body as {
      password: string;
    };

    const redisUser = await getValue<{ user: IRedisOwner }>(hash);
    if (!redisUser) {
      return next(new APIError(ErrorCode.FORBIDDEN));
    }

    await deleteValue(hash);

    const { email, name, role } = redisUser.user;
    const userColour = colour(name);
    const user = await User.create({
      email,
      name,
      password,
      role,
      defaultRate: null,
      colour: userColour,
      status: PersonStatus.ACTIVE,
      defaultLevel: null,
      defaultLegalStatus: null,
      defaultWeeklyCapacity: null,
      defaultExpertize: null,
    });

    return apiJson({
      req,
      res,
      data: user!.transform(IUserTransformType.private),
    });
  } catch (error) {
    return next(error);
  }
}
