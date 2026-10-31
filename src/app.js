import express from 'express';
import pool from './config/database.js';
import operationsRouter from './routes/operations.js';
import requestLogger from './middleware/logger.js';
import { getMetrics } from './services/metrics.js';

const app = express();
app.use(requestLogger);

app.use(express.json());
// Prometheus metrics endpoint
app.get('/metrics', (req, res) => {
  res.set('Content-Type', 'text/plain; version=0.0.4; charset=utf-8');
  res.status(200).send(getMetrics());
});

// Operations API routes
app.use('/api/operations', operationsRouter);

app.get('/', (req, res) => {
  res.status(200).json({
    application: 'Apex Operations API',
    version: process.env.APP_VERSION || '1.0.0',
    status: 'running'
  });
});

// Liveness: checks whether the application is running.
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy'
  });
});

// Readiness: checks whether the database is reachable.
app.get('/ready', async (req, res) => {
  try {
    await pool.query('SELECT 1');

    res.status(200).json({
      status: 'ready',
      database: 'connected'
    });
  } catch (error) {
    console.error('Readiness check failed:', error.message);

    res.status(503).json({
      status: 'not ready',
      database: 'unavailable'
    });
  }
});

export default app;
