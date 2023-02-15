import Joi from 'joi';

// Types
import { UserRole, PersonStatus } from 'interfaces/user';
import { Currency } from 'interfaces/currency';

export const UserSchema = Joi.object({
  id: Joi.string().min(6).max(128).required().description('User ID'),
  createdAt: Joi.date().iso().description('Created At Date (ISO date)'),
  updatedAt: Joi.date().iso().description('Updated At Date (ISO date)'),
  email: Joi.string().email().required().description('Email'),
  name: Joi.string().required().description('User Name'),
  phone: Joi.string().min(6).max(11).description('Phone number'),
  hasPlanner: Joi.boolean().required().description('User is in planner'),
  role: Joi.string()
    .valid(...Object.values(UserRole))
    .required()
    .description('User role'),
  colour: Joi.string().required().description('User Colour'),
  defaultRate: Joi.number().required().description('Default User Rate'),
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
  workDays: Joi.array().items(Joi.number()).min(1).max(7).description('Work day in week'),
});
