import * as applicantController from './applicant.controller';
import * as applicantMiddleware from './applicant.middleware';
import Applicant from './applicant.model';
import * as applicantService from './applicant.service';
import * as applicationValidation from './applicant.validation';

export {
  Applicant,
  applicantController,
  applicantMiddleware,
  applicantService,
  applicationValidation
};
