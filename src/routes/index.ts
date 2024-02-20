import { Router } from 'express';
import config from '../config';
import applicantRoute from './applicant.route';
import authRoutes from './auth.route';
import docsRoutes from './docs.routes';
import userRoutes from './user.route';

const router = Router();

interface IRoute {
  path: string;
  router: Router;
}

const defaultRoutes: IRoute[] = [];

const devIRoute: IRoute[] = [
  {
    path: '/docs',
    router: docsRoutes
  },
  {
    path: '/users',
    router: userRoutes
  },
  {
    path: '/auth',
    router: authRoutes
  },
  {
    path: '/applicant',
    router: applicantRoute
  }
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.router);
});

if (config.env === 'development') {
  devIRoute.forEach((route) => {
    router.use(route.path, route.router);
  });
}

export default router;
