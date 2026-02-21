const cron = require('node-cron');
const logger = require('../config/logger');
const articleService = require('../modules/articles/article.service');

let scheduledTask;

async function refreshNow() {
  try {
    const report = await articleService.refreshArticles();
    logger.info({ report }, 'Manual/scheduled refresh completed');
    return report;
  } catch (error) {
    logger.error({ err: error }, 'Refresh job failed');
    throw error;
  }
}

function startRefreshScheduler() {
  if (scheduledTask) return scheduledTask;

  scheduledTask = cron.schedule('0 */6 * * *', async () => {
    logger.info('Starting scheduled ingestion');

    try {
      await refreshNow();
    } catch (error) {
      logger.error({ err: error }, 'Scheduled ingestion failed safely');
    }
  });

  logger.info('Refresh scheduler started (every 6 hours)');
  return scheduledTask;
}

module.exports = {
  startRefreshScheduler,
  refreshNow
};
