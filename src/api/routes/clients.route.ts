import express from 'express';

import { validate } from 'utils/Validation';

import { authorize } from 'api/middlewares/auth';

import { addClient, getAllClients, getClient, updateClient } from 'api/controllers/clients.controller';

import validation from 'api/validations/clients.validation';
import { UserRole } from 'interfaces/user';

const router = express.Router();

router
  .route('/')
  .post(
    validate(validation.addClient),
    authorize([UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER], false),
    addClient
  );

router
  .route('/:clientId')
  .get(validate(validation.getClient), authorize([UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER], false), getClient);

router
  .route('/')
  .get(
    validate(validation.getAllClients),
    authorize([UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER], false),
    getAllClients
  );

router
  .route('/')
  .patch(
    validate(validation.updateClient),
    authorize([UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER], false),
    updateClient
  );

export default router;
