import Joi from 'joi';

// Utils
import { generateResponseValidation } from 'utils/Validation';
import { UserSchema } from 'utils/Validation/schemas/user';
import { UserProjectsRole } from 'interfaces/user';
import { ContractStatus, WorkStatus } from 'interfaces/project';

export default {
  // POST /users
  addPerson: {
    request: {
      body: Joi.object({
        userId: Joi.string().min(6).max(128).required().description('User Id'),
        defaultRate: Joi.number().description('Default User Rate'),
        defaultWeeklyCapacity: Joi.number().description('Defaul Weekly Capacity'),
        defaultExpertize: Joi.string().description('Default Expertize'),
        workDays: Joi.array().items(Joi.number()).min(1).max(7).description('[0, 1, 2, 3, 4, 5, 6]'),
      }),
    },
    response: {
      ...generateResponseValidation({
        userId: Joi.string().min(6).max(128).required().description('User Id'),
        defaultRate: Joi.number().description('Default User Rate'),
        defaultWeeklyCapacity: Joi.number().description('Defaul Weekly Capacity'),
        defaultExpertize: Joi.string().description('Default Expertize'),
        workDays: Joi.array().items(Joi.number()).min(1).max(7).description('[0, 1, 2, 3, 4, 5, 6]'),
      }),
    },
  },

  // PATCH /users
  updatePerson: {
    request: {
      body: Joi.object({
        userId: Joi.string().min(6).max(128).required().description('User Id'),
        defaultRate: Joi.number().description('Default User Rate'),
        defaultWeeklyCapacity: Joi.number().description('Defaul Weekly Capacity'),
        defaultExpertize: Joi.string().description('Default Expertize'),
        workDays: Joi.array().items(Joi.number()).min(1).max(7).description('[0, 1, 2, 3, 4, 5, 6]'),
      }),
    },
    response: {
      ...generateResponseValidation({
        userId: Joi.string().min(6).max(128).required().description('User Id'),
        defaultRate: Joi.number().description('Default User Rate'),
        defaultWeeklyCapacity: Joi.number().description('Defaul Weekly Capacity'),
        defaultExpertize: Joi.string().description('Default Expertize'),
        workDays: Joi.array().items(Joi.number()).min(1).max(7).description('[0, 1, 2, 3, 4, 5, 6]'),
      }),
    },
  },

  // GET /users
  getAllusersInPlanner: {
    request: {},
    response: {
      ...generateResponseValidation(Joi.array().items(UserSchema).required()),
    },
  },

  // POST /users/assignment
  assignment: {
    request: {
      body: Joi.object({
        userId: Joi.string().min(6).max(128).required().description('User Id'),
        projectId: Joi.string().min(6).max(128).required().description('Project ID'),
        role: Joi.string()
          .valid(...Object.values(UserProjectsRole))
          .description('UserProject role'),
        rate: Joi.number().required().description('User Rate on Project'),
        expertize: Joi.string().description('Expertize on Project'),
        dailyHours: Joi.number().description('Work Hours in Day'),
        startAt: Joi.date().iso().required().description('Start Date interval Rate'),
        endAt: Joi.date().iso().required().description('End Date interval Rate'),
      }),
    },
    response: {
      ...generateResponseValidation({
        id: Joi.string().min(6).max(128).required().description('UserProject ID'),
        userId: Joi.string().min(6).max(128).required().description('User Id'),
        projectId: Joi.string().min(6).max(128).required().description('Project ID'),
        role: Joi.string()
          .valid(...Object.values(UserProjectsRole))
          .description('UserProject role'),
        rate: Joi.number().required().description('User Rate on Project'),
        expertize: Joi.string().description('Expertize on Project'),
        dailyHours: Joi.number().description('Work Hours in Day'),
        startAt: Joi.date().iso().required().description('Start Date interval Rate'),
        endAt: Joi.date().iso().required().description('End Date interval Rate'),
      }),
    },
  },

  // PATCH /users/assignment
  assignmentUpdate: {
    request: {
      body: Joi.object({
        userId: Joi.string().min(6).max(128).required().description('User Id'),
        projectId: Joi.string().min(6).max(128).required().description('Project ID'),
        role: Joi.string()
          .valid(...Object.values(UserProjectsRole))
          .description('UserProject role'),
        rate: Joi.number().required().description('User Rate on Project'),
        expertize: Joi.string().description('Expertize on Project'),
        dailyHours: Joi.number().description('Work Hours in Day'),
        startAt: Joi.date().required().iso().description('Start Date interval Rate'),
        endAt: Joi.date().required().iso().description('End Date interval Rate'),
      }),
    },
    response: {
      ...generateResponseValidation({
        id: Joi.string().min(6).max(128).required().description('UserProject ID'),
        userId: Joi.string().min(6).max(128).required().description('User Id'),
        projectId: Joi.string().min(6).max(128).required().description('Project ID'),
        role: Joi.string()
          .valid(...Object.values(UserProjectsRole))
          .description('UserProject role'),
        rate: Joi.number().description('User Rate on Project'),
        expertize: Joi.string().description('Expertize on Project'),
        dailyHours: Joi.number().description('Work Hours in Day'),
        startAt: Joi.date().iso().description('Start Date interval Rate'),
        endAt: Joi.date().iso().description('End Date interval Rate'),
      }),
    },
  },

  // GET /users/assignment
  getUserAssignment: {
    request: {
      body: Joi.object({
        userId: Joi.string().min(6).max(128).required().description('User Id'),
        projectId: Joi.string().min(6).max(128).required().description('Project ID'),
      }),
    },
    response: {
      ...generateResponseValidation(
        Joi.array().items({
          id: Joi.string().min(6).max(128).required().description('UserProject ID'),
          userId: Joi.string().min(6).max(128).required().description('User Id'),
          projectId: Joi.string().min(6).max(128).required().description('Project ID'),
          role: Joi.string()
            .valid(...Object.values(UserProjectsRole))
            .description('UserProject role'),
          rate: Joi.number().description('User Rate on Project'),
          expertize: Joi.string().description('Expertize on Project'),
          dailyHours: Joi.number().description('Work Hours in Day'),
          startAt: Joi.date().iso().description('Start Date interval Rate'),
          endAt: Joi.date().iso().description('End Date interval Rate'),
        })
      ),
    },
  },

  // GET /users/assignment/projects
  assignmentProjects: {
    request: {
      body: Joi.object({
        userId: Joi.string().min(6).max(128).required().description('User Id'),
      }),
    },
    response: {
      ...generateResponseValidation(
        Joi.array().items({
          project: {
            id: Joi.string().min(6).max(128).required().description('UserProject ID'),
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
            colour: Joi.string().description('Project Colour'),
          },
        })
      ),
    },
  },
};
