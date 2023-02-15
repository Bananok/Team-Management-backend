import { NextFunction, Request, Response } from 'express';
import { apiJson, startTimer } from 'api/utils/ApiUtils';
import { UserProjects } from 'models/user-projects.model';
import { IProjectsTransformType, Projects } from 'models/projects.model';
import { IUserTransformType, User } from 'models/user.model';
import { UserProjectsRole } from 'interfaces/user';
import APIError, { ErrorCode } from 'utils/APIError';

export const addUserOnProject = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const { userId, role, rate, expertize, dailyHours, startAt, endAt } = req.body as {
      userId: string;
      role: UserProjectsRole;
      rate: number;
      expertize: string;
      dailyHours: number;
      startAt: Date;
      endAt: Date;
    };

    const { projectId } = req.params;

    const userProject = await UserProjects.findOne({
      where: {
        userId,
        projectId,
      },
      paranoid: false,
    });

    if (userProject?.deletedAt) {
      await userProject?.restore();

      return apiJson({
        req,
        res,
        data: userProject,
      });
    }

    if (!userProject) {
      await UserProjects.create({
        userId,
        projectId,
        role,
        rate,
        expertize,
        dailyHours,
        startAt,
        endAt,
      });
    }

    const addedUserProject = await UserProjects.findOne({
      where: {
        userId,
        projectId,
      },
    });

    if (addedUserProject) {
      const userProjectsWithAllModel = await UserProjects.findAll({
        where: {
          userId,
          projectId,
        },
        include: [Projects, User],
      });

      return apiJson({
        req,
        res,
        data: userProjectsWithAllModel.map((item) => ({
          ...item.get(),
          project: item.project?.transform(IProjectsTransformType.public),
          user: item.user?.transform(IUserTransformType.public),
        })),
      });
    }
    return next(new APIError(ErrorCode.BAD_REQUEST));
  } catch (e) {
    return next(e);
  }
};

export const getProjectsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    startTimer({ req });

    const { userId } = req.params;

    const project = await UserProjects.findAll({
      where: {
        userId,
      },
      include: [Projects],
    });

    return apiJson({
      req,
      res,
      data: project,
    });
  } catch (e) {
    return next(e);
  }
};

export const getUsersByProjectId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    startTimer({ req });

    const { projectId } = req.params;

    const users = await UserProjects.findAll({
      where: {
        projectId,
      },
      include: [User],
    });

    return apiJson({
      req,
      res,
      data: users.map((item) => ({ ...item.get(), user: item.user?.transform(IUserTransformType.public) })),
    });
  } catch (e) {
    return next(e);
  }
};

export const deleteUserOnProject = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> => {
  try {
    startTimer({ req });

    const { userId } = req.body as { userId: string };
    const { projectId } = req.params;

    await UserProjects.destroy({
      where: {
        userId,
        projectId,
      },
    });

    return apiJson({
      req,
      res,
      data: 'ok',
    });
  } catch (e) {
    return next(e);
  }
};
