import Joi from 'joi';
import { objectId } from '../../validation';

export const addBanner = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    image: Joi.string().required(),
    isActive: Joi.boolean()
  })
};

export const getAllBanners = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1),
    limit: Joi.number().integer().min(1).max(50),
    sortBy: Joi.string(),
    isActive: Joi.boolean()
  })
};

export const updateBanner = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId)
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      image: Joi.string(),
      isActive: Joi.boolean()
    })
    .min(1)
    .message('At least one field must be updated')
};

export const deleteBanner = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId)
  })
};

export const toggoleBannerStatus = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId)
  })
};

export const getBannerById = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId)
  })
};
