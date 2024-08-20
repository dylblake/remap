// src/routes/userRoutes.ts
import { Router } from 'express';
import { getServices, createService } from '../controllers/serviceController';

const router = Router();

router.post('/', createService);
router.get('/', getServices);

export default router;
