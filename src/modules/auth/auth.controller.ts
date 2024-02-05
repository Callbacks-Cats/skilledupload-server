import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync, logger } from '../../utils';
import { tokenService } from '../token';
import { userService } from '../user';
import * as authService from './auth.service';

export const register = catchAsync(async (req: Request, res: Response) => {
  logger.info(`Registering user: ${req.body.email}`);
  const user = await userService.registerUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

export const login = catchAsync(async (req: Request, res: Response) => {
  logger.info(`Logging in user: ${req.body.email}`);
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const token = await tokenService.generateAuthTokens(user);
  res.send({ user, token });
});
