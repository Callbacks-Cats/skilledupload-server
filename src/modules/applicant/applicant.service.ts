import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import { CONTENT_TYPES, FILE_TYPES, RESUME_STATUS, SPACE_FOLDERS } from '../../constants';
import { deleteFileFromSpace, updateFileInSpace } from '../../lib';
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
// export const getApplicantByUserId = async (userId: string): Promise<IApplicantDoc | null> => {
//   return await Applicant.findOne({ user: userId }).populate('user');
// };
export const getApplicantByUserId = async (userId: string): Promise<IApplicantDoc | null> => {
  const pipeline = [
    {
      $match: {
        user: new Types.ObjectId(userId) // Assuming userId is of type ObjectId
      }
    },
    {
      $lookup: {
        from: 'users', // Assuming the name of the user collection is "users"
        localField: 'user',
        foreignField: '_id',
        as: 'user'
      }
    },
    {
      $unwind: '$user'
    },
    {
      $replaceRoot: {
        newRoot: {
          $mergeObjects: ['$user', '$$ROOT']
        }
      }
    },
    {
      $project: {
        user: 0 // Exclude the embedded user object
      }
    }
  ];

  const result = await Applicant.aggregate(pipeline);

  if (result.length === 0) {
    return null;
  }

  // If there is a match, return the first document (assuming only one match)
  return result[0];
};

/**
 * Get applicant by id
 * @param {string} id
 * @returns {Promise<IApplicantDoc>}
 */
export const getApplicantById = async (id: string): Promise<IApplicantDoc | null> => {
  return await Applicant.findById(id);
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

  const currentTimestamp = new Date().getTime();
  let fileName = `resume-${userId}-${currentTimestamp}.pdf`;

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
      // delete old file form space
      if (applicant.resume) {
        await deleteFileFromSpace(
          FILE_TYPES.FILE,
          applicant.resume.split('/').pop() as string,
          SPACE_FOLDERS.RESUME
        );
      }

      const updatedApplicant = await udpateApplicantByUserId(
        userId,
        {
          resume: updatedFile.url
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
 * Upload video resume
 * @param {string} userId
 * @param {Buffer} file
 * @returns {Promise<IApplicantDoc>}
 */
export const uploadVideoResume = async (
  userId: string,
  file: Buffer
): Promise<IApplicantDoc | null> => {
  const applicant = await getApplicantByUserId(userId);
  if (!applicant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Applicant not found');
  }

  if (applicant.videoResume?.length === 3) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'You can only upload a maximum of 3 video resumes');
  }

  // TODO-2: Save the file url to the applicant document
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    let uniqueId = new mongoose.Types.ObjectId().toHexString();
    let fileName = `video-${userId}-${uniqueId}.mp4`;

    // TODO-1: Upload file to the Digital Ocean Space
    const uploadedFile = await updateFileInSpace(
      FILE_TYPES.VIDEO,
      file,
      fileName,
      SPACE_FOLDERS.VIDEO_RESUME,
      CONTENT_TYPES.VIDEO
    );
    if (uploadedFile.success) {
      const updatedApplicant = await udpateApplicantByUserId(
        userId,
        {
          $push: {
            videoResume: {
              file: uploadedFile.url
            }
          }
        } as Partial<IApplicantDoc>,
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
      'Video resume could not be uploaded. Please try again'
    );
  }
  return applicant;
};

/**
 * Delete a video resume by User
 * @param {string} userId
 * @param {string} videoResumeId
 * @returns {Promise<IApplicantDoc>}
 */
export const deleteVideoResumeByUser = async (
  userId: string,
  videoResumeId: string
): Promise<IApplicantDoc | null> => {
  // get the video resume by id
  let applicant = await getApplicantByUserId(userId);

  if (!applicant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Applicant not found');
  }

  const videoResume = applicant?.videoResume?.find(
    (video: any) => video?._id?.toString() === videoResumeId
  );

  if (!videoResume) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Video resume not found');
  }

  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedFile = await deleteFileFromSpace(
      FILE_TYPES.VIDEO,
      videoResume?.file?.split('/').pop() as string,
      SPACE_FOLDERS.VIDEO_RESUME
    );
    if (deletedFile) {
      applicant = await udpateApplicantByUserId(
        userId,
        {
          $pull: {
            videoResume: {
              _id: videoResumeId
            }
          }
        } as Partial<IApplicantDoc>,
        { session }
      );
      await session.commitTransaction();
      session.endSession();
      return (applicant as IApplicantDoc).populate('user');
    }
    return (applicant as IApplicantDoc).populate('user');
  } catch (error) {
    session.abortTransaction();
    session.endSession();
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR,
      'Video resume could not be deleted. Please try again'
    );
  }
};

/**
 * Approve a resume by admin
 * @param {string} applicantId
 * @returns {Promise<IApplicantDoc>}
 */
export const approveApplicantProfile = async (
  applicantId: string
): Promise<IApplicantDoc | null> => {
  let applicant = await getApplicantById(applicantId);

  if (!applicant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Applicant not found');
  }

  if (applicant.status === RESUME_STATUS.APPROVED) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Applicant profile is already approved');
  }

  applicant = await udpateApplicantByUserId(applicant.user as any, {
    status: RESUME_STATUS.APPROVED
  });

  return (applicant as IApplicantDoc).populate('user');
};
