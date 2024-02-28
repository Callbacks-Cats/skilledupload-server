import Joi from 'joi';
import { objectId } from '../../validation';

export const createJobPost = {
  body: Joi.object().keys({
    title: Joi.string().required(),
    description: Joi.string().required(),
    location: Joi.string().required(),
    date: Joi.date().required(),
    company: Joi.string().required(),
    salary: Joi.number().required(),
    image: Joi.string().required(),
    createdBy: Joi.string().required().custom(objectId)
  })
};

export const getPostBySlug = {
  params: Joi.object().keys({
    slug: Joi.string().required()
  })
};

export const updateJobPost = {
  params: {
    slug: Joi.string().required()
  },
  body: Joi.object()
    .keys({
      title: Joi.string(),
      description: Joi.string(),
      location: Joi.string(),
      date: Joi.date(),
      company: Joi.string(),
      salary: Joi.number(),
      image: Joi.string(),
      createdBy: Joi.string().custom(objectId)
    })
    .min(1)
    .messages({
      'object.min': 'You must provide at least one field to update'
    })
};
