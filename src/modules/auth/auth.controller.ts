import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { USER_ROLES } from '../../constants';
import { catchAsync, logger } from '../../utils';
import { SendResponse } from '../../utils/SendRespnse';
import { emailService } from '../email';
import { otpService } from '../otp';
import { tokenService } from '../token';
import { userService } from '../user';
import * as authService from './auth.service';

export const register = catchAsync(async (req: Request, res: Response) => {
  logger.info(`Registering user: ${req.body.email}`);
  const user = await userService.registerUser(req.body);

  /**
   * IF user role is user then verify otp via smd & if user role is hirer then verify via email
   */
  if (user.role === USER_ROLES.HIRER) {
    // TODO: this should be sent via task queue
    const verifyEmailToken = await tokenService.generateVerifyEmailToken(user);
    await emailService.sendVerificationEmail(
      user.email,
      verifyEmailToken,
      `${user?.firstName} ${user?.lastName}`
    );
  } else if (user.role === USER_ROLES.USER) {
    // TODO: this should be sent via task queue & sms service. [Right now we are using email service for testing purpose.]
    const otp = await otpService.generateOtp(user.id);
    await emailService.sendVerificationEmail(
      user.email,
      otp,
      `${user?.firstName} ${user?.lastName}`
    );
  }

  return SendResponse(res, true, user, httpStatus.CREATED, 'User registered successfully');
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

export const verifyEmail = catchAsync(async (req: Request, res: Response) => {
  logger.info(`Verifying email`);
  const user = await authService.verifyEmail(req.query['token'] as string);
  const token = await tokenService.generateAuthTokens(user as any);
  return SendResponse(res, true, { user, token }, httpStatus.OK, 'Email verified successfully');
});

export const verfiyOtp = catchAsync(async (req: Request, res: Response) => {
  logger.info(`Verifying otp`);
  const user = await authService.verifyOtp(req.body.otp);
  const token = await tokenService.generateAuthTokens(user as any);
  return SendResponse(res, true, { user, token }, httpStatus.OK, 'OTP verified successfully');
});
