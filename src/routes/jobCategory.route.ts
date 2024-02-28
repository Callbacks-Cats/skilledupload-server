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

/**
 * @swagger
 * tags:
 *   name: Job Categories
 *   description: API endpoints for managing job categories
 */

/**
 * @swagger
 * /job-category:
 *   post:
 *     summary: Add a new job category
 *     tags: [Job Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobCategoryInput'
 *     responses:
 *       "201":
 *         description: Job Category Created Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/JobCategory'
 *                 code:
 *                   type: integer
 *                   example: 201
 *                 message:
 *                   type: string
 *                   example: "Job Category Created Successfully"
 *                 error:
 *                   type: null
 *                   example: null
 *   get:
 *     summary: Get all job categories
 *     tags: [Job Categories]
 *     responses:
 *       "200":
 *         description: Job Categories Fetched Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/JobCategory'
 */

/**
 * @swagger
 * /job-category/{categoryId}:
 *   delete:
 *     summary: Delete a job category
 *     tags: [Job Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the job category to delete
 *     responses:
 *       "200":
 *         description: Job Category Deleted Successfully
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
 *                   example: "Job Category Deleted Successfully"
 *                 error:
 *                   type: null
 *                   example: null
 *       "404":
 *         description: Job category not found
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
 *                   example: "Job category not found"
 *                 code:
 *                   type: integer
 *                   example: 404
 *                 data:
 *                   type: null
 *                   example: null
 *   patch:
 *     summary: Update a job category
 *     tags: [Job Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the job category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/JobCategoryInput'
 *     responses:
 *       "200":
 *         description: Job Category Updated Successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/JobCategory'
 *                 code:
 *                   type: integer
 *                   example: 200
 *                 message:
 *                   type: string
 *                   example: "Job Category Updated Successfully"
 *                 error:
 *                   type: null
 *                   example: null
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     JobCategoryInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           description: The name of the job category
 *         description:
 *           type: string
 *           description: The description of the job category
 *     JobCategory:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *           description: The ID of the job category
 *         name:
 *           type: string
 *           description: The name of the job category
 *         description:
 *           type: string
 *           description: The description of the job category
 */
