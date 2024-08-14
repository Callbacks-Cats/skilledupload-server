import httpStatus from 'http-status';
import { ApiError } from '../../utils';
import { IJobCategoryBody, IJobCategoryDoc, UpdateJobCategoryBody } from './jobCategory.interface';
import JobCategory from './jobCategory.model';

/**
 * Create a new job category
 * @param {IJobCategoryBody} body - The job category to be created
 * @returns {Promise<IJobCategoryDoc>} - The created job category *
 */
export const createJobCategory = async (body: IJobCategoryBody): Promise<IJobCategoryDoc> => {
  const jobCategory = new JobCategory(body);
  return jobCategory.save();
};

/**
 * Get all job categories
 * @returns {Promise<IJobCategoryDoc[]>} - All job categories
 */
export const getAllJobCategories = async (): Promise<IJobCategoryDoc[]> => {
  return JobCategory.find();
};

/**
 * Get a job category by id
 * @param {string} id - The id of the job category
 * @returns {Promise<IJobCategoryDoc>} - The job category
 */
export const getJobCategoryById = async (id: string): Promise<IJobCategoryDoc | null> => {
  return JobCategory.findById(id);
};

/**
 * Update a job category by id
 * @param {string} id - The id of the job category
 * @param {UpdateJobCategoryBody} body - The updated job category
 * @returns {Promise<IJobCategoryDoc | null>} - The updated job category
 */
export const updateJobCategory = async (
  id: string,
  body: UpdateJobCategoryBody
): Promise<IJobCategoryDoc | null> => {
  return JobCategory.findByIdAndUpdate(id, body, { new: true });
};

/**
 * Delete a job category by id
 * @param {string} id - The id of the job category
 * @returns {Promise<IJobCategoryDoc | null>} - The deleted job category
 */
export const deleteJobCategory = async (id: string): Promise<IJobCategoryDoc | null> => {
  return JobCategory.findByIdAndDelete(id);
};

/**
 * Get category by id
 * @param {string} id - The id of the category
 * @returns {Promise<IJobCategoryDoc>} - The category
 */
export const getCategoryById = async (id: string): Promise<IJobCategoryDoc | null> => {
  const category = await JobCategory.findOne({ _id: id });
  if (!category) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Category not found');
  }
  return category;
};
