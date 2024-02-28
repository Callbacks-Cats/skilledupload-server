import { Schema, model } from 'mongoose';
import { JOB_POST_STATUSES } from '../../constants';
import paginate from '../../plugin/paginate';
import { toJSON } from '../../plugin/toJSON';
import { IJobPostDoc, IJobPostModel } from './jobPost.interface';

const jobPostSchema = new Schema<IJobPostDoc, IJobPostModel>(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    salary: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: Object.values(JOB_POST_STATUSES),
      default: JOB_POST_STATUSES.PENDING
    },
    image: {
      type: String
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    slug: {
      type: String
    }
  },
  { timestamps: true }
);

// plugins
jobPostSchema.plugin(toJSON);
jobPostSchema.plugin(paginate);

/**
 * Add slug before saving to the database
 */
jobPostSchema.pre<IJobPostDoc>('save', function (next) {
  const date = new Date(this.date);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  this.slug =
    this.title.split(' ').join('-') + '-' + [year, month, day, hours, minutes, seconds].join('-');
  next();
});

const JobPost = model<IJobPostDoc, IJobPostModel>('JobPost', jobPostSchema);
export default JobPost;
