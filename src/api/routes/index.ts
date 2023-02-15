import express, { Router } from 'express';
import swaggerUi from 'swagger-ui-express';

// Config
import configVars from 'config/vars';

// Utils
import { generateSpecification } from 'utils/Validation';

import plannerRoute from 'api/routes/planner.route';
import expertizesRoute from 'api/routes/expertizes.route';
import salaryRoute from 'api/routes/salary.route';
import authRoutes from './auth.route';
import profileRoutes from './profile.route';

import projectsRoutes from './projects.route';
import registrationRoutes from './registration.route';
import clientsRoutes from './clients.route';

const router = Router();

router.use('/auth', authRoutes);

router.use('/profile', profileRoutes);

router.use('/projects', projectsRoutes);

router.use('/clients', clientsRoutes);

router.use('/planner', plannerRoute);

router.use('/registration', registrationRoutes);

router.use('/expertizes', expertizesRoute);

router.use('/salary', salaryRoute);

const swaggerSpecification = generateSpecification(router);

if (configVars.SWAGGER_ENABLED) {
  router.use('/docs/swagger.json', (req, res) => res.json(swaggerSpecification));
  router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecification));
  router.use('/ws-client', express.static('ws-client'));
}

export default router;
