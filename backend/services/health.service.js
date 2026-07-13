import mongoose from 'mongoose';

/**
 * Returns a health-check payload including DB connectivity.
 */
export const getHealthStatus = () => {
  const dbStates = ['disconnected', 'connected', 'connecting', 'disconnecting'];
  const dbState = mongoose.connection.readyState;

  return {
    success: true,
    message: 'PlayForge API is running',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStates[dbState] || 'unknown',
      name: mongoose.connection.name || null,
    },
  };
};
