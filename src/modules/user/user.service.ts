import { Request } from 'express';
import httpStatus from 'http-status';
import mongoose, { Types } from 'mongoose';
import { USER_ROLES } from '../../constants';
import { deleteFileFromLocal, uploadFileToLocal } from '../../lib/files';
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
  req: Request,
  userId: mongoose.Types.ObjectId,
  profilePicture: any
): Promise<IUserDoc | null> => {
  let user = await getUserById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
  }
  const oldImage = user.profilePicture;
  // const currentTimeStamp = moment().format('YYYY-MM-DD-HH-mm-ss');

  // const fileName = `${userId}-${currentTimeStamp}.jpg`;
  // const resizedImage = await resizeImage(profilePicture, { width: 250, height: 250 });

  try {
    // const uploadedImage = await updateFileInSpace(
    //   FILE_TYPES.IMAGE,
    //   resizedImage,
    //   fileName,
    //   SPACE_FOLDERS.PROFILE_PICTURE,
    //   CONTENT_TYPES.IMAGE
    // );
    const uploadedImage = await uploadFileToLocal(req, profilePicture);
    if (uploadedImage) {
      // await deleteFileFromSpace(
      //   FILE_TYPES.IMAGE,
      //   oldImage as string,
      //   SPACE_FOLDERS.PROFILE_PICTURE
      // );
      if (oldImage) {
        await deleteFileFromLocal(oldImage as string);
      }
      user = await updateUserById(userId.toString(), { profilePicture: uploadedImage as string });
    }

    return user;
  } catch (error) {
    throw error;
  }
};

/**
 * Generate a random password
 * @returns {string}
 */
export const generatePassword = () => {
  var length = 10;
  var capitalLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  var lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
  var numbers = '0123456789';
  var specialCharacters = '@#$%&';
  var charset = capitalLetters + lowercaseLetters + numbers + specialCharacters;
  var password = '';
  password += capitalLetters.charAt(Math.floor(Math.random() * capitalLetters.length));
  password += lowercaseLetters.charAt(Math.floor(Math.random() * lowercaseLetters.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  for (var i = 3; i < length; i++) {
    var charIndex = Math.floor(Math.random() * charset.length);
    password += charset.charAt(charIndex);
  }
  password = password
    .split('')
    .sort(function () {
      return 0.5 - Math.random();
    })
    .join('');

  return password;
};
