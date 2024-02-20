import { randomInt } from 'crypto';
import httpStatus from 'http-status';
import { ApiError } from '../../utils';
import { IOtpDoc } from './otp.interfaces';
import Otp from './otp.model';

/**
 * Generate otp
 * @returns {string}
 */
export const getOtp = async () => {
  const otp = randomInt(1000, 9999).toString();
  return otp;
};

/**
 * Save a otp
 * @param {string} otp
 * @param {mongoose.Types.ObjectId} userId
 * @param {boolean} [isDepreciated]
 * @returns {Promise<IOtpDoc>}
 */
export const saveOtp = async (
  otp: string,
  userId: string,
  isDepreciated: boolean = false
): Promise<IOtpDoc> => {
  const otpDoc = await Otp.create({
    otp,
    user: userId,
    isDepreciated
  });
  return otpDoc;
};

/**
 * Verify otp and return otp doc (or throw an error if it is not valid)
 * @param {string} otp
 * @param {string} userId
 * @returns {Promise<IOtpDoc>}
 */
export const verifyOtp = async (otp: string): Promise<IOtpDoc> => {
  const otpDoc = await Otp.findOne({ otp, isDepreciated: false });
  if (!otpDoc) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Otp verification failed');
  }
  return otpDoc;
};

/**
 * Generate otp
 * @returns {string}
 * @param {string} userId
 */
export const generateOtp = async (userId: string) => {
  const otp = await getOtp();
  await saveOtp(otp, userId);
  return otp;
};
