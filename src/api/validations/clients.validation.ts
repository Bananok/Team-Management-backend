import Joi from 'joi';

// Utils
import { generateResponseValidation } from 'utils/Validation';

// Schemas
import { ProjectSchema } from 'utils/Validation/schemas/project';

import { PersonStatus } from 'interfaces/user';

export default {
  // POST /clients
  addClient: {
    request: {
      body: Joi.object({
        director: Joi.string().min(3).max(30).required().description('Director Client'),
        contactPerson: Joi.string().min(3).max(30).required().description('Director Client'),
        status: Joi.string()
          .valid(...Object.values(PersonStatus))
          .required()
          .description('Work Status'),
        email: Joi.string().email().required().description('Client Email'),
        legalTin: Joi.string().required().description('legalTin'),
        legalOgrn: Joi.string().required().description('legalOgrn'),
        legalKpp: Joi.string().required().description('legalKpp'),
        legalAddress: Joi.string().required().description('legalAddress'),
        postalAddress: Joi.string().required().description('postalAddress'),
        legalName: Joi.string().required().description('legalName'),
        projectId: Joi.string().description('Project  Id'),
        comment: Joi.string().description('Comment in Clients'),
      }),
    },
    response: {
      ...generateResponseValidation(
        Joi.array()
          .items(
            Joi.object({
              id: Joi.string().min(6).max(128).required().description('Client ID'),
              director: Joi.string().min(3).max(30).required().description('Director Client'),
              contactPerson: Joi.string().min(3).max(30).required().description('Director Client'),
              status: Joi.string()
                .valid(...Object.values(PersonStatus))
                .required()
                .description('Work Status'),
              email: Joi.string().email().required().description('Client Email'),
              legalTin: Joi.string().required().description('legalTin'),
              legalOgrn: Joi.string().required().description('legalOgrn'),
              legalKpp: Joi.string().required().description('legalKpp'),
              legalAddress: Joi.string().required().description('legalAddress'),
              postalAddress: Joi.string().required().description('postalAddress'),
              legalName: Joi.string().required().description('legalName'),
              comment: Joi.string().description('Comment in Clients'),
              projests: Joi.array().items(ProjectSchema),
            })
          )
          .required()
      ),
    },
  },
  // GET /clients/:clientId
  getClient: {
    request: {
      params: Joi.object({
        clientId: Joi.string().min(6).max(128).required().description('UserProject ID'),
      }),
    },
    response: {
      ...generateResponseValidation(
        Joi.array()
          .items(
            Joi.object({
              id: Joi.string().min(6).max(128).required().description('Client ID'),
              director: Joi.string().min(3).max(30).required().description('Director Client'),
              contactPerson: Joi.string().min(3).max(30).required().description('Director Client'),
              status: Joi.string()
                .valid(...Object.values(PersonStatus))
                .required()
                .description('Work Status'),
              email: Joi.string().email().required().description('Client Email'),
              legalTin: Joi.string().required().description('legalTin'),
              legalOgrn: Joi.string().required().description('legalOgrn'),
              legalKpp: Joi.string().required().description('legalKpp'),
              legalAddress: Joi.string().required().description('legalAddress'),
              postalAddress: Joi.string().required().description('postalAddress'),
              legalName: Joi.string().required().description('legalName'),
              comment: Joi.string().description('Comment in Clients'),
              projests: Joi.array().items(ProjectSchema),
            })
          )
          .required()
      ),
    },
  },
  // GET /clients/getAllClient
  getAllClients: {
    request: {},
    response: {
      ...generateResponseValidation(
        Joi.array()
          .items(
            Joi.object({
              id: Joi.string().min(6).max(128).required().description('Client ID'),
              director: Joi.string().min(3).max(30).required().description('Director Client'),
              contactPerson: Joi.string().min(3).max(30).required().description('Director Client'),
              status: Joi.string()
                .valid(...Object.values(PersonStatus))
                .required()
                .description('Work Status'),
              email: Joi.string().email().required().description('Client Email'),
              legalTin: Joi.string().required().description('legalTin'),
              legalOgrn: Joi.string().required().description('legalOgrn'),
              legalKpp: Joi.string().required().description('legalKpp'),
              legalAddress: Joi.string().required().description('legalAddress'),
              postalAddress: Joi.string().required().description('postalAddress'),
              legalName: Joi.string().required().description('legalName'),
              comment: Joi.string().description('Comment in Clients'),
              projests: Joi.array().items(ProjectSchema),
            })
          )
          .required()
      ),
    },
  },
  // PATH /clients
  updateClient: {
    request: {
      body: Joi.object({
        clientId: Joi.string().min(6).max(128).required().description('Client ID'),
        director: Joi.string().min(3).max(30).description('Director Client'),
        contactPerson: Joi.string().min(3).max(30).description('Director Client'),
        status: Joi.string()
          .valid(...Object.values(PersonStatus))
          .description('Work Status'),
        legalTin: Joi.string().description('legalTin'),
        legalOgrn: Joi.string().description('legalOgrn'),
        legalKpp: Joi.string().description('legalKpp'),
        legalAddress: Joi.string().description('legalAddress'),
        postalAddress: Joi.string().description('postalAddress'),
        legalName: Joi.string().description('legalName'),
        projectsIds: Joi.array().required().items(Joi.string()).description('Projects  Ids'),
        comment: Joi.string().description('Comment in Clients'),
      }),
    },
    response: {
      ...generateResponseValidation(
        Joi.array()
          .items(
            Joi.object({
              id: Joi.string().min(6).max(128).required().description('Client ID'),
              director: Joi.string().min(3).max(30).required().description('Director Client'),
              contactPerson: Joi.string().min(3).max(30).required().description('Director Client'),
              status: Joi.string()
                .valid(...Object.values(PersonStatus))
                .required()
                .description('Work Status'),
              email: Joi.string().email().required().description('Client Email'),
              legalTin: Joi.string().required().description('legalTin'),
              legalOgrn: Joi.string().required().description('legalOgrn'),
              legalKpp: Joi.string().required().description('legalKpp'),
              legalAddress: Joi.string().required().description('legalAddress'),
              postalAddress: Joi.string().required().description('postalAddress'),
              legalName: Joi.string().required().description('legalName'),
              projectsIds: Joi.array().required().items(Joi.string()).description('Projects  Ids'),
              comment: Joi.string().description('Comment in Clients'),
              projests: Joi.array().items(ProjectSchema),
            })
          )
          .required()
      ),
    },
  },
};
