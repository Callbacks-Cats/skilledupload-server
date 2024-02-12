import express, { Router } from 'express';
import { applicantController, applicationValidation } from '../modules/applicant';
import { validate } from '../validation';

const router: Router = express.Router();

// test route
router.post(
  '/',
  validate(applicationValidation.createApplicant),
  applicantController.createApplicant
);

export default router;
