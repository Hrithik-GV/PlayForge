import { getHealthStatus } from '../services/health.service.js';

export const getHealth = (_req, res) => {
  const status = getHealthStatus();
  res.status(200).json(status);
};
