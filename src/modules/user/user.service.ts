import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import { CONTENT_TYPES, FILE_TYPES, SPACE_FOLDERS, USER_ROLES } from '../../constants';
import { updateFileInSpace } from '../../lib';
import { resizeImage } from '../../lib/media.manipulation';
import { ApiError } from '../../utils';
import { IUserDoc, NewCreatedUser, UpdateUserBody } from './user.interface';
import User from './user.model';

/**
 * Create a user
 * @param {NewCreatedUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const createUser = async (userBody: NewCreatedUser): Promise<IUserDoc> => {
  if (await User.isEmailTaken(userBody?.email as string)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  return User.create(userBody);
};

/**
 * Register a user
 * @param {NewRegisteredUser} userBody
 * @returns {Promise<IUserDoc>}
 */
export const registerUser = async (userBody: NewCreatedUser): Promise<IUserDoc> => {
  if (userBody?.role === USER_ROLES.HIRER) {
    if (await User.isEmailTaken(userBody?.email as string)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
  } else if (userBody?.role === USER_ROLES.USER) {
    if (await User.isPhoneNumberTaken(userBody?.phoneNumber as string)) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Phone number already taken');
    }
  }
  return User.create(userBody);
};

/**
 * Get user by id
 * @param {mongoose.Types.ObjectId} id
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserById = async (id: mongoose.Types.ObjectId): Promise<IUserDoc | null> =>
  User.findById(id);

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserByEmail = async (email: string): Promise<IUserDoc | null> =>
  User.findOne({ email });

/**
 * Get user by phone number
 * @param {string} phoneNumber
 * @returns {Promise<IUserDoc | null>}
 */
export const getUserByPhone = async (phoneNumber: string): Promise<IUserDoc | null> =>
  User.findOne({ phoneNumber });

/**
 * Update user by id
 * @param {mongoose.Types.ObjectId} userId
 * @param {UpdateUserBody} updateBody
 * @returns {Promise<IUserDoc | null>}
 */
export const updateUserById = async (
  userId: string,
  updateBody: UpdateUserBody,
  options?: { session?: mongoose.ClientSession }
): Promise<IUserDoc | null> => {
  let user = await getUserById(new mongoose.Types.ObjectId(userId));
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, new Types.ObjectId(userId)))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  user = await User.findByIdAndUpdate(userId, updateBody, {
    new: true,
    runValidators: true,
    session: options?.session
  });
  return user;
};

/**
 * Update profile picture
 * @param {mongoose.Types.ObjectId} userId
 * @param {Buffer} profilePicture
 * @returns {Promise<IUserDoc | null>}
 */
export const updateProfilePicture = async (
  userId: mongoose.Types.ObjectId,
  profilePicture: Buffer
): Promise<IUserDoc | null> => {
  let user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const fileName = `${userId}.jpg`;
  const resizedImage = await resizeImage(profilePicture, { width: 250, height: 250 });

  const session = await mongoose.startSession();

  try {
    session.startTransaction();
    const uploadedImage = await updateFileInSpace(
      FILE_TYPES.IMAGE,
      resizedImage,
      fileName,
      SPACE_FOLDERS.PROFILE_PICTURE,
      CONTENT_TYPES.IMAGE
    );
    if (uploadedImage) {
      user = await updateUserById(
        userId.toString(),
        { profilePicture: uploadedImage.url },
        { session }
      );
    }

    await session.commitTransaction();
    session.endSession();

    return user;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw error;
  }
};
