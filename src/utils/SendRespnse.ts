import { Response } from 'express';

/**
 * Sends a formatted response with a consistent structure for both successful and error cases.
 *
 * @param {Response} res - The response object to send the response with.
 * @param {boolean} success - Indicates whether the response is successful or an error.
 * @param {any} data - The data to include in the response, if any.
 * @param {number} code - The HTTP status code for the response.
 * @param {string} error - The error message to include in the response, if any.
 * @returns {Response} - The response object with the formatted response data.
 */
export const SendResponse = (
  res: Response,
  success: boolean,
  data: any,
  code: number,
  message?: string,
  error?: string
) => {
  return res.status(code).json({
    success,
    data,
    code,
    message: message || '',
    error: error || null
  });
};
