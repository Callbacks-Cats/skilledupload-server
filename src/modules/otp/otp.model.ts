import { Schema, model } from 'mongoose';
import { toJSON } from '../../plugin/toJSON';
import { IOtpDoc, IOtpModel } from './otp.interfaces';

const otpSchema = new Schema<IOtpDoc, IOtpModel>(
  {
    otp: {
      type: String,
      required: true
    },
    user: {
      type: String,
      ref: 'User',
      required: true
    },
    isDepreciated: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// add plugin that converts mongoose to json
otpSchema.plugin(toJSON);

const Otp = model<IOtpDoc, IOtpModel>('Otp', otpSchema);
export default Otp;
