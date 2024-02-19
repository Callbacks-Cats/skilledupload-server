import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import { USER_ROLES } from '../../constants';
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
  // if  user body has phone number or email then check that already have an user based on phoneNumber and email

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
  updateBody: UpdateUserBody
): Promise<IUserDoc | null> => {
  const user = await getUserById(new mongoose.Types.ObjectId(userId));
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, new Types.ObjectId(userId)))) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  Object.assign(user, updateBody);
  await user.save();
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

  // TODO-1: If there is a profile picture already, delete it from the digital ocean space.
  // TODO-2: Upload the new profile picture to the digital ocean space and get the URL.
  // TODO-3: Update the user's profile picture URL in the database.

  return user;
};
