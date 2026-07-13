import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

import config from './config/index.js';
import connectDB from './config/db.js';
import apiRoutes from './routes/api.routes.js';
import gameRoutes from './routes/game.routes.js';

// ─── App ────────────────────────────────────────────────────
const app = express();

// ─── Global Middleware ──────────────────────────────────────
app.use(helmet());
app.use(
  cors({
    origin: config.cors.origins,
    credentials: true,
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.isDev) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// ─── Routes ─────────────────────────────────────────────────
app.use('/api', apiRoutes);
app.use('/api/games', gameRoutes);

// ─── 404 Handler ────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// ─── Global Error Handler ───────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.stack || err.message);

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: config.isProd ? 'Internal server error' : err.message,
    ...(config.isDev && { stack: err.stack }),
  });
});

// ─── Start ──────────────────────────────────────────────────
const start = async () => {
  await connectDB();

  app.listen(config.port, () => {
    console.log(`
  ⚡ PlayForge API
  ├─ env:  ${config.nodeEnv}
  ├─ port: ${config.port}
  └─ cors: ${config.cors.origins.join(', ')}
    `);
  });
};

start();

export default app;
