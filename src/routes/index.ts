import { Router } from 'express';
import config from '../config';
import docsRoutes from './docs.routes';

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
