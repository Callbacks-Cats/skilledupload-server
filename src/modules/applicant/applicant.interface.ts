import { Document, Model, ObjectId } from 'mongoose';
import { QueryResult } from '../../plugin/paginate';

export interface IApplicant {
  user: ObjectId;
  resume?: string[];
  intro?: string;
  skills?: string[];
  videoResume?: string[];
  education?: {
    school: string;
    degree: string;
    fieldOfStudy?: string;
    startYear: number;
    endYear: number;
  }[];
  experience?: {
    title: string;
    company?: string;
    location?: string;
    startDate: Date;
    endDate: Date;
    description?: string;
  }[];
}

export interface IApplicantDoc extends IApplicant, Document {}
export interface IApplicantModel extends Model<IApplicantDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateApplicantBody = Partial<IApplicant>;
export type IApplicantBody = Partial<IApplicant>;
export type NewCreatedApplicant = Omit<IApplicant, 'user'>;
