import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { CONTENT_TYPES, FILE_TYPES, RESUME_STATUS, SPACE_FOLDERS } from '../../constants';
import { updateFileInSpace } from '../../lib';
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
  return await Applicant.findOne({ user: userId }).populate('user');
};
/**
 * Update applicant by userId
 * @param {string} userId
 * @param {IApplicantBody} applicantBody
 * @returns {Promise<IApplicantDoc>}
 */
export const udpateApplicantByUserId = async (
  userId: string,
  applicantBody: IApplicantBody,
  options?: { session?: mongoose.ClientSession }
): Promise<IApplicantDoc | null> => {
  let applicant = await getApplicantByUserId(userId);
  if (!applicant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Applicant not found');
  }
  applicant = await Applicant.findOneAndUpdate({ user: userId }, applicantBody, {
    new: true,
    runValidators: true,
    session: options?.session
  });
  return applicant;
};

/**
 * Upload resume
 * @param {string} userId
 * @param {Buffer} file
 * @returns {Promise<IApplicantDoc>}
 */
export const uploadResume = async (userId: string, file: Buffer): Promise<IApplicantDoc | null> => {
  const applicant = await getApplicantByUserId(userId);
  if (!applicant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Applicant not found');
  }

  let fileName = `resume-${userId}.pdf`;

  const session = await Applicant.startSession();

  try {
    session.startTransaction();
    // TODO-1: Upload file to the Digital Ocean Space
    const updatedFile = await updateFileInSpace(
      FILE_TYPES.FILE,
      file,
      fileName,
      SPACE_FOLDERS.RESUME,
      CONTENT_TYPES.FILE
    );

    // TODO-2: Save the file url to the applicant document
    if (updatedFile) {
      const updatedApplicant = await udpateApplicantByUserId(
        userId,
        {
          resume: {
            file: updatedFile.url,
            status: RESUME_STATUS.PENDING,
            date: new Date()
          }
        },
        { session }
      );
      await session.commitTransaction();
      session.endSession();
      return (updatedApplicant as IApplicantDoc).populate('user');
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Resume could not be uploaded. Please try again'
    );
  }
  return applicant;
};

/**
 * Get resumes which are pending
 * @returns {Promise<IApplicantDoc[]>}
 */
export const getPendingResumes = async (): Promise<IApplicantDoc[]> => {
  return await Applicant.find({ 'resume.status': RESUME_STATUS.PENDING }).populate('user');
};
