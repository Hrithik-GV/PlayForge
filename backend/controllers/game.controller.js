import { generateGame } from '../services/game.service.js';

/**
 * POST /api/games/generate
 * Body: { prompt: string }
 */
export const generate = async (req, res, next) => {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'A non-empty "prompt" string is required',
      });
    }

    if (prompt.length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Prompt cannot exceed 2000 characters',
      });
    }

    const result = await generateGame(prompt);

    return res.status(200).json({
      success: true,
      cacheHit: result.cacheHit,
      game: result.game,
    });
  } catch (err) {
    next(err);
  }
};
