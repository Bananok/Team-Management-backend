import express from 'express';

import {
  addUserOnProject,
  deleteUserOnProject,
  getProjectsByUserId,
  getUsersByProjectId,
} from 'api/controllers/user-projects.controller';

import { authorize } from 'api/middlewares/auth';

import { UserRole } from 'interfaces/user';

import { validate } from 'utils/Validation';

import validation from 'api/validations/user-projects.validation';

const router = express.Router();

router
  .route('/:projectId/users/add')
  .post(
    validate(validation.addUserOnProject),
    authorize([UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER], false),
    addUserOnProject
  );
router
  .route('/users/:userId')
  .get(validate(validation.getProjectsByUserId), authorize(Object.values(UserRole)), getProjectsByUserId);
router
  .route('/:projectId/users')
  .get(validate(validation.getUsersByProjectId), authorize(Object.values(UserRole)), getUsersByProjectId);
router
  .route('/:projectId/users/delete')
  .delete(
    validate(validation.deleteUserOnProject),
    authorize([UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER], false),
    deleteUserOnProject
  );

export default router;
