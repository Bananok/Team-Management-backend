import Joi from 'joi';

export const CoefficientSchema = Joi.object({
  id: Joi.string().min(6).max(128).required().description('Coefficient ID'),
  name: Joi.string().min(3).max(128).required().description('Name of Coefficient'),
  coefficient: Joi.number().required().description('Coefficient on Salary'),
});
