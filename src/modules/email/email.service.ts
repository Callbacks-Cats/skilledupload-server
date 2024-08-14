import nodemailer from 'nodemailer';
import config from '../../config';
import { logger } from '../../utils';
import { Message } from './email.interfaces';

export const transport = nodemailer.createTransport(config.email.smtp);
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() =>
      logger.warn(
        'Unable to connect to email server. Make sure you have configured the SMTP options in .env'
      )
    );
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @param {string} html
 * @returns {Promise<void>}
 */
export const sendEmail = async (
  to: string,
  subject: string,
  text: string,
  html?: string
): Promise<void> => {
  const msg: Message = {
    from: config.email.from,
    to,
    subject,
    text,
    html
  };
  await transport.sendMail(msg);
};

/**
 * Send OTP Verfication Email
 * @param {string} to
 * @param {string} otp
 * @returns {Promise<void>}
 */
export const sendOtpVerificationEmail = async (to: string, otp: string) => {
  const subject = 'OTP Verification';
  const text = `Your OTP is ${otp}`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
  <p>Your OTP is ${otp}</p></div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send Forgot password OTP Email
 * @param {string} to
 * @param {string} otp
 */
export const sendForgotPasswordOtpEmail = async (to: string, otp: string) => {
  const subject = 'Forgot Password OTP';
  const text = `Your OTP is ${otp}`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
  <p>Your OTP is ${otp}</p></div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise<void>}
 */
export const sendResetPasswordEmail = async (to: string, token: string) => {
  const subject = 'Reset password';
  const resetPasswordUrl = `${config.clientUrl}/auth/reset-password?token=${token}`;
  const text = `Hi,
  To reset your password, click on this link: ${resetPasswordUrl}
  If you did not request any password resets, then ignore this email.`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Dear user,</strong></h4>
  <p>To reset your password, click on this link: ${resetPasswordUrl}</p>
  <p>If you did not request any password resets, please ignore this email.</p>
  <p>Thanks,</p>
  <p><strong>Team</strong></p></div>`;
  await sendEmail(to, subject, text, html);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @param {string} name
 * @returns {Promise<void>}
 */
export const sendVerificationEmail = async (
  to: string,
  token: string,
  name: string
): Promise<void> => {
  const subject = 'Account Verification';
  // TODO: It should be an actual URL of the frontend
  const verificationUrl = `${config.clientUrl}/auth/account-verification?token=${token}`;
  const text = `Hi ${name},
  To verify your email, click on this link: ${verificationUrl}
  If you did not create an account, then ignore this email.`;
  const html = `<div style="margin:30px; padding:30px; border:1px solid black; border-radius: 20px 10px;"><h4><strong>Hi ${name},</strong></h4>
  <p>To verify your email, click on this link: ${verificationUrl}</p>
  <p>If you did not create an account, then ignore this email.</p></div>`;
  await sendEmail(to, subject, text, html);
};
