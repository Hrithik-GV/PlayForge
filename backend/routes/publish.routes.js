import { Router } from 'express';
import { publishGame, getFeed } from '../controllers/publish.controller.js';

const router = Router();

// POST /publish
router.post('/publish', publishGame);

// GET /feed
router.get('/feed', getFeed);

export default router;
