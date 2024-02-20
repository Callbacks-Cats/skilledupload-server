import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import passport from 'passport';

import { roleRights } from '../../config/roles';
import { USER_STATUSES } from '../../constants';
import { ApiError } from '../../utils';
import { IUserDoc } from '../user/user.interface';

const verifyCallback =
  (req: Request, resolve: any, reject: any, requiredRights: string[]) =>
  async (err: Error, user: IUserDoc, info: string) => {
    if (err || info || !user) {
      return reject(new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate'));
    }
    if (user?.status !== USER_STATUSES.ACTIVE) {
      return reject(
        new ApiError(httpStatus.UNAUTHORIZED, 'Your account is not active. Please contact admin.')
      );
    }
    req.user = user;

    if (requiredRights.length) {
      const userRights = roleRights.get(user.role);
      if (!userRights) return reject(new ApiError(httpStatus.FORBIDDEN, 'You are not authorized'));
      const hasRequiredRights = requiredRights.every((requiredRight: string) =>
        userRights.includes(requiredRight)
      );
      if (!hasRequiredRights && req.params['userId'] !== user.id) {
        return reject(new ApiError(httpStatus.FORBIDDEN, 'Your permission is not enough'));
      }
    }

    resolve();
  };

const authMiddleware =
  (...requiredRights: string[]) =>
  async (req: Request, res: Response, next: NextFunction) =>
    new Promise<void>((resolve, reject) => {
      passport.authenticate(
        'jwt',
        { session: false },
        verifyCallback(req, resolve, reject, requiredRights)
      )(req, res, next);
    })
      .then(() => next())
      .catch((err) => next(err));

export default authMiddleware;
