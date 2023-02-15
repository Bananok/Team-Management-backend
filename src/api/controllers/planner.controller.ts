import { NextFunction, Request, Response } from 'express';
import { apiJson, startTimer } from 'api/utils/ApiUtils';
import { IUserTransformType, User } from 'models/user.model';
import APIError, { ErrorCode } from 'utils/APIError';
import { IUserProjectsTransformType, UserProjects } from 'models/user-projects.model';
import { Projects } from 'models/projects.model';

export const addPerson = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const { userId } = req.body as { userId: string };

    const user = await User.findUserByPk(userId);

    if (!user) {
      return next(new APIError(ErrorCode.NOT_FOUND));
    }

    const isUserUpdated = await User.updateProfile(userId, { ...req.body, hasPlanner: true });

    if (!isUserUpdated) {
      return next(new APIError(ErrorCode.BAD_REQUEST));
    }

    const updatedUser = await User.findUserByPk(userId);

    return apiJson({
      req,
      res,
      data: updatedUser!.transform(IUserTransformType.public),
    });
  } catch (e) {
    return next(e);
  }
};

export const updatePerson = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const { userId } = req.body as { userId: string };

    const user = await User.findUserByPk(userId);

    if (user?.hasPlanner === false) {
      return next(new APIError(ErrorCode.NOT_FOUND));
    }

    const isUserUpdated = await User.updateProfile(userId, req.body);

    if (!isUserUpdated) {
      return next(new APIError(ErrorCode.BAD_REQUEST));
    }

    const updatedUser = await User.findUserByPk(userId);

    return apiJson({
      req,
      res,
      data: updatedUser!.transform(IUserTransformType.public),
    });
  } catch (e) {
    return next(e);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const usersInPlanner = await User.findAll({
      where: {
        hasPlanner: true,
      },
    });
    return apiJson({
      req,
      res,
      data: usersInPlanner.map((item) => item.transform(IUserTransformType.public)),
    });
  } catch (e) {
    return next(e);
  }
};

export const assignment = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const addedUserProject = await UserProjects.create(req.body);

    if (!addedUserProject) {
      return next(new APIError(ErrorCode.BAD_REQUEST));
    }

    return apiJson({
      req,
      res,
      data: addedUserProject?.transform(IUserProjectsTransformType.public),
    });
  } catch (e) {
    return next(e);
  }
};

export const assignmentUpdate = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const { userId, projectId, startAt, endAt } = req.body as {
      userId: string;
      projectId: string;
      startAt: Date;
      endAt: Date;
    };

    const userProject = await UserProjects.findOne({
      where: {
        userId,
        projectId,
        startAt,
        endAt,
      },
    });

    if (!userProject) {
      return next(new APIError(ErrorCode.NOT_FOUND));
    }

    const isUserProjectUpdated = await UserProjects.updateUserProjects(userId, projectId, startAt, endAt, req.body);

    if (!isUserProjectUpdated) {
      return next(new APIError(ErrorCode.BAD_REQUEST));
    }

    const updatedUserProject = await UserProjects.findOne({
      where: {
        userId,
        projectId,
        startAt,
        endAt,
      },
    });

    return apiJson({
      req,
      res,
      data: updatedUserProject?.transform(IUserProjectsTransformType.public),
    });
  } catch (e) {
    return next(e);
  }
};

export const assignmentProjects = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const { userId } = req.body as {
      userId: string;
    };

    const userInPlanner = await User.findOne({
      where: {
        id: userId,
        hasPlanner: true,
      },
    });

    if (!userInPlanner) {
      return next(new APIError(ErrorCode.NOT_FOUND));
    }

    const projectsUser = await UserProjects.findAll({
      where: {
        userId,
      },
      attributes: [],
      include: Projects,
      raw: true,
      group: ['project.id'],
      nest: true,
    });

    return apiJson({
      req,
      res,
      data: projectsUser,
    });
  } catch (e) {
    return next(e);
  }
};

export const getUserAssignment = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const { userId, projectId } = req.body as {
      userId: string;
      projectId: string;
    };

    const userAllocations = await UserProjects.findAll({
      where: {
        userId,
        projectId,
      },
    });

    if (!userAllocations) {
      return next(new APIError(ErrorCode.NOT_FOUND));
    }

    return apiJson({
      req,
      res,
      data: userAllocations.map((item) => {
        return item.transform(IUserProjectsTransformType.public);
      }),
    });
  } catch (e) {
    return next(e);
  }
};
