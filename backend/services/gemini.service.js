import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/index.js';

/**
 * Call Gemini to generate a playable game from a prompt.
 * Returns { title, gameCode, thumbnail }.
 */
/**
 * Compile separate HTML, CSS, and JS into a single playable HTML document.
 */
const compileGameCode = (html, css, javascript) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <style>
    * {
      box-sizing: border-box;
      user-select: none;
      -webkit-user-select: none;
    }
    body {
      margin: 0;
      padding: 0;
      background: #121212;
      color: #ffffff;
      font-family: system-ui, -apple-system, sans-serif;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      width: 100vw;
    }
    ${css}
  </style>
</head>
<body>
  ${html}
  <script>
    ${javascript}
  </script>
</body>
</html>`;
};

/**
 * Call Gemini to generate a playable game from a prompt.
 * Returns { title, description, html, css, javascript, gameCode, thumbnailSvg }.
 */
const generateDefaultSvg = (title) => {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 250" width="400" height="250">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:#ff8a3d;stop-opacity:1" />
        <stop offset="100%" style="stop-color:#ff5e62;stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#bg)" />
    <text x="50%" y="45%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="bold" fill="#ffffff">
      ${title}
    </text>
    <text x="50%" y="65%" dominant-baseline="middle" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#ffffff" opacity="0.8">
      PlayForge Arcade
    </text>
  </svg>`;
};

export const generateGameFromPrompt = async (prompt) => {
  if (!config.gemini.apiKey) {
    throw new Error('GEMINI_API_KEY is not set in environment variables');
  }

  const genAI = new GoogleGenerativeAI(config.gemini.apiKey);

  const systemInstruction = `You are PlayForge, an AI game generator.
Given a game idea prompt, generate a fully playable game. 
You must strictly output a valid JSON object matching this schema:
{
  "title": "A catchy, short title for the game",
  "description": "Short instructions/description of how to play the game",
  "html": "The HTML markup. Prefer using a single <canvas id='gameCanvas'></canvas> and UI containers for score/controls if needed.",
  "css": "The CSS styling. Ensure layout is mobile-friendly, responsive, centers components, and uses touch-friendly sizes (minimum 44x44px for buttons).",
  "javascript": "Complete, working JavaScript logic. It MUST support touch control events (touchstart, touchmove, touchend) as well as keyboard controls. The game should be a simple arcade game with a maximum gameplay session duration of 2 minutes (e.g. survival timer, time-attack, or rapid challenge).",
  "thumbnailSvg": "A clean, beautiful, minimalist SVG string that represents the game's thumbnail (e.g., viewBox '0 0 400 250', width 400, height 250, with a modern gradient background, icons/shapes representing the game, and the game title styled and centered). Ensure it is valid SVG and does not contain markdown/newlines inside the string value."
}

Constraints:
- Mobile friendly and responsive.
- Touch controls (essential for mobile playability!).
- Simple arcade games only (e.g. dodge, catch, runner, clicker, simple puzzle).
- HTML5 canvas is preferred for the main gameplay.
- Max gameplay duration around 2 minutes.
- Respond ONLY with valid JSON. Do not include markdown code block syntax.`;

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
    
    const title = parsed.title || 'Untitled Game';
    const description = parsed.description || '';
    const html = parsed.html || '';
    const css = parsed.css || '';
    const javascript = parsed.javascript || '';
    const gameCode = compileGameCode(html, css, javascript);
    
    let thumbnailSvg = parsed.thumbnailSvg || '';
    if (!thumbnailSvg.trim().startsWith('<svg')) {
      thumbnailSvg = generateDefaultSvg(title);
    }

    return {
      title,
      description,
      html,
      css,
      javascript,
      gameCode,
      thumbnailSvg,
    };
  } catch (err) {
    console.error('[Gemini] Failed to parse response:', cleaned.slice(0, 200));
    throw new Error('Gemini returned invalid JSON');
  }
};
