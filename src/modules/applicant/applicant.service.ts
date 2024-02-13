import httpStatus from 'http-status';
import { ApiError } from '../../utils';
import { IApplicantBody, IApplicantDoc } from './applicant.interface';
import Applicant from './applicant.model';

/**
 * Create a new applicant by userId
 * @param {IApplicantBody} applicantBody
 * @returns {Promise<IApplicantDoc>}
 */
export const createApplicant = async (applicantBody: IApplicantBody): Promise<IApplicantDoc> => {
  return await Applicant.create(applicantBody);
};

/**
 * Get applicant by userId
 * @param {string} userId
 * @returns {Promise<IApplicantDoc>}
 */
export const getApplicantByUserId = async (userId: string): Promise<IApplicantDoc | null> => {
  return await Applicant.findOne({
    user: userId
  }).populate('user');
};

/**
 * Update applicant by userId
 * @param {string} userId
 * @param {IApplicantBody} applicantBody
 * @returns {Promise<IApplicantDoc>}
 */
export const udpateApplicantByUserId = async (
  userId: string,
  applicantBody: IApplicantBody
): Promise<IApplicantDoc | null> => {
  const applicant = await getApplicantByUserId(userId);
  if (!applicant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Applicant not found');
  }
  Object.assign(applicant, applicantBody);
  await applicant.save();
  return applicant;
};
