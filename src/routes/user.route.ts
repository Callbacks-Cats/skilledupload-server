import express, { Router } from 'express';
import { userController, userValidation } from '../modules/user';
import { validate } from '../validation';

const router: Router = express.Router();

router.route('/').post(validate(userValidation.createUser), userController.createUser);

export default router;
