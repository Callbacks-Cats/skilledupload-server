import Joi from 'joi';
import { password } from '../../validation';

export const register = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().when('role', {
      is: 'hirer',
      then: Joi.string().required(),
      otherwise: Joi.forbidden()
    }),
    phoneNumber: Joi.string().when('role', {
      is: 'user',
      then: Joi.string().required(),
      otherwise: Joi.forbidden()
    }),
    password: Joi.string().required().custom(password),
    role: Joi.string().required()
  })
};

export const login = {
  body: Joi.object().keys({
    email: Joi.string().when('role', {
      is: 'hirer',
      then: Joi.string().required(),
      otherwise: Joi.forbidden()
    }),
    password: Joi.string().required(),
    phoneNumber: Joi.string().when('role', {
      is: 'user',
      then: Joi.string().required(),
      otherwise: Joi.forbidden()
    }),
    role: Joi.string().required().valid('user', 'admin', 'hirer')
  })
};

export const forgotPassword = {
  body: Joi.object().keys({
    email: Joi.string().when('role', {
      is: 'hirer',
      then: Joi.string().required(),
      otherwise: Joi.forbidden()
    }),
    role: Joi.string().required().valid('user', 'admin', 'hirer'),
    phoneNumber: Joi.string().when('role', {
      is: 'user',
      then: Joi.string().required(),
      otherwise: Joi.forbidden()
    })
  })
};

export const resetPassword = {
  body: Joi.object().keys({
    password: Joi.string().required().custom(password),
    otp: Joi.string().required().max(4).min(4)
  })
};

export const verifyEmail = {
  query: Joi.object().keys({
    token: Joi.string().required()
  })
};

export const verifyOtp = {
  body: Joi.object().keys({
    otp: Joi.string().required().max(4).min(4)
  })
};
