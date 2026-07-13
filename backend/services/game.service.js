import Game from '../models/game.model.js';
import { normalizePrompt, hashPrompt } from '../utils/prompt.js';
import { generateGameFromPrompt } from './gemini.service.js';
import { getRandomFallbackGame, isGeminiFallbackError } from './fallback.service.js';

/**
 * Generate (or retrieve from cache) a game for the given prompt.
 *
 * Flow:
 *  1. Normalize prompt text
 *  2. Hash the normalized prompt
 *  3. Look up existing game by promptHash
 *  4. If cache hit → return immediately
 *  5. Otherwise → call Gemini → save to DB → return
 *  6. If Gemini fails (timeout / rate-limit / invalid response)
 *     → return a random pre-generated fallback game
 */
export const generateGame = async (rawPrompt) => {
  // ─── 1 & 2: Normalize + hash ─────────────────────────────
  const normalized = normalizePrompt(rawPrompt);
  const hash = hashPrompt(normalized);

  // ─── 3: Cache lookup ─────────────────────────────────────
  const cached = await Game.findOne({ promptHash: hash }).lean();

  if (cached) {
    // ─── 4: Cache HIT ──────────────────────────────────────
    return {
      cacheHit: true,
      fallbackUsed: false,
      game: cached,
    };
  }

  // ─── 5: Cache MISS — call Gemini ─────────────────────────
  try {
    const generated = await generateGameFromPrompt(normalized);

    // ─── 6: Save to MongoDB ────────────────────────────────
    const game = await Game.create({
      title: generated.title,
      prompt: normalized,
      promptHash: hash,
      gameCode: generated.gameCode,
      description: generated.description,
      html: generated.html,
      css: generated.css,
      javascript: generated.javascript,
      thumbnail: generated.thumbnail || '',
      isFallback: false,
    });

    return {
      cacheHit: false,
      fallbackUsed: false,
      game: game.toObject(),
    };
  } catch (err) {
    // ─── 7: Gemini failed — try fallback ───────────────────
    console.error('[GameService] Gemini generation failed:', err.message);

    if (isGeminiFallbackError(err)) {
      console.log('[GameService] Using fallback game...');

      const fallback = await getRandomFallbackGame();

      if (fallback) {
        return {
          cacheHit: false,
          fallbackUsed: true,
          fallbackReason: 'AI is currently busy. Explore trending games while we prepare your game.',
          game: fallback,
        };
      }

      // No fallback games in DB — nothing we can do
      console.error('[GameService] No fallback games available in database');
    }

    // Re-throw if it's not a fallback-worthy error or no fallbacks exist
    throw err;
  }
};
