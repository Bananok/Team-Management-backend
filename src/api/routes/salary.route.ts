import express from 'express';
import { addCoefficient, getCoefficients } from 'api/controllers/salary-coefficients.controller';
import { validate } from 'utils/Validation';
import validation from 'api/validations/salary.validation';
import { authorize } from 'api/middlewares/auth';
import { UserRole } from 'interfaces/user';

const router = express.Router();

router
  .route('/coefficients')
  .post(
    validate(validation.addCoefficient),
    authorize([UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER], false),
    addCoefficient
  )
  .get(
    validate(validation.getCoefficient),
    authorize([UserRole.OWNER, UserRole.ADMIN, UserRole.MANAGER], false),
    getCoefficients
  );

export default router;
