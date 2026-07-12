/**
 * Returns a health-check payload.
 * Extend this later with DB ping, Redis status, etc.
 */
export const getHealthStatus = () => {
  return {
    success: true,
    message: 'PlayForge API is running',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
  };
};
