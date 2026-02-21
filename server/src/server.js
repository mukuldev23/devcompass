const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const { connectDatabase } = require('./config/db');
const cacheClient = require('./config/cache');
const { startRefreshScheduler, refreshNow } = require('./scheduler/refresh.job');

async function bootstrap() {
  await connectDatabase();
  await cacheClient.connect();

  const server = app.listen(env.PORT, () => {
    logger.info(`DevCompass API listening on port ${env.PORT}`);
  });

  startRefreshScheduler();

  if (env.INGEST_ON_START) {
    logger.info('Running initial ingestion on startup');
    refreshNow().catch((error) => {
      logger.error({ err: error }, 'Initial ingestion failed');
    });
  } else {
    logger.info('Initial ingestion skipped (INGEST_ON_START=false)');
  }

  const shutdown = async () => {
    logger.info('Shutting down gracefully');
    server.close(async () => {
      await cacheClient.disconnect();
      process.exit(0);
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);
}

bootstrap().catch((error) => {
  logger.error({ err: error }, 'Failed to bootstrap server');
  process.exit(1);
});
