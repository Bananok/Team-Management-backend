import express from 'express';

import { authorize } from 'api/middlewares/auth';

import {
  addPerson,
  updatePerson,
  getAllUsers,
  assignment,
  assignmentUpdate,
  assignmentProjects,
  getUserAssignment,
} from 'api/controllers/planner.controller';
import { UserRole } from 'interfaces/user';
import { validate } from 'utils/Validation';

import validation from 'api/validations/planner.validation';

const router = express.Router();

router
  .route('/users')
  .get(authorize(Object.values(UserRole), false), validate(validation.getAllusersInPlanner), getAllUsers)
  .post(authorize(Object.values(UserRole), false), validate(validation.addPerson), addPerson)
  .patch(authorize(Object.values(UserRole), false), validate(validation.updatePerson), updatePerson);

router
  .route('/users/assignment')
  .post(authorize(Object.values(UserRole), false), validate(validation.assignment), assignment)
  .patch(authorize(Object.values(UserRole), false), validate(validation.assignmentUpdate), assignmentUpdate)
  .get(authorize(Object.values(UserRole), false), validate(validation.getUserAssignment), getUserAssignment);

router
  .route('/users/assignment/projects')
  .get(authorize(Object.values(UserRole), false), validate(validation.assignmentProjects), assignmentProjects);

export default router;
