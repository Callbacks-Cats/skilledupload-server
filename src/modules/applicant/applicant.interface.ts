import { Document, Model, ObjectId } from 'mongoose';
import { QueryResult } from '../../plugin/paginate';

export interface IApplicant {
  user: ObjectId;
  resume?: string;
  intro?: string;
  skills?: {
    jobCategory: ObjectId;
    yearsOfExperience: number;
  }[];
  videoResume?: {
    file: string;
  }[];
  education?: {
    title: string;
    year: string;
  };
  status: string;
  slug: string;
}

export interface IApplicantDoc extends IApplicant, Document {}
export interface IApplicantModel extends Model<IApplicantDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateApplicantBody = Partial<IApplicant>;
export type IApplicantBody = Partial<IApplicant>;
export type NewCreatedApplicant = Omit<IApplicant, 'user'>;
