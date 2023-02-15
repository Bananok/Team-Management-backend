import Joi from 'joi';
import { PersonStatus } from 'interfaces/user';

export const ClientSchema = Joi.object({
  director: Joi.string().min(3).max(30).required().description('Director Client'),
  contactPerson: Joi.string().min(3).max(30).required().description('Director Client'),
  status: Joi.string()
    .valid(...Object.values(PersonStatus))
    .required()
    .description('Work Status'),
  email: Joi.string().email().required().description('Client Email'),
  legalTin: Joi.string().required().description('legalTin'),
  legalOgrn: Joi.string().required().description('legalOgrn'),
  legalKpp: Joi.string().required().description('legalKpp'),
  legalAddress: Joi.string().required().description('legalAddress'),
  postalAddress: Joi.string().required().description('postalAddress'),
  legalName: Joi.string().required().description('legalName'),
  projectId: Joi.string().description('Project  Id'),
  comment: Joi.string().description('Comment in Clients'),
});
