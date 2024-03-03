import express, { Router } from 'express';
import { searchController } from '../modules/search';

const router: Router = express.Router();

router.get('/', searchController.search);

export default router;
