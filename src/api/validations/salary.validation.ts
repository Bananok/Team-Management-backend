import Joi from 'joi';

// Utils
import { generateResponseValidation } from 'utils/Validation';

// Schemas
import { CoefficientSchema } from 'utils/Validation/schemas/coefficient';

export default {
  // POST /salary/coefficients
  addCoefficient: {
    request: {
      body: Joi.object({
        name: Joi.string().min(3).max(128).required().description('Name of Coefficient'),
        coefficient: Joi.number().required().description('Coefficient on Salary'),
      }),
    },
    response: {
      ...generateResponseValidation(CoefficientSchema.required()),
    },
  },

  // GET /salary/coefficients
  getCoefficient: {
    request: {},
    response: {
      ...generateResponseValidation(Joi.array().items(CoefficientSchema).required()),
    },
  },
};
