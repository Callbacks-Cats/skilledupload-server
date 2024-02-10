import express, { Router } from 'express';
import { auth } from '../modules/auth';
import { userController, userValidation } from '../modules/user';
import { validate } from '../validation';

const router: Router = express.Router();

router.route('/').post(validate(userValidation.createUser), userController.createUser);

router
  .route('/:userId')
  .get(auth('readOwn'), validate(userValidation.getUserById), userController.getUser);

export default router;
