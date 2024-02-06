import Joi from 'joi';
import { password } from '../../validation';
import { NewCreatedUser } from '../user/user.interface';

const createUserBody: Record<keyof NewCreatedUser, any> = {
  email: Joi.string().email(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  password: Joi.string().required().custom(password),
  phoneNumber: Joi.string(),
  role: Joi.string().required().valid('user', 'admin', 'hirer')
};

export const register = {
  body: Joi.object().keys(createUserBody)
};

export const login = {
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required()
  })
};

export const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().email().required()
  })
};

export const resetPassword = {
  qeury: Joi.object().keys({
    token: Joi.string().required()
  }),
  body: Joi.object().keys({
    password: Joi.string().required().custom(password)
  })
};

export const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required()
  })
};
