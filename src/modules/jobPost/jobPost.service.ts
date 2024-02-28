import { IJobPostBody, IJobPostDoc } from './jobPost.interface';
import JobPost from './jobPost.model';

/**
 * Create a new job post
 * @param {IJobPostBody} body - The job post body
 * @returns {Promise<IJobPostDoc>} - The job post document
 */
export const createJobPost = async (body: IJobPostBody): Promise<IJobPostDoc> => {
  return await JobPost.create(body);
};

/**
 * Get post by slug
 * @param {string} slug - The post slug
 * @returns {Promise<IJobPostDoc>} - The job post document
 */
export const getPostBySlug = async (slug: string): Promise<IJobPostDoc | null> => {
  return await JobPost.findOne({ slug }).populate('createdBy', 'name email profilePicture');
};

/**
 * Get all job posts
 */
