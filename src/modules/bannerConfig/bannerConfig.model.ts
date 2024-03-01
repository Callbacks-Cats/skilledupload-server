import { Schema, model } from 'mongoose';
import paginate from '../../plugin/paginate';
import { toJSON } from '../../plugin/toJSON';
import { IBannerConfigDoc, IBannerConfigModel } from './bannerConfig.interface';

const bannerConfigSchema = new Schema<IBannerConfigDoc, IBannerConfigModel>(
  {
    name: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    },
    isActive: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// plugin
bannerConfigSchema.plugin(toJSON);
bannerConfigSchema.plugin(paginate);

const BannerConfig = model<IBannerConfigDoc, IBannerConfigModel>(
  'BannerConfig',
  bannerConfigSchema
);

export default BannerConfig;
