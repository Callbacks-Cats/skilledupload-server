import { Document, Model } from 'mongoose';
import { QueryResult } from '../../plugin/paginate';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  role: string;
  status: string;
  profilePicture?: string;
}

export interface IUserDoc extends IUser, Document {
  isPasswordMatch(password: string): boolean;
}

export interface IUserModel extends Model<IUserDoc> {
  isEmailTaken(email: string): boolean;
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateUserBody = Partial<IUser>;
export type IUserBody = Partial<IUser>;

export type NewCreatedUser = Omit<IUser, 'status' | 'profilePicture'>;
