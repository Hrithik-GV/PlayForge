import PublishedGame from '../models/publishedGame.model.js';
import Game from '../models/game.model.js';

/**
 * POST /publish
 * Request body:
 *   - gameId (optional: loads from Game database)
 *   - title, prompt, gameCode, thumbnail (optional: used if gameId is not provided)
 */
export const publishGame = async (req, res, next) => {
  try {
    const { gameId, title, prompt, gameCode, thumbnail } = req.body;

    let publishData = {};

    if (gameId) {
      // Find game in the database
      const game = await Game.findById(gameId);
      if (!game) {
        return res.status(404).json({
          success: false,
          message: `Game with ID ${gameId} not found`,
        });
      }

      publishData = {
        title: game.title,
        prompt: game.prompt || 'Generated game',
        gameCode: game.gameCode || compileGameCodeFromSubparts(game),
        thumbnail: game.thumbnail,
      };
    } else {
      // Validate direct input fields
      if (!title || typeof title !== 'string' || title.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Game "title" is required when publishing directly',
        });
      }
      if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Game "prompt" is required when publishing directly',
        });
      }
      if (!gameCode || typeof gameCode !== 'string' || gameCode.trim().length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Game "gameCode" is required when publishing directly',
        });
      }

      publishData = {
        title: title.trim(),
        prompt: prompt.trim(),
        gameCode: gameCode,
        thumbnail: thumbnail || '',
      };
    }

    const published = await PublishedGame.create(publishData);

    return res.status(201).json({
      success: true,
      message: 'Game published successfully',
      publishedGame: published,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /feed
 * Returns a list of published games sorted by newest first
 */
export const getFeed = async (req, res, next) => {
  try {
    const feed = await PublishedGame.find()
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      feed,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Helper to compile gameCode from html, css, js fields if gameCode is empty
 */
function compileGameCodeFromSubparts(game) {
  if (game.html || game.css || game.javascript) {
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * { box-sizing: border-box; user-select: none; -webkit-user-select: none; }
    body { margin: 0; padding: 0; background: #121212; color: #ffffff; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; width: 100vw; }
    ${game.css || ''}
  </style>
</head>
<body>
  ${game.html || ''}
  <script>
    ${game.javascript || ''}
  </script>
</body>
</html>`;
  }
  return '';
}
