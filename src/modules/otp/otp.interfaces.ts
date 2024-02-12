import { Model } from 'mongoose';

export interface Otp {
  otp: string;
  user: string;
  isDepreciated: boolean;
}

export type NewOtp = Omit<Otp, 'isDepreciated'>;

export interface IOtpDoc extends Otp, Document {}
export interface IOtpModel extends Model<IOtpDoc> {}
