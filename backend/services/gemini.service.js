import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/index.js';

/**
 * Call Gemini to generate a playable game from a prompt.
 * Returns { title, gameCode, thumbnail }.
 */
export const generateGameFromPrompt = async (prompt) => {
  if (!config.gemini.apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

  const systemInstruction = `You are PlayForge, an AI game generator.
Given a game idea prompt, generate:
1. A catchy "title" for the game (max 120 chars).
2. "gameCode" — a complete, self-contained HTML/JS game that runs in a single file. Use a <canvas> element. The game must be playable immediately. Keep it under 15 000 characters.
3. "thumbnail" — leave as an empty string for now.

Respond ONLY with valid JSON in this exact shape:
{"title":"...","gameCode":"...","thumbnail":""}`;

  const model = genAI.getGenerativeModel({
    model: config.gemini.model,
    systemInstruction,
    generationConfig: {
      responseMimeType: 'application/json',
    },
  });

  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
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
