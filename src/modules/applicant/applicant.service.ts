import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import {
  CONTENT_TYPES,
  FILE_TYPES,
  RESUME_STATUS,
  SPACE_FOLDERS,
  USER_ROLES,
  USER_STATUSES
} from '../../constants';
import { deleteFileFromSpace, updateFileInSpace } from '../../lib';
import { IOptions } from '../../plugin/paginate';
import { ApiError } from '../../utils';
import { userService } from '../user';
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
export const getApplicantByUserId = async (userId: string): Promise<any> => {
  const user = await userService.getUserById(new Types.ObjectId(userId));
  const applicant = await Applicant.findOne({ user: userId }).populate({
    path: 'skills.jobCategory',
    select: 'name _id'
  });
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (!applicant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Applicant not found');
  }

  const data = {
    id: user?._id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    phoneNumber: user?.phoneNumber,
    role: user?.role,
    status: applicant?.status,
    resume: applicant?.resume,
    intro: applicant?.intro,
    skills: applicant?.skills?.map((skill: any) => {
      // @ts-ignore
      return {
        name: skill?.jobCategory?.name,
        yearsOfExperience: skill?.yearsOfExperience,
        id: skill?.jobCategory?._id
      };
    }),
    videoResume: applicant?.videoResume,
    education: applicant?.education
  };
  return data;
};

/**
 * Get applicant by userId
 * @param {string} slug
 * @returns {Promise<IApplicantDoc>}
 */
export const getApplicantBySlug = async (slug: string): Promise<any> => {
  const applicant = await Applicant.findOne({ slug: slug }).populate({
    path: 'skills.jobCategory',
    select: 'name _id'
  });

  const user = await userService.getUserById(applicant?.user as any);

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (!applicant) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Applicant not found');
  }

  const data = {
    id: user?._id,
    firstName: user?.firstName,
    lastName: user?.lastName,
    phoneNumber: user?.phoneNumber,
    role: user?.role,
    status: applicant?.status,
    resume: applicant?.resume,
    intro: applicant?.intro,
    skills: applicant?.skills?.map((skill: any) => {
      // @ts-ignore
      return {
        name: skill?.jobCategory?.name,
        yearsOfExperience: skill?.yearsOfExperience,
        id: skill?.jobCategory?._id
      };
    }),
    videoResume: applicant?.videoResume,
    education: applicant?.education,
    slug: applicant?.slug
  };
  return data;
};

// export const getApplicantByUserId = async (userId: string): Promise<IApplicantDoc | null> => {
//   const pipeline = [
//     {
//       $match: {
//         user: new mongoose.Types.ObjectId(userId)
//       }
//     },
//     {
//       $lookup: {
//         from: 'users',
//         localField: 'user',
//         foreignField: '_id',
//         as: 'user'
//       }
//     },
//     {
//       $unwind: '$user'
//     },
//     {
//       $replaceRoot: {
//         newRoot: {
//           $mergeObjects: ['$user', '$$ROOT']
//         }
//       }
//     },
//     {
//       $project: {
//         user: 0
//       }
//     }
//   ];

//   const result = await Applicant.aggregate(pipeline);

//   if (result.length === 0) {
//     return null;
//   }

//   return result[0];
// };

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
  applicant = await Applicant.findOneAndUpdate(
    { user: userId },
    { ...applicantBody },
    {
      new: true,
      runValidators: true,
      session: options?.session
    }
  );
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
    console.log('Error: ', error);
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

/**
 * Create a new applicant by admin
 * @param {IApplicantBody} applicantBody
 * @returns {Promise<IApplicantDoc>}
 */
export const createApplicantByAdmin = async (applicantBody: any): Promise<any> => {
  try {
    const userExist = await userService.getUserByPhone(applicantBody.phoneNumber);
    if (userExist) {
      // throw new ApiError(httpStatus.BAD_REQUEST, 'User already exist');
      return {
        message: 'User already exist',
        success: false
      };
    }

    // user paylaod
    const userPayload: any = {
      role: USER_ROLES.USER,
      firstName: applicantBody.firstName,
      lastName: applicantBody.lastName,
      phoneNumber: applicantBody.phoneNumber,
      status: USER_STATUSES.ACTIVE
    };

    const password = userService.generatePassword();

    userPayload['password'] = password;

    const user = await userService.createUser(userPayload as any);

    if (user) {
      const applicantPayload = {
        user: user._id,
        status: RESUME_STATUS.APPROVED,
        intro: applicantBody.intro || '',
        resume: applicantBody.resume || '',
        skills: applicantBody.skills || [],
        videoResume: applicantBody.videoResume || []
      };
      const applicant: any = await Applicant.create(applicantPayload);
      if (applicant) {
        // TODO: send sms
        const userData = await applicant.populate(
          'user',
          'firstName lastName phoneNumber profilePicture role'
        );
        return {
          firstName: applicant.user?.firstName,
          lastName: applicant.user?.lastName,
          phoneNumber: applicant.user?.phoneNumber,
          role: applicant.user?.role,
          resume: applicant.resume,
          intro: applicant.intro,
          skills: applicant.skills,
          videoResume: applicant.videoResume,
          education: applicant.education,
          password // TODO: Remove password from response after implementing sms.
        };
      }
    }
  } catch (error: any) {}
};

/**
 * Get All Applicants
 * @param {IOptions} options
 * @param {filters} filters
 * @returns {Promise<any>}
 */
export const queryApplicants = (filters: any, options: IOptions): Promise<any> => {
  options = { ...options, populate: 'user' };
  return Applicant.paginate(filters, options);
};
