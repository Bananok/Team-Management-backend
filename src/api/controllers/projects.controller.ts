import { NextFunction, Request, Response } from 'express';
import { apiJson, startTimer } from 'api/utils/ApiUtils';
import APIError, { ErrorCode } from 'utils/APIError';
import { IProjectsTransformType, Projects } from 'models/projects.model';
import { ContractStatus, WorkStatus } from 'interfaces/project';

export const addProject = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const { name, clientId, colour } = req.body as {
      name: string;
      clientId: string;
      colour: string;
    };

    const foundProjectOfName = await Projects.findOne({
      where: {
        name,
      },
    });

    if (foundProjectOfName) {
      return next(new APIError(ErrorCode.CHECKIN_ALREADY_EXISTS));
    }

    const addedProject = await Projects.create({
      name,
      contractStatus: ContractStatus.NA,
      status: WorkStatus.ACTIVE,
      billableStatus: false,
      clientId,
      colour,
    });

    return apiJson({
      req,
      res,
      data: addedProject.transform(IProjectsTransformType.public),
    });
  } catch (e) {
    return next(e);
  }
};

export const getProject = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const { projectId } = req.params as { projectId: string };

    const project = await Projects.findProjectById(projectId);

    if (!project) {
      return next(new APIError(ErrorCode.NOT_FOUND));
    }
    return apiJson({
      req,
      res,
      data: project.transform(IProjectsTransformType.public),
    });
  } catch (e) {
    return next(e);
  }
};

export const getAllProjects = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const projects = await Projects.findAll();

    return apiJson({
      req,
      res,
      data: projects.map((item) => {
        return item.transform(IProjectsTransformType.public);
      }),
    });
  } catch (e) {
    return next(e);
  }
};

export const updateProject = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const { projectId } = req.params as { projectId: string };

    const project = await Projects.findProjectById(projectId);

    if (!project) {
      return next(new APIError(ErrorCode.NOT_FOUND));
    }

    const isProjectUpdated = await Projects.updateProject(projectId, req.body);

    if (!isProjectUpdated) {
      return next(new APIError(ErrorCode.BAD_REQUEST));
    }

    const updatedProject = await Projects.findProjectById(projectId);

    return apiJson({
      req,
      res,
      data: updatedProject?.transform(IProjectsTransformType.public),
    });
  } catch (e) {
    return next(e);
  }
};
