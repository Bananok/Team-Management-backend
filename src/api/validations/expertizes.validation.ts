import Joi from 'joi';

// Utils
import { generateResponseValidation } from 'utils/Validation';

// Schemas
import { ExpertizeSchema } from 'utils/Validation/schemas/expertize';

export default {
  // POST /expertizes
  addExpertize: {
    request: {
      body: Joi.object({
        projectId: Joi.string().min(6).max(128).required().description('Expertize ID'),
        expertize: Joi.string().required().description('Expertize on Project'),
        rate: Joi.number().required().description('Rate on Expertize'),
        startAt: Joi.date().iso().description('Start date'),
      }),
    },
    response: {
      ...generateResponseValidation(ExpertizeSchema.required()),
    },
  },

  // GET /expertizes
  getExpertizes: {
    request: {
      body: Joi.object({
        projectId: Joi.string().min(6).max(128).required().description('Expertize ID'),
      }),
    },
    response: {
      ...generateResponseValidation(Joi.array().items(ExpertizeSchema).required()),
    },
  },

  // DELETE /expertizes
  deleteExpertize: {
    request: {
      body: Joi.object({
        id: Joi.string().min(6).max(128).required().description('Expertize ID'),
      }),
    },
    response: {
      ...generateResponseValidation(Joi.string().description('deleted status')),
    },
  },
};
