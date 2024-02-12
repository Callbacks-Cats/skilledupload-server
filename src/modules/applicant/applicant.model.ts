import { Schema, Types, model } from 'mongoose';
import { IApplicantDoc, IApplicantModel } from './applicant.interface';

const applicationSchema = new Schema<IApplicantDoc, IApplicantModel>(
  {
    user: {
      type: Types.ObjectId,
      ref: 'User',
      required: true
    },
    resume: {
      type: [String]
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

const Applicant = model<IApplicantDoc, IApplicantModel>('Applicant', applicationSchema);
export default Applicant;
