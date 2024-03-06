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
    skills: [
      {
        jobCategory: {
          type: Types.ObjectId,
          ref: 'JobCategory'
        },
        yearsOfExperience: {
          type: Number
        }
      }
    ],
    videoResume: [
      {
        file: {
          type: String,
          default: ''
          // validate: {
          //   validator: function (v: string) {
          //     return /^(http|https):\/\/[^ "]+$/.test(v);
          //   },
          //   message: (props) => `${props.value} is not a valid URL!`
          // }
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
    },
    slug: {
      type: String,
      unique: true
    }
  },
  { timestamps: true }
);

// Create compound index and text index
applicantSchema.index({ 'user.firstName': 'text', 'user.lastName': 'text' });

// Plugin
applicantSchema.plugin(toJSON);
applicantSchema.plugin(paginate);

// Pre-save hook to generate slug
applicantSchema.pre<IApplicantDoc>('save', async function (next) {
  if (!this.isModified('user') || !this.isNew) {
    return next();
  }

  const user: any = await this.model('User').findById(this.user);
  if (!user) {
    return next(new Error('Associated user not found'));
  }

  // current date and time like: 2021-08-01T12-00-00
  const date = new Date().toISOString().split('T')[0].replace(/-/g, '');
  this.slug = `${user.firstName.toLowerCase()}-${user.lastName.toLowerCase()}-${date}`;
  next();
});

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
