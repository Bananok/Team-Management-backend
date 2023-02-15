import Joi from 'joi';

// Utils
import { generateResponseValidation } from 'utils/Validation';

// Schemas
import { UserSchema } from 'utils/Validation/schemas/user';

import { UserRole, PersonStatus } from 'interfaces/user';
import { Currency } from 'interfaces/currency';

export default {
  // GET /profile
  getProfile: {
    response: {
      ...generateResponseValidation(UserSchema.required()),
    },
  },

  // PATCH /profile
  updateProfile: {
    request: {
      body: Joi.object({
        userId: Joi.string().min(6).max(128).required().description('User Id'),
        name: Joi.string(),
        colour: Joi.string().description('User Colour'),
        phone: Joi.string().min(6).max(11).description('Phone number'),
        role: Joi.string()
          .valid(...Object.values(UserRole))
          .description('UserRole for owner invite'),
        hasPlanner: Joi.boolean().description('User is in planner'),
        defaultRate: Joi.number().description('Default User Rate'),
        currency: Joi.string()
          .valid(...Object.values(Currency))
          .description('Currency user'),
        status: Joi.string()
          .valid(...Object.values(PersonStatus))
          .description('Work Status'),
        defaultLevel: Joi.string().description('Default Level'),
        defaultLegalStatus: Joi.string().description('Default Legal Status'),
        defaultWeeklyCapacity: Joi.number().description('Defaul Weekly Capacity'),
        defaultExpertize: Joi.string().description('Default Expertize'),
      }),
    },
    response: {
      ...generateResponseValidation(UserSchema.required()),
    },
  },

  // GET /profile/all
  getAllUsers: {
    request: {},
    response: {
      ...generateResponseValidation(Joi.array().items(UserSchema).required()),
    },
  },
};
