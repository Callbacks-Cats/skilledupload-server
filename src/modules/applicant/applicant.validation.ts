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
  body: Joi.object()
    .keys({
      resume: Joi.array().items(Joi.string()).max(3),
      intro: Joi.string(),
      // skills: Joi.array().items(Joi.string()),
      skills: Joi.array().items(
        Joi.object({
          jobCategory: Joi.string().required().custom(objectId),
          yearsOfExperience: Joi.number().required()
        })
      ),
      videoResume: Joi.array().items(Joi.string()).max(3),
      education: Joi.object({
        title: Joi.string().required(),
        year: Joi.number().required()
      })
    })
    .min(1)
    .messages({
      'object.min': 'At least one field is required'
    })
};

export const resumeSchema = Joi.object({
  resume: Joi.object().custom((value: Express.Multer.File, helpers) => {
    const allowedMimetypes: string[] = [
      'image/jpeg',
      'image/png',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv'
    ];

    if (!value || !allowedMimetypes.includes(value.mimetype)) {
      return helpers.error('any.invalid');
    } else {
      return value;
    }
  })
});

export const deleteVideoResume = {
  params: {
    resumeId: Joi.string().required().custom(objectId)
  }
};

export const approverApplicantProfile = {
  params: {
    applicantId: Joi.string().required().custom(objectId)
  }
};

export const createUserApplicantByAdmin = {
  body: Joi.object().keys({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    resume: Joi.array().items(Joi.string()).max(3),
    intro: Joi.string(),
    skills: Joi.array().items(
      Joi.object({
        jobCategory: Joi.string().required().custom(objectId),
        yearsOfExperience: Joi.number().required()
      })
    ),
    videoResume: Joi.array().items(Joi.string()).max(3),
    education: Joi.object({
      title: Joi.string().required(),
      year: Joi.number().required()
    })
  })
};

export const getAllApplicants = {
  query: Joi.object().keys({
    status: Joi.string().valid('approved', 'pending', 'rejected'),
    sortBy: Joi.string(),
    limit: Joi.number(),
    page: Joi.number()
  })
};

export const getApplicantBySlug = {
  params: {
    slug: Joi.string().required()
  }
};
