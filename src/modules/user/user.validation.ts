import Joi from 'joi';
import { objectId } from '../../validation';

export const createUser = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().required().valid('user', 'admin', 'hirer'),
    email: Joi.string().when('role', {
      is: 'hirer',
      then: Joi.string().required(),
      otherwise: Joi.forbidden()
    }),
    phoneNumber: Joi.string().when('role', {
      is: 'user',
      then: Joi.string().required(),
      otherwise: Joi.forbidden()
    })
  })
};

export const getUserById = {
  params: Joi.object({
    userId: Joi.string().required().custom(objectId)
  })
};

// TODO: update user profile picture validation. Payload will be a form data
