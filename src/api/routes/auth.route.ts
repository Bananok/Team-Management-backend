import express from 'express';

// Middlewares
import { authorize } from 'api/middlewares/auth';

// Utils
import { validate } from 'utils/Validation';

// Types
import { UserRole } from 'interfaces/user';

import * as controller from 'api/controllers/auth.controller';
import validation from 'api/validations/auth.validation';

const router = express.Router();

router.route('/login').post(validate(validation.login), controller.login);

router.route('/logout').post(validate(validation.logout), authorize(Object.values(UserRole), false), controller.logout);

router.route('/refresh-token').post(validate(validation.refresh), controller.refresh);

export default router;
