import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync, logger } from '../../utils';
import { SendResponse } from '../../utils/SendRespnse';
import { emailService } from '../email';
import { tokenService } from '../token';
import { userService } from '../user';
import * as authService from './auth.service';

export const register = catchAsync(async (req: Request, res: Response) => {
  logger.info(`Registering user: ${req.body.email}`);
  const user = await userService.registerUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  return SendResponse(
    res,
    true,
    { user, tokens },
    httpStatus.CREATED,
    'User registered successfully'
  );
});

export const login = catchAsync(async (req: Request, res: Response) => {
  logger.info(`Logging in user: ${req.body.email}`);
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  const token = await tokenService.generateAuthTokens(user);
  return SendResponse(res, true, { user, token }, httpStatus.OK, 'Login successful');
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  logger.info(`Forgot password request: ${req.body.email}`);
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  return SendResponse(res, true, null, httpStatus.OK, 'Password reset token sent to email');
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  logger.info(`Resetting password`);
  await authService.resetPassword(req.query['token'] as string, req.body.password);
  return SendResponse(res, true, null, httpStatus.OK, 'Password reset successful');
});
