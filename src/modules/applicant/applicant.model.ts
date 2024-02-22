import { Schema, Types, model } from 'mongoose';
import { RESUME_STATUS } from '../../constants';
import paginate from '../../plugin/paginate';
import { toJSON } from '../../plugin/toJSON';
import { IApplicantDoc, IApplicantModel } from './applicant.interface';

const applicantSchema = new Schema<IApplicantDoc, IApplicantModel>(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    },
    resume: {
      type: String
    },
    intro: {
      type: String
    },
    skills: {
      type: [String]
    },
    videoResume: [
      {
        file: {
          type: String,
          validate: {
            validator: function (v: string) {
              return /^(http|https):\/\/[^ "]+$/.test(v);
            },
            message: (props) => `${props.value} is not a valid URL!`
          }
        }
      }
    ],
    education: {
      title: {
        type: String
      },
      year: {
        type: String
      }
    },
    status: {
      type: String,
      enum: Object.values(RESUME_STATUS),
      default: RESUME_STATUS.PENDING
    }
  },
  { timestamps: true }
);

// Plugin
applicantSchema.plugin(toJSON);
applicantSchema.plugin(paginate);

/**
 * @name isProfileComplete
 * @description Check if the user has completed their profile
 * @param {string} userId - The user id
 * @returns {boolean} - True if the user has completed their profile
 */
applicantSchema.statics.isProfileComplete = async function (userId: string): Promise<boolean> {
  const applicant = await this.findOne({ user: userId });
  if (!applicant) {
    return false;
  }

  if (!applicant.resume || !applicant.intro || !applicant.skills || !applicant.education) {
    return false;
  }

  return true;
};
const Applicant = model<IApplicantDoc, IApplicantModel>('Applicant', applicantSchema);

export default Applicant;
