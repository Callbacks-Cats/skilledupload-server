// user.model.ts
import bcrypt from 'bcryptjs';
import mongoose, { Schema } from 'mongoose';
import { roles } from '../../config/roles';
import { USER_STATUSES } from '../../constants';
import paginate from '../../plugin/paginate';
import { toJSON } from '../../plugin/toJSON';
import { IUserDoc, IUserModel } from './user.interface';

const userSchema = new Schema<IUserDoc, IUserModel>(
  {
    firstName: {
      type: String,
      required: true,
      trim: true
    },
    lastName: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phoneNumber: {
      type: String,
      trim: true,
      default: ''
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 4,
      validate(value: string) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user'
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUSES),
      default: USER_STATUSES.ACTIVE // TODO: Will be changed to INACTIVE
    },

    profilePicture: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

// add plugin to converts to mongoose to json & paginate
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static(
  'isEmailTaken',
  async function (email: string, excludeUserId: mongoose.ObjectId): Promise<boolean> {
    if (!email) {
      return false; // If email is not provided, it cannot be taken
    }
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  }
);

/**
 * Check if phone number is taken
 * @param {string} phoneNumber - The user's phone number
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.static(
  'isPhoneNumberTaken',
  async function (phoneNumber: string, excludeUserId: mongoose.ObjectId): Promise<boolean> {
    if (!phoneNumber) {
      return false; // If phoneNumber is not provided, it cannot be taken
    }
    const user = await this.findOne({ phoneNumber, _id: { $ne: excludeUserId } });
    return !!user;
  }
);

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.method('isPasswordMatch', async function (password: string): Promise<boolean> {
  const user = this;
  return bcrypt.compare(password, user.password);
});

/**
 * Change user's password
 * @param {string} newPassword
 * @returns {Promise<IUserDoc>}
 */
userSchema.method('changePassword', async function (newPassword: string): Promise<IUserDoc> {
  const user = this;
  user.password = newPassword;
  await user.save();
  return user;
});

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const User = mongoose.model<IUserDoc, IUserModel>('User', userSchema);

export default User;
