import Joi from 'joi';

// Utils
import { generateResponseValidation } from 'utils/Validation';

// Schemas
import { ProjectSchema } from 'utils/Validation/schemas/project';
import { UserSchema } from 'utils/Validation/schemas/user';
import { UserProjectsRole } from 'interfaces/user';

export default {
  // POST /user-projects/:projectId/users/add
  addUserOnProject: {
    request: {
      body: Joi.object({
        userId: Joi.string().min(6).max(128).required().description('User ID'),
        role: UserProjectsRole,
        dailyHours: Joi.string().min(1).max(30).required().description('hour in week'),
        startAt: Joi.date().iso().description('Start date'),
        endAt: Joi.date().iso().description('End date'),
      }),
      params: Joi.object({
        projectId: Joi.string().min(6).max(128).required().description('Project ID'),
      }),
    },
    response: {
      ...generateResponseValidation(
        Joi.array()
          .items(
            Joi.object({
              id: Joi.string().min(6).max(128).required().description('UserProject ID'),
              userId: Joi.string().min(6).max(128).required().description('User ID'),
              projectId: Joi.string().min(6).max(128).required().description('Project ID'),
              role: Joi.string()
                .valid(...Object.values(UserProjectsRole))
                .required()
                .description('UserProject role'),
              createdAt: Joi.date().iso().description('Created At Date (ISO date)'),
              updatedAt: Joi.date().iso().description('Updated At Date (ISO date)'),
              deletedAt: Joi.date().iso().description('Delete At Date (ISO date)') || null,
              project: ProjectSchema,
              user: UserSchema,
            })
          )
          .required()
      ),
    },
  },

  // POST /user-projects/:projectId/users/delete
  deleteUserOnProject: {
    request: {
      body: Joi.object({
        userId: Joi.string().min(6).max(128).required().description('User ID'),
      }),
      params: Joi.object({
        projectId: Joi.string().min(6).max(128).required().description('Project ID'),
      }),
    },
    response: {
      ...generateResponseValidation('Ok'),
    },
  },

  // GET /user-projects/users/:userId
  getProjectsByUserId: {
    request: {
      params: Joi.object({
        userId: Joi.string().min(6).max(128).required().description('User ID'),
      }),
    },
    response: {
      ...generateResponseValidation(
        Joi.array()
          .items(
            Joi.object({
              id: Joi.string().min(6).max(128).required().description('UserProject ID'),
              userId: Joi.string().min(6).max(128).required().description('User ID'),
              projectId: Joi.string().min(6).max(128).required().description('Project ID'),
              role: Joi.string()
                .valid(...Object.values(UserProjectsRole))
                .required()
                .description('UserProject role'),
              createdAt: Joi.date().iso().description('Created At Date (ISO date)'),
              updatedAt: Joi.date().iso().description('Updated At Date (ISO date)'),
              deletedAt: Joi.date().iso().description('Delete At Date (ISO date)') || null,
              project: ProjectSchema,
            })
          )
          .required()
      ),
    },
  },

  // GET /user-projects/:projectId/users
  getUsersByProjectId: {
    request: {
      params: Joi.object({
        projectId: Joi.string().min(6).max(128).required().description('User ID'),
      }),
    },
    response: {
      ...generateResponseValidation(
        Joi.array()
          .items(
            Joi.object({
              id: Joi.string().min(6).max(128).required().description('UserProject ID'),
              userId: Joi.string().min(6).max(128).required().description('User ID'),
              projectId: Joi.string().min(6).max(128).required().description('Project ID'),
              role: Joi.string()
                .valid(...Object.values(UserProjectsRole))
                .required()
                .description('UserProject role'),
              createdAt: Joi.date().iso().description('Created At Date (ISO date)'),
              updatedAt: Joi.date().iso().description('Updated At Date (ISO date)'),
              deletedAt: Joi.date().iso().description('Delete At Date (ISO date)') || null,
              user: UserSchema,
            })
          )
          .required()
      ),
    },
  },

  // POST /:userProjectId/allocation
  addAllocation: {
    request: {
      params: Joi.object({
        userProjectId: Joi.string().min(6).max(128).required().description('UserProject ID'),
      }),
      body: Joi.object({
        dailyHours: Joi.string().min(1).max(30).required().description('hour in week'),
        startAt: Joi.date().iso().description('Start date'),
        endAt: Joi.date().iso().description('End date'),
      }),
    },
    response: {
      ...generateResponseValidation(
        Joi.object({
          dailyHours: Joi.string().min(1).max(30).required().description('hour in week'),
          startAt: Joi.date().iso().description('Start date'),
          endAt: Joi.date().iso().description('End date'),
        }).required()
      ),
    },
  },

  // GET /:userProjectId/allocation
  getAllocation: {
    request: {
      params: Joi.object({
        userProjectId: Joi.string().min(6).max(128).required().description('UserProject ID'),
      }),
    },
    response: {
      ...generateResponseValidation(
        Joi.object({
          dailyHours: Joi.string().min(1).max(30).required().description('hour in week'),
          startAt: Joi.date().iso().description('Start date'),
          endAt: Joi.date().iso().description('End date'),
        }).required()
      ),
    },
  },
};
