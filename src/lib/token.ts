import jwt from 'jsonwebtoken';
import config from '../config';

/**
 * Generates a JWT token with the provided payload.
 * @param {any} payload - The data to be included in the token.
 * @returns {string} - The JWT token.
 */
export const generateToken = async (payload: any) => {
  return jwt.sign(payload, config.jwt.secret, { expiresIn: '7d' });
};

/**
 * Verifies and decodes a JWT token.
 * @param {string} token - The JWT token to be verified.
 * @returns {any} - The decoded payload from the token.
 */
export const verifyToken = (token: string) => {
  return jwt.verify(token, config.jwt.secret);
};
