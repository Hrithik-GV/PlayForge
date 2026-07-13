import { createHash } from 'node:crypto';

/**
 * Normalize a prompt for consistent cache hits.
 * - Lowercases
 * - Trims leading/trailing whitespace
 * - Collapses multiple spaces / newlines into a single space
 * - Strips trailing punctuation noise (e.g. "make a game!!!" → "make a game")
 */
export const normalizePrompt = (raw) => {
  return raw
    .toLowerCase()
    .trim()
    .replace(/\s+/g, ' ')
    .replace(/[.!?,;:]+$/g, '');
};

/**
 * Returns a SHA-256 hex digest of the normalized prompt.
 * This serves as the cache key in MongoDB.
 */
export const hashPrompt = (normalizedPrompt) => {
  return createHash('sha256').update(normalizedPrompt).digest('hex');
};
