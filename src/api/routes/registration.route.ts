import express from 'express';

// Middlewares
import { authorize } from 'api/middlewares/auth';

// Utils
import { validate } from 'utils/Validation';

// Types
import { UserRole } from 'interfaces/user';

import * as controller from 'api/controllers/registration.controller';
import validation from 'api/validations/registration.validation';

const router = express.Router();

router
  .route('/send-link/admin')
  .post(
    validate(validation.sendLinkByAdmin),
    authorize([UserRole.MANAGER, UserRole.ADMIN], false),
    controller.sendRegisterUrlByAdmin
  );

router
  .route('/send-link/owner')
  .post(validate(validation.sendLinkByOwner), authorize([UserRole.OWNER], false), controller.sendRegisterUrlByOwner);

router
  .route('/')
  .get(validate(validation.checkHash), controller.checkHash)
  .post(validate(validation.registration), controller.registration);

export default router;
