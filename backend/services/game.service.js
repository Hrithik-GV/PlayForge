import Game from '../models/game.model.js';
import { normalizePrompt, hashPrompt } from '../utils/prompt.js';
import { generateGameFromPrompt } from './gemini.service.js';

/**
 * Generate (or retrieve from cache) a game for the given prompt.
 *
 * Flow:
 *  1. Normalize prompt text
 *  2. Hash the normalized prompt
 *  3. Look up existing game by promptHash
 *  4. If cache hit → return immediately
 *  5. Otherwise → call Gemini → save to DB → return
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
      game: cached,
    };
  }

  // ─── 5: Cache MISS — call Gemini ─────────────────────────
  const generated = await generateGameFromPrompt(normalized);

  // ─── 6: Save to MongoDB ──────────────────────────────────
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
    game: game.toObject(),
  };
};
