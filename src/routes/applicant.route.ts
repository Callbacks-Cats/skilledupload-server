import express, { Router } from 'express';
import { fileUploader } from '../lib';
import {
  applicantController,
  applicantMiddleware,
  applicationValidation
} from '../modules/applicant';
import { auth } from '../modules/auth';
import { validate } from '../validation';

const router: Router = express.Router();

router.get(
  '/',
  auth('manageApplicant'),
  validate(applicationValidation.getAllApplicants),
  applicantController.getAllApplicants
);

router.post(
  '/',
  auth('updateOwn'),
  validate(applicationValidation.createApplicant),
  applicantMiddleware.isUserRole,
  applicantController.createApplicant
);

router.patch(
  '/upload-resume',
  auth('uploadResume'),
  fileUploader.single('resume'),
  applicantController.uploadResume
);

router.patch(
  '/upload-video-resume',
  auth('uploadResume'),
  applicantMiddleware.isVideoResumeLimitExceeded,
  fileUploader.single('video'),
  applicantController.uploadVideoResume
);

router.patch(
  '/approve-applicant-profile/:applicantId',
  validate(applicationValidation.approverApplicantProfile),
  auth('updateOwn'), // it will be manageApplicant
  applicantController.approveApplicantProfile
);

router.delete(
  '/delete-video-resume/:resumeId',
  validate(applicationValidation.deleteVideoResume),
  auth('updateOwn'),
  applicantMiddleware.isUserRole,
  applicantController.deleteVideoResumeByUser
);

router.patch(
  '/update-my-profile',
  auth('updateOwn'),
  applicantMiddleware.isUserRole,
  validate(applicationValidation.updateApplicant),
  applicantController.updateApplicant
);

router.get(
  '/:userId',
  auth('manageApplicant'),
  validate(applicationValidation.getApplicantByUserId),
  applicantController.getApplicant
);

router.get(
  '/applicant/:slug',
  validate(applicationValidation.getApplicantBySlug),
  applicantController.getApplicantBySlug
);

router.post(
  '/create-user-applicant',
  auth('createUserApplicant'),
  // validate(applicationValidation.createUserApplicantByAdmin),
  applicantController.createUserApplicantByAdmin
);

export default router;
