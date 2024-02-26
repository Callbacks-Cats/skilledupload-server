import express, { Router } from 'express';
import { imageUploader } from '../lib';
import { auth } from '../modules/auth';
import { userController, userValidation } from '../modules/user';
import { validate } from '../validation';

const router: Router = express.Router();

router.patch(
  '/update-profile-picture',
  auth('updateOwn'),
  imageUploader.single('image'),
  userController.updateUpdateProfilePicture
);

router
  .route('/:userId')
  .get(auth('readOwn'), validate(userValidation.getUserById), userController.getUser);

router.route('/').post(validate(userValidation.createUser), userController.createUser);

export default router;
