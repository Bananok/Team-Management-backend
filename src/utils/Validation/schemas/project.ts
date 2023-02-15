import Joi from 'joi';
import { ContractStatus, WorkStatus } from 'interfaces/project';
import { Currency } from 'interfaces/currency';

export const ProjectSchema = Joi.object({
  name: Joi.string().min(3).max(30).required().description('Project Name'),
  startAt: Joi.date().iso().description('Start date'),
  endAt: Joi.date().iso().description('End date'),
  billableStatus: Joi.boolean().required().description('Actual Contract'),
  clientId: Joi.string().min(6).max(128).description('Client ID'),
  manager: Joi.string().required().description('Manager on Project'),
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
  colour: Joi.string().required().description('Project Colour'),
});
