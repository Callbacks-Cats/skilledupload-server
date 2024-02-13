import Joi from 'joi';
import { objectId } from '../../validation';

export const getApplicantByUserId = {
  params: {
    userId: Joi.string().required().custom(objectId)
  }
};

export const createApplicant = {
  body: Joi.object().keys({
    user: Joi.string().required().custom(objectId),
    resume: Joi.array().items(Joi.string()).max(3),
    intro: Joi.string(),
    skills: Joi.array().items(Joi.string()),
    videoResume: Joi.array().items(Joi.string()).max(3),
    education: Joi.array().items(
      Joi.object({
        school: Joi.string().required(),
        degree: Joi.string().required(),
        fieldOfStudy: Joi.string(),
        startYear: Joi.number().required(),
        endYear: Joi.number().required()
      })
    ),
    experience: Joi.array().items(
      Joi.object({
        title: Joi.string().required(),
        company: Joi.string(),
        location: Joi.string(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        description: Joi.string()
      })
    )
  })
};

export const updateApplicant = {
  params: {
    userId: Joi.string().required().custom(objectId)
  },
  body: Joi.object()
    .keys({
      user: Joi.string().required().custom(objectId),
      resume: Joi.array().items(Joi.string()).max(3),
      intro: Joi.string(),
      skills: Joi.array().items(Joi.string()),
      videoResume: Joi.array().items(Joi.string()).max(3),
      education: Joi.array().items(
        Joi.object({
          school: Joi.string().required(),
          degree: Joi.string().required(),
          fieldOfStudy: Joi.string(),
          startYear: Joi.number().required(),
          endYear: Joi.number().required()
        })
      ),
      experience: Joi.array().items(
        Joi.object({
          title: Joi.string().required(),
          company: Joi.string(),
          location: Joi.string(),
          startDate: Joi.date().required(),
          endDate: Joi.date().required(),
          description: Joi.string()
        })
      )
    })
    .min(2)
    .messages({
      'object.min': 'At least one field is required'
    })
};
