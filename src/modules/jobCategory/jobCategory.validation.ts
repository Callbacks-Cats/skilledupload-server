import Joi from 'joi';
import { objectId } from '../../validation';

export const createJobCategory = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    description: Joi.string()
  })
};

export const updateJobCategory = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId)
  }),
  body: Joi.object()
    .keys({
      name: Joi.string(),
      description: Joi.string()
    })
    .min(1)
    .messages({
      'object.min': 'You must provide at least one field to update'
    })
};

export const deleteJobCategory = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId)
  })
};
