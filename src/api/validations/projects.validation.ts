import Joi from 'joi';

// Utils
import { generateResponseValidation } from 'utils/Validation';

import { ContractStatus, WorkStatus } from 'interfaces/project';

// Schemas
import { ProjectSchema } from 'utils/Validation/schemas/project';
import { Currency } from 'interfaces/currency';

export default {
  // POST /projects
  addProject: {
    request: {
      body: Joi.object({
        name: Joi.string().min(3).max(30).required().description('Project Name'),
        clientId: Joi.string().min(6).max(128).required().description('Client ID'),
        colour: Joi.string().required().description('Project Colour'),
      }),
    },
    response: {
      ...generateResponseValidation(ProjectSchema.required()),
    },
  },

  // GET /projects/:projectId
  getProject: {
    request: {
      params: Joi.object({
        projectId: Joi.string().min(6).max(128).required().description('Project ID'),
      }),
    },
    response: {
      ...generateResponseValidation(ProjectSchema.required()),
    },
  },

  // GET /projects
  getAllProject: {
    request: {},
    response: {
      ...generateResponseValidation(Joi.array().items(ProjectSchema).required()),
    },
  },

  // PATCH /projects/:projectId
  updateProject: {
    request: {
      params: Joi.object({
        projectId: Joi.string().min(6).max(128).required().description('Project ID'),
      }),
      body: Joi.object({
        name: Joi.string().min(3).max(30).description('Project Name'),
        startAt: Joi.date().iso().description('Start date'),
        endAt: Joi.date().iso().description('End date'),
        billableStatus: Joi.boolean().description('Actual Contract'),
        clientId: Joi.string().min(6).max(128).description('Client ID'),
        manager: Joi.string().description('Manager on Project'),
        contractStatus: Joi.string()
          .valid(...Object.values(ContractStatus))
          .description('Contract Status'),
        status: Joi.string()
          .valid(...Object.values(WorkStatus))
          .description('Contract Status'),
        currency: Joi.string()
          .valid(...Object.values(Currency))
          .description('Currency project'),
        archivedLink: Joi.string().description('Link for archive'),
        colour: Joi.string().description('Project Colour'),
      }),
    },
    response: {
      ...generateResponseValidation(ProjectSchema.required()),
    },
  },
};
