import express, { Router } from 'express';
import { jobPostController, jobPostValidation } from '../modules/jobPost';
import { validate } from '../validation';

const router: Router = express.Router();

router.route('/').post(validate(jobPostValidation.createJobPost), jobPostController.createJobPost);

export default router;

/**
 * @swagger
 * tags:
 *   name: Job Post
 *   description: The job post managing API
 */
