import { Router } from 'express';

// Middlewares
import { authorize } from 'api/middlewares/auth';

// Utils
import { validate } from 'utils/Validation';

// Types
import { UserRole } from 'interfaces/user';

import * as controller from 'api/controllers/profile.controller';
import validation from 'api/validations/profile.validation';

const router = Router();

router
  .route('/')
  .get(authorize(Object.values(UserRole), false), validate(validation.getProfile), controller.getProfile)
  .patch(authorize(Object.values(UserRole), false), validate(validation.updateProfile), controller.updateProfile);

router
  .route('/all')
  .get(validate(validation.getAllUsers), authorize(Object.values(UserRole), false), controller.getAllUsers);

export default router;
