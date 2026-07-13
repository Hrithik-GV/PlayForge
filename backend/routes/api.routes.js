import { Router } from 'express';
import { getHealth } from '../controllers/health.controller.js';
import { generateGranular } from '../controllers/game.controller.js';

const router = Router();

// GET /api/health
router.get('/health', getHealth);

// POST /api/generate
router.post('/generate', generateGranular);

export default router;
