import express, { Router } from 'express';
import { auth } from '../modules/auth';
import { jobCategoryController, jobCategoryValidation } from '../modules/jobCategory';
import { validate } from '../validation';
const router: Router = express.Router();

router
  .route('/')
  .get(jobCategoryController.getAllJobCategories)
  .post(
    auth('manageJobCategories'),
    validate(jobCategoryValidation.createJobCategory),
    jobCategoryController.createJobCategory
  );

router
  .route('/:id')
  .patch(
    auth('manageJobCategories'),
    validate(jobCategoryValidation.updateJobCategory),
    jobCategoryController.updateJobCategory
  )
  .delete(auth('manageJobCategories'), jobCategoryController.deleteJobCategory);

export default router;
