import { Router } from 'express';
import * as shippingController from '../controllers/shipping.controller';

const router = Router();

router.get('/provinces', shippingController.getProvinces);
router.get('/regencies/:provinceId', shippingController.getRegencies);
router.get('/districts/:regencyId', shippingController.getDistricts);
router.post('/cost', shippingController.calculateCost);

export default router;
        