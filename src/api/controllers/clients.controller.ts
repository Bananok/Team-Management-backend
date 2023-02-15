import { NextFunction, Request, Response } from 'express';
import { apiJson, startTimer } from 'api/utils/ApiUtils';
import { Clients, IClientTransformType } from 'models/clients.model';
import { PersonStatus } from 'interfaces/user';
import { Projects } from 'models/projects.model';
import APIError, { ErrorCode } from 'utils/APIError';

export const addClient = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const {
      director,
      contactPerson,
      status,
      email,
      legalTin,
      legalOgrn,
      legalKpp,
      legalAddress,
      postalAddress,
      comment,
      legalName,
    } = req.body as {
      director: string;
      status: PersonStatus;
      contactPerson: string;
      email: string;
      legalName: string;
      legalTin: string;
      legalOgrn: string;
      legalKpp: string;
      legalAddress: string;
      postalAddress: string;
      comment?: string;
    };

    const client = await Clients.findOne({
      where: {
        email,
        legalName,
      },
    });

    if (client) {
      return next(new APIError(ErrorCode.CHECKIN_ALREADY_EXISTS));
    }

    const addedClient = await Clients.create({
      director,
      contactPerson,
      status,
      email,
      legalTin,
      legalOgrn,
      legalKpp,
      legalAddress,
      postalAddress,
      comment,
      legalName,
    });

    return apiJson({
      req,
      res,
      data: addedClient.transform(IClientTransformType.public),
    });
  } catch (e) {
    return next(e);
  }
};

export const getClient = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const { clientId } = req.params as { clientId: string };

    const client = await Clients.findOne({
      where: {
        id: clientId,
      },
      include: [Projects],
    });

    if (!client) {
      return next(new APIError(ErrorCode.NOT_FOUND));
    }
    return apiJson({
      req,
      res,
      data: client,
    });
  } catch (e) {
    return next(e);
  }
};

export const getAllClients = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const clients = await Clients.findAll({ include: [Projects] });

    return apiJson({
      req,
      res,
      data: clients,
    });
  } catch (e) {
    return next(e);
  }
};

export const updateClient = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    startTimer({ req });

    const { clientId, projectsIds } = req.body as { clientId: string; projectsIds: string[] };

    const client = await Clients.findOne({
      where: {
        id: clientId,
      },
    });

    if (!client) {
      return next(new APIError(ErrorCode.NOT_FOUND));
    }

    await Clients.updateClients(clientId, req.body);

    await Projects.updateProjects(projectsIds, { clientId: client.id });

    const updatedClient = await Clients.findOne({
      where: {
        id: client.id,
      },
      include: [Projects],
    });

    return apiJson({
      req,
      res,
      data: updatedClient,
    });
  } catch (e) {
    return next(e);
  }
};
