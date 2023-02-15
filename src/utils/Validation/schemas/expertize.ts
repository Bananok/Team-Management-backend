import Joi from 'joi';

export const ExpertizeSchema = Joi.object({
  id: Joi.string().min(6).max(128).required().description('Expertize ID'),
  projectId: Joi.string().min(6).max(128).required().description('Project ID'),
  expertize: Joi.string().required().description('Expertize on Project'),
  rate: Joi.number().required().description('Rate on Expertize'),
  startAt: Joi.date().iso().description('Start date'),
});
