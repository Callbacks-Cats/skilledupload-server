import express, { Router } from 'express';
import {
  applicantController,
  applicantMiddleware,
  applicationValidation
} from '../modules/applicant';
import { auth } from '../modules/auth';
import { validate } from '../validation';

const router: Router = express.Router();

// test route
router.post(
  '/',
  auth('manageApplicant'),
  validate(applicationValidation.createApplicant),
  applicantMiddleware.isUserRole,
  applicantController.createApplicant
);

router.patch(
  '/:userId',
  auth('manageApplicant'),
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

export default router;
