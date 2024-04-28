import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { USER_ROLES, USER_STATUSES } from '../../constants';
import { ApiError, catchAsync, logger } from '../../utils';
import { SendResponse } from '../../utils/SendRespnse';
import { applicantService } from '../applicant';
import { tokenService } from '../token';
import { userService } from '../user';
import * as authService from './auth.service';

export const register = catchAsync(async (req: Request, res: Response) => {
  logger.info(`Registering user: ${req.body.email}`);
  const user = await userService.registerUser(req.body);

  // Generate auth otp codes
  // const otp = await otpService.generateOtp(user.id);

  if (user.role === USER_ROLES.USER) {
    await applicantService.createApplicant({ user: user.id });
    // send the sms
    // await sendSms(user.phoneNumber as string, `Your OTP is ${otp}`);
    // await sendSms(user.phoneNumber as string, `Your OTP is ${otp}`);
  } else if (user.role === USER_ROLES.HIRER) {
    // await emailService.sendOtpVerificationEmail(user.email as string, otp);
    return SendResponse(res, true, user, httpStatus.CREATED, 'User registered successfully');
  }

  return SendResponse(res, true, user, httpStatus.CREATED, 'User registered successfully');
});

export const login = catchAsync(async (req: Request, res: Response) => {
  logger.info(`Logging in user: ${req.body.email}`);
  const { email, password, role, phoneNumber } = req.body;
  let user;
  if (role === USER_ROLES.HIRER) {
    user = await authService.loginUserWithEmailAndPassword(email, password);
  }
  if (role === USER_ROLES.USER) {
    user = await authService.loginUserWithPhoneNumber(phoneNumber, password);
  }
  // if account is not active
  if (user?.status === USER_STATUSES.INACTIVE) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Account is not active');
  }

  const token = await tokenService.generateAuthTokens(user as any);
  return SendResponse(res, true, { user, token }, httpStatus.OK, 'Login successful');
});

export const forgotPassword = catchAsync(async (req: Request, res: Response) => {
  logger.info(
    `Forgot password request: ${(req?.body?.email && req?.body?.email) || req?.body?.phoneNumber}`
  );
  const data = await authService.forgotPassword(req.body);
  return SendResponse(res, true, data, httpStatus.OK, 'Password reset otp has been sent');
});

export const resetPassword = catchAsync(async (req: Request, res: Response) => {
  logger.info(`Resetting password`);
  const user = await authService.resetPassword(req.body);
  return SendResponse(res, true, user, httpStatus.OK, 'Password reset successful');
});

export const verfiyOtp = catchAsync(async (req: Request, res: Response) => {
  logger.info(`Verifying otp`);
  const user = await authService.verifyOtp(req.body.otp);
  const token = await tokenService.generateAuthTokens(user as any);
  return SendResponse(res, true, { user, token }, httpStatus.OK, 'OTP verified successfully');
});

export const changePassword = catchAsync(async (req: Request, res: Response) => {
  logger.info(`Changing password`);

  const user = await authService.changePassword(req.user as any, req.body);
  return SendResponse(res, true, user, httpStatus.OK, 'Password changed successfully');
});
