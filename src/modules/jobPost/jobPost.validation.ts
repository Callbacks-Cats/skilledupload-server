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
