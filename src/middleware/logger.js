
import { recordRequest } from '../services/metrics.js';

export default function requestLogger(req, res, next) {
  const startTime = Date.now();

  res.on('finish', () => {
    const durationMs = Date.now() - startTime;

    // Record request metrics
    recordRequest(req.method, res.statusCode, durationMs);

    // Write structured JSON log
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs
    };

    console.log(JSON.stringify(logEntry));
  });

  next();
}
