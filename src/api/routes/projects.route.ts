import express from 'express';

import { addProject, getAllProjects, getProject, updateProject } from 'api/controllers/projects.controller';

import { authorize } from 'api/middlewares/auth';

import { UserRole } from 'interfaces/user';

import { validate } from 'utils/Validation';

import validation from 'api/validations/projects.validation';

const router = express.Router();

router
  .route('/')
  .post(
    validate(validation.addProject),
    authorize([UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER], false),
    addProject
  );
router.route('/:projectId').get(validate(validation.getProject), authorize(Object.values(UserRole), false), getProject);
router.route('/').get(validate(validation.getAllProject), authorize(Object.values(UserRole), false), getAllProjects);

router
  .route('/:projectId')
  .patch(
    validate(validation.updateProject),
    authorize([UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER], false),
    updateProject
  );

export default router;
