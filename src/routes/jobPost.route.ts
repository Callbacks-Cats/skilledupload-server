import express, { Router } from 'express';
import { auth } from '../modules/auth';
import { jobPostController, jobPostValidation } from '../modules/jobPost';
import { validate } from '../validation';

const router: Router = express.Router();

router
  .route('/')
  .post(
    auth('manageJobPosts'),
    validate(jobPostValidation.createJobPost),
    jobPostController.createJobPost
  )
  .get(jobPostController.getAllJobPosts);

router
  .route('/:slug')
  .get(validate(jobPostValidation.getPostBySlug), jobPostController.getJobPostBySlug)
  .patch(
    auth('manageJobPosts'),
    validate(jobPostValidation.updateJobPost),
    jobPostController.updateJobPost
  )
  .delete(
    auth('manageJobPosts'),
    validate(jobPostValidation.getPostBySlug),
    jobPostController.deleteJobPost
  );

export default router;

/**
 * @swagger
 * tags:
 *   name: Job Posts
 *   description: API endpoints for managing job posts
 */

/**
 * @swagger
 * /job-post:
 *   post:
 *     summary: Add a new job post
 *     tags: [Job Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobPostInput'
 *     responses:
 *       "201":
 *         description: Job Post Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/JobPost'
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Job Post Created Successfully"
 *                 error:
 *                   type: null
 *                   example: null
 */

/**
 * @swagger
 * /job-post:
 *   get:
 *     summary: Get all job posts with pagination
 *     tags: [Job Posts]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of items per page
 *       - in: query
 *         name: populate
 *         schema:
 *           type: string
 *         description: Field to populate (e.g., createdBy)
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *         description: Field to sort by and the order (e.g., createdAt:desc)
 *     responses:
 *       "200":
 *         description: Job Posts Fetched Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     results:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/JobPost'
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     limit:
 *                       type: integer
 *                       example: 10
 *                     totalPages:
 *                       type: integer
 *                       example: 1
 *                     totalResults:
 *                       type: integer
 *                       example: 2
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Job Posts Fetched Successfully"
 *                 error:
 *                   type: null
 *                   example: null
 *       "400":
 *         description: Bad request, invalid parameters provided
 *       "500":
 *         description: Internal server error
 */

/**
 * @swagger
 * /job-post/{slug}:
 *   get:
 *     summary: Get a job post by slug
 *     tags: [Job Posts]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The slug of the job post
 *     responses:
 *       "200":
 *         description: Job Post Fetched Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/JobPost'
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Job Post Fetched Successfully"
 *                 error:
 *                   type: null
 *                   example: null
 *       "404":
 *         description: Job post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Post not found"
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 data:
 *                   type: null
 *                   example: null
 */

/**
 * @swagger
 * /job-post/{slug}:
 *   patch:
 *     summary: Update a job post by slug
 *     tags: [Job Posts]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The slug of the job post
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobPostPatchInput'
 *     responses:
 *       "200":
 *         description: Job Post Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/JobPost'
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Job Post Updated Successfully"
 *                 error:
 *                   type: null
 *                   example: null
 *       "404":
 *         description: Job post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Job post not found"
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 data:
 *                   type: null
 *                   example: null
 */
/**
 * @swagger
 * /job-post/{slug}:
 *   delete:
 *     summary: Delete a job post by slug
 *     tags: [Job Posts]
 *     parameters:
 *       - in: path
 *         name: slug
 *         schema:
 *           type: string
 *         required: true
 *         description: The slug of the job post
 *     responses:
 *       "200":
 *         description: Job Post Deleted Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: boolean
 *                   example: true
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Job Post Deleted Successfully"
 *                 error:
 *                   type: null
 *                   example: null
 *       "404":
 *         description: Job post not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: "Job post not found"
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 data:
 *                   type: null
 *                   example: null
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     JobPost:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the job post
 *         description:
 *           type: string
 *           description: The description of the job post
 *         location:
 *           type: string
 *           description: The location of the job
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date of the job post
 *         company:
 *           type: string
 *           description: The company offering the job
 *         salary:
 *           type: number
 *           description: The salary for the job
 *         status:
 *           type: string
 *           description: The status of the job post
 *         image:
 *           type: string
 *           format: uri
 *           description: The URL of the image associated with the job post
 *         createdBy:
 *           $ref: '#/components/schemas/User'
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the job post was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the job post was last updated
 *         slug:
 *           type: string
 *           description: The slug of the job post
 *         id:
 *           type: string
 *           description: The unique identifier for the job post
 *     User:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           description: The first name of the user
 *         lastName:
 *           type: string
 *           description: The last name of the user
 *         email:
 *           type: string
 *           format: email
 *           description: The email address of the user
 *         phoneNumber:
 *           type: string
 *           description: The phone number of the user
 *         role:
 *           type: string
 *           description: The role of the user
 *         status:
 *           type: string
 *           description: The status of the user
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the user was last updated
 *         id:
 *           type: string
 *           description: The unique identifier for the user
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     JobPostInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the job post
 *         description:
 *           type: string
 *           description: The description of the job post
 *         location:
 *           type: string
 *           description: The location of the job
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the job post
 *         company:
 *           type: string
 *           description: The company offering the job
 *         salary:
 *           type: number
 *           description: The salary for the job
 *         image:
 *           type: string
 *           format: uri
 *           description: The URL of the image associated with the job post
 *         createdBy:
 *           type: string
 *           description: The ID of the user who created the job post
 *           example: "65dc498bff7c8aef572e0a63"
 *     JobPost:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the job post
 *         description:
 *           type: string
 *           description: The description of the job post
 *         location:
 *           type: string
 *           description: The location of the job
 *         date:
 *           type: string
 *           format: date-time
 *           description: The date of the job post
 *         company:
 *           type: string
 *           description: The company offering the job
 *         salary:
 *           type: number
 *           description: The salary for the job
 *         status:
 *           type: string
 *           description: The status of the job post
 *         image:
 *           type: string
 *           format: uri
 *           description: The URL of the image associated with the job post
 *         createdBy:
 *           type: string
 *           description: The ID of the user who created the job post
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the job post was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the job post was last updated
 *         slug:
 *           type: string
 *           description: The slug of the job post
 *         id:
 *           type: string
 *           description: The unique identifier for the job post
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     JobPostPatchInput:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the job post
 *         description:
 *           type: string
 *           description: The description of the job post
 *         location:
 *           type: string
 *           description: The location of the job
 *         date:
 *           type: string
 *           format: date
 *           description: The date of the job post
 *         company:
 *           type: string
 *           description: The company offering the job
 *         salary:
 *           type: number
 *           description: The salary for the job
 *         image:
 *           type: string
 *           format: uri
 *           description: The URL of the image associated with the job post
 */
