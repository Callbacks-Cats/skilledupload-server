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
      file: {
        type: String
      },
      status: {
        type: String,
        enum: Object.values(RESUME_STATUS),
        default: RESUME_STATUS.PENDING
      },
      date: {
        type: Date
      }
    },
    intro: {
      type: String
    },
    skills: {
      type: [String]
    },
    videoResume: {
      type: [String],
      maxlength: 3
    },
    education: [
      {
        school: {
          type: String,
          required: true
        },
        degree: {
          type: String,
          required: true
        },
        fieldOfStudy: {
          type: String
        },
        startYear: {
          type: Number,
          required: true
        },
        endYear: {
          type: Number,
          required: true
        }
      }
    ],
    experience: [
      {
        title: {
          type: String,
          required: true
        },
        company: {
          type: String
        },
        location: {
          type: String
        },
        startDate: {
          type: Date,
          required: true
        },
        endDate: {
          type: Date,
          required: true
        },
        description: {
          type: String
        }
      }
    ]
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
  if (
    !applicant.intro ||
    !applicant.education ||
    applicant.education.length === 0 ||
    !applicant.experience ||
    applicant.experience.length === 0
  ) {
    return false;
  }
  return true;
};

const Applicant = model<IApplicantDoc, IApplicantModel>('Applicant', applicantSchema);
export default Applicant;
