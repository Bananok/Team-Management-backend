import Joi from 'joi';
import { generateResponseValidation } from 'utils/Validation';
import { UserSchema } from 'utils/Validation/schemas/user';

import { UserRole, UserRoleForSendLinkAdmin } from 'interfaces/user';

export default {
  // POST /register/send-link/owner
  sendLinkByOwner: {
    request: {
      body: Joi.object({
        email: Joi.string().email().required().description('Email'),
        name: Joi.string().required().description('Name'),
        role: Joi.string()
          .valid(...Object.values(UserRole))
          .required()
          .description('UserRole for owner invite'),
      }),
    },
    response: {
      ...generateResponseValidation(Joi.bool().required()),
    },
  },
  // POST /register/send-link/admin
  sendLinkByAdmin: {
    request: {
      body: Joi.object({
        email: Joi.string().email().required().description('Email'),
        name: Joi.string().required().description('Name'),
        role: Joi.string()
          .valid(...Object.values(UserRoleForSendLinkAdmin))
          .required()
          .description('UserRole for admin invite'),
      }),
    },
    response: {
      ...generateResponseValidation(Joi.bool().required()),
    },
  },
  checkHash: {
    request: {
      query: Joi.object({
        hash: Joi.string().required().description('Hash'),
      }),
    },
    response: {
      ...generateResponseValidation(Joi.bool().required()),
    },
  },
  registration: {
    request: {
      query: Joi.object({
        hash: Joi.string().required().description('Hash'),
      }),
      body: Joi.object({
        password: Joi.string().required().description('Password'),
      }),
    },
    response: {
      ...generateResponseValidation(UserSchema.required()),
    },
  },
};
