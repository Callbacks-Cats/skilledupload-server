import Joi from 'joi';
import { password } from '../../validation';
import { NewCreatedUser } from './user.interface';

const createUserBody: Record<keyof NewCreatedUser, any> = {
  email: Joi.string().email(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password: Joi.string().required().custom(password),
  phoneNumber: Joi.string(),
  role: Joi.string().required().valid('user', 'admin', 'hirer')
};

export const createUser = {
  body: Joi.object(createUserBody).keys(createUserBody)
};
