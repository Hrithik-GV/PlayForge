import Game from '../models/game.model.js';

/**
 * Retrieve a random fallback game from MongoDB.
 * Only games with isFallback=true are considered.
 *
 * Uses MongoDB's $sample aggregation to pick one at random.
 * Returns null if no fallback games exist.
 */
export const getRandomFallbackGame = async () => {
  const results = await Game.aggregate([
    { $match: { isFallback: true } },
    { $sample: { size: 1 } },
  ]);

  if (!results || results.length === 0) {
    return null;
  }

  return results[0];
};

/**
 * Check whether a Gemini error is a retriable/fallback-worthy failure.
 * Catches: timeout, rate-limit (429), server errors (5xx), invalid JSON.
 */
export const isGeminiFallbackError = (err) => {
  const msg = (err.message || '').toLowerCase();

  // Rate-limit / quota errors
  if (msg.includes('429') || msg.includes('rate limit') || msg.includes('quota')) {
    return true;
  }

  // Timeout errors
  if (msg.includes('timeout') || msg.includes('timed out') || msg.includes('deadline')) {
    return true;
  }

  // Server-side errors from Gemini (500, 502, 503, etc.)
  if (msg.includes('500') || msg.includes('502') || msg.includes('503') || msg.includes('internal')) {
    return true;
  }

  // Invalid JSON response from the model
  if (msg.includes('invalid json') || msg.includes('failed to parse')) {
    return true;
  }

  // Model not found / unavailable
  if (msg.includes('not found') || msg.includes('no longer available')) {
    return true;
  }

  return false;
};
