import httpStatus from 'http-status';
import { IOptions } from '../../plugin/paginate';
import { ApiError } from '../../utils';
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
  const post = await JobPost.findOne({ slug }).populate(
    'createdBy',
    'firstName lastName email profilePicture'
  );
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  return post;
};

/**
 * Get all job posts with pagination
 * @param {IOptions} options - The query options
 * @returns {Promise<IJobPostDoc[]>} - The job post documents
 */
export const getAllJobPosts = async (options: IOptions): Promise<any> => {
  return await JobPost.paginate({}, options);
};

/**
 * Update a job post
 * @param {string} slug - The post slug
 * @param {IJobPostBody} body - The job post body
 * @returns {Promise<IJobPostDoc>} - The job post document
 */
export const updateJobPost = async (slug: string, body: IJobPostBody): Promise<IJobPostDoc> => {
  const post = await getPostBySlug(slug);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  Object.assign(post, body);
  await post.save();
  return post;
};

/**
 * Delete post by slug
 * @param {string} slug - The post slug
 * @returns {Promise<IJobPostDoc>} - The job post document
 */
export const deletePostBySlug = async (slug: string): Promise<IJobPostDoc> => {
  const post = await getPostBySlug(slug);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }
  await JobPost.findOneAndDelete({ slug });
  return post;
};
