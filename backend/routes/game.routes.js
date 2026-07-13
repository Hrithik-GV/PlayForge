import { Router } from 'express';
import { generate } from '../controllers/game.controller.js';

const router = Router();

// POST /api/games/generate
router.post('/generate', generate);

export default router;
