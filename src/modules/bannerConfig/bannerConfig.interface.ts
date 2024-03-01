import { Document, Model } from 'mongoose';
import { QueryResult } from '../../plugin/paginate';

export interface BannerConfig {
  name: string;
  image: string;
  isActive: boolean;
}

export interface IBannerConfigDoc extends BannerConfig, Document {}
export interface IBannerConfigModel extends Model<IBannerConfigDoc> {
  paginate(filter: Record<string, any>, options: Record<string, any>): Promise<QueryResult>;
}

export type UpdateBannerConfigBody = Partial<BannerConfig>;
export type IBannerConfigBody = Partial<BannerConfig>;
