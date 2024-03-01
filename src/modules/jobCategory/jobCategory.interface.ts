import { Document, Model } from 'mongoose';
import { QueryResult } from '../../plugin/paginate';

export interface IJobCategory {
  name: string;
  description?: string;
  image: string;
}

export interface IJobCategoryDoc extends IJobCategory, Document {}
export interface IJobCategoryModel extends Model<IJobCategoryDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateJobCategoryBody = Partial<IJobCategory>;
export type IJobCategoryBody = Partial<IJobCategory>;
