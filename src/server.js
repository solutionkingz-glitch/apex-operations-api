import app from './app.js';

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Apex Operations API running on port ${PORT}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully.');

  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
});
