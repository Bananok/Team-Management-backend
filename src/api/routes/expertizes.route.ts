import express from 'express';
import { addExpertize, deleteExpertize, getExpertizes } from 'api/controllers/expertizes.controller';
import { validate } from 'utils/Validation';
import validation from 'api/validations/expertizes.validation';
import { authorize } from 'api/middlewares/auth';
import { UserRole } from 'interfaces/user';

const router = express.Router();

router
  .route('/')
  .post(
    validate(validation.addExpertize),
    authorize([UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER], false),
    addExpertize
  )
  .get(
    validate(validation.getExpertizes),
    authorize([UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER], false),
    getExpertizes
  )
  .delete(
    validate(validation.deleteExpertize),
    authorize([UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER], false),
    deleteExpertize
  );

export default router;
