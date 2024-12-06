import httpStatus from 'http-status';
import { Types } from 'mongoose';
import { USER_STATUSES } from '../../constants';
import { ApiError } from '../../utils';
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
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = async (resetPasswordToken: string, newPassword: string) => {
  try {
    const resetPasswordTokenDoc = await tokenService.verifyToken(
      resetPasswordToken,
      tokenTypes.RESET_PASSWORD
    );
    const user = await getUserById(new Types.ObjectId(resetPasswordTokenDoc.user));
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, 'No user found with this token');
    }
    await updateUserById(user.id, { password: newPassword });
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
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
    console.log('verifyEmailTokenDoc', verifyEmailTokenDoc);
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
