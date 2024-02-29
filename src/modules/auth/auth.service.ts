import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { USER_ROLES, USER_STATUSES } from '../../constants';
import { ApiError } from '../../utils';
import { emailService } from '../email';
import { otpService } from '../otp';
import Otp from '../otp/otp.model';
import { Token, tokenService, tokenTypes } from '../token';
import { IUserDoc } from '../user/user.interface';
import { getUserByEmail, getUserById, getUserByPhone, updateUserById } from '../user/user.service';

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
export const loginUserWithEmailAndPassword = async (
  email: string,
  password: string
): Promise<IUserDoc> => {
  const user = await getUserByEmail(email);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  return user;
};

/**
 * Login with phone number and password
 * @param {string} phoneNumber
 * @param {string} password
 * @returns {Promise<IUserDoc>}
 */
export const loginUserWithPhoneNumber = async (
  phoneNumber: string,
  password: string
): Promise<IUserDoc> => {
  const user = await getUserByPhone(phoneNumber);
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect phone number or password');
  }
  return user;
};

/**
 * Forgot password request via email & sms top
 * @param {any} req.body
 * @returns {Promise<void>}
 */
export const forgotPassword = async (body: {
  email?: string;
  phoneNumber?: string;
  role: string;
}) => {
  let user;

  if (body.role === USER_ROLES.HIRER) {
    user = await getUserByEmail(body.email as string);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No user found with this email');
    }
    const otp = await otpService.generateOtp(user?.id as string);
    await emailService.sendForgotPasswordOtpEmail(user?.email as string, otp);
    return user;
  } else if (body.role === USER_ROLES.USER) {
    user = await getUserByPhone(body.phoneNumber as string);
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No user found with this phone number');
    }
    const otp = await otpService.generateOtp(user?.id as string);
    return { user, otp }; // TODO: Remove otp from here after implementing sms otp feature
  }
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = async (body: { otp: number; password: string }) => {
  try {
    const otpDoc = await otpService.verifyOtp(body.otp.toString());
    if (!otpDoc) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid otp');
    }
    if (otpDoc.isDepreciated) {
      throw new ApiError(httpStatus.UNAUTHORIZED, 'Otp is already used');
    }
    const user = await getUserById(new Types.ObjectId(otpDoc.user));
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No user found with this otp');
    }
    await user.changePassword(body.password);
    await Otp.deleteMany({ user: user.id });
    return user;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password reset failed');
  }
};

/**
 * Verify email
 * @param {string} verifyEmailToken
 * @returns {Promise<IUserDoc | null>}
 */
export const verifyEmail = async (verifyEmailToken: string): Promise<IUserDoc | null> => {
  try {
    const verifyEmailTokenDoc = await tokenService.verifyToken(
      verifyEmailToken,
      tokenTypes.VERIFY_EMAIL
    );

    const user = await getUserById(new Types.ObjectId(verifyEmailTokenDoc.user));
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No user found with this token');
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    const udpatedUser = await updateUserById(user.id, { status: USER_STATUSES.ACTIVE });
    return udpatedUser;
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Email verification failed');
  }
};

/**
 * Verify otp
 * @param {string} otp
 * @returns {Promise<IUserDoc | null>}
 */
export const verifyOtp = async (otp: string): Promise<IUserDoc | null> => {
  const otpDoc = await otpService.verifyOtp(otp);
  const user = await getUserById(new Types.ObjectId(otpDoc.user));
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'No user found with this otp');
  }
  const updatedUser = await updateUserById(user.id, { status: USER_STATUSES.ACTIVE });
  await Otp.deleteMany({ user: user.id });
  return updatedUser;
};
