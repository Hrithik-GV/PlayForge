import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/index.js';

let model = null;

/**
 * Lazily initialise the Gemini model so the module
 * can be imported even if the API key isn't set yet.
 */
const getModel = () => {
  if (!model) {
    if (!config.gemini.apiKey) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
    model = genAI.getGenerativeModel({ model: config.gemini.model });
  }
  return model;
};

/**
 * Call Gemini to generate a playable game from a prompt.
 * Returns { title, gameCode, thumbnail }.
 */
export const generateGameFromPrompt = async (prompt) => {
  const gemini = getModel();

  const systemInstruction = `You are PlayForge, an AI game generator.
Given a game idea prompt, generate:
1. A catchy "title" for the game (max 120 chars).
2. "gameCode" — a complete, self-contained HTML/JS game that runs in a single file. Use a <canvas> element. The game must be playable immediately. Keep it under 15 000 characters.
3. "thumbnail" — leave as an empty string for now.

Respond ONLY with valid JSON in this exact shape (no markdown fences, no explanation):
{"title":"...","gameCode":"...","thumbnail":""}`;

  const result = await gemini.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    systemInstruction,
  });

  const raw = result.response.text().trim();

  // Strip markdown code fences if the model wraps them anyway
  const cleaned = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '');

  try {
    const parsed = JSON.parse(cleaned);
    return {
      title: parsed.title || 'Untitled Game',
      gameCode: parsed.gameCode || '',
      thumbnail: parsed.thumbnail || '',
    };
  } catch (err) {
    console.error('[Gemini] Failed to parse response:', cleaned.slice(0, 200));
    throw new Error('Gemini returned invalid JSON');
  }
};
