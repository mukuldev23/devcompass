const app = require('./app');
const env = require('./config/env');
const logger = require('./config/logger');
const { connectDatabase } = require('./config/db');
const cacheClient = require('./config/cache');
const { startRefreshScheduler, refreshNow } = require('./scheduler/refresh.job');

async function bootstrap() {
  await connectDatabase();
  await cacheClient.connect();

  logger.info(
    {
      restrictPublicApiToOrigins: env.RESTRICT_PUBLIC_API_TO_ORIGINS,
      allowedClientOrigins: env.ALLOWED_CLIENT_ORIGINS
    },
    'API origin restriction config'
  );

  const server = app.listen(env.PORT, () => {
    logger.info(`DevCompass API listening on port ${env.PORT}`);
  });

  let isShuttingDown = false;

  startRefreshScheduler();

  if (env.INGEST_ON_START) {
    logger.info('Running initial ingestion on startup');
    refreshNow().catch((error) => {
      logger.error({ err: error }, 'Initial ingestion failed');
    });
  } else {
    logger.info('Initial ingestion skipped (INGEST_ON_START=false)');
  }

  const shutdown = async (signal) => {
    if (isShuttingDown) return;
    isShuttingDown = true;

    if (signal) {
      logger.info({ signal }, 'Shutdown signal received');
    }

    logger.info('Shutting down gracefully');
    server.close(async () => {
      try {
        await cacheClient.disconnect();
      } catch (error) {
        logger.warn({ err: error }, 'Error while disconnecting cache during shutdown');
      }
      process.exit(0);
    });
  };

  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('SIGINT', () => shutdown('SIGINT'));
}

bootstrap().catch((error) => {
  logger.error({ err: error }, 'Failed to bootstrap server');
  process.exit(1);
});
