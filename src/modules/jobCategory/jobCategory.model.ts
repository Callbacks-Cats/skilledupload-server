import { Schema, model } from 'mongoose';
import paginate from '../../plugin/paginate';
import { toJSON } from '../../plugin/toJSON';
import { IJobCategoryDoc, IJobCategoryModel } from './jobCategory.interface';

const jobCategorySchema = new Schema<IJobCategoryDoc, IJobCategoryModel>(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    image: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// plugin
jobCategorySchema.plugin(toJSON);
jobCategorySchema.plugin(paginate);

const JobCategory = model<IJobCategoryDoc, IJobCategoryModel>('JobCategory', jobCategorySchema);
export default JobCategory;
