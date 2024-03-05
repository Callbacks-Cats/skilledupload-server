import express, { Router } from 'express';
import { auth } from '../modules/auth';
import { bannerConfigController, bannerConfigValidator } from '../modules/bannerConfig';
import { validate } from '../validation';

const router: Router = express.Router();

router
  .route('/')
  .get(validate(bannerConfigValidator.getAllBanners), bannerConfigController.getAllBanners)
  .post(
    auth('manageBanner'),
    validate(bannerConfigValidator.addBanner),
    bannerConfigController.addbanner
  );

router
  .route('/:id')
  .get(validate(bannerConfigValidator.getBannerById), bannerConfigController.getBannerById)
  .patch(
    auth('manageBanner'),
    validate(bannerConfigValidator.updateBanner),
    bannerConfigController.updatebanner
  )
  .delete(
    auth('manageBanner'),
    validate(bannerConfigValidator.deleteBanner),
    bannerConfigController.deletebanner
  );

router.patch(
  '/toggle-status/:id',
  auth('manageBanner'),
  validate(bannerConfigValidator.toggoleBannerStatus),
  bannerConfigController.toggoleBannerStatus
);

export default router;
