import { Document, Model, ObjectId } from 'mongoose';
import { QueryResult } from '../../plugin/paginate';

export interface IJobPost {
  title: string;
  description: string;
  location: string;
  date: Date;
  company: string;
  salary: number;
  status: string;
  image: string;
  createdBy: ObjectId;
  slug: string;
}

export interface IJobPostDoc extends IJobPost, Document {}
export interface IJobPostModel extends Model<IJobPostDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateJobPostBody = Partial<IJobPost>;
export type IJobPostBody = Partial<IJobPost>;
