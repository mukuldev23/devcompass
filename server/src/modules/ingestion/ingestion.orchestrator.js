const logger = require('../../config/logger');
const articleRepository = require('../articles/article.repository');
const sourceStateRepository = require('./source-state.repository');
const { SOURCE_REGISTRY } = require('./source.registry');
const { normalizeArticle } = require('./normalizer');
const { fetchDevToArticles } = require('../sources/devto.service');
const { fetchRssArticles } = require('../sources/rss.service');
const { fetchHackerNewsArticles } = require('../sources/hn.service');
const { isSafeExternalUrl } = require('../../utils/safe-url');

async function fetchSourceArticles(source) {
  if (source.key === 'devto') {
    return fetchDevToArticles();
  }

  if (source.key === 'hackernews') {
    return fetchHackerNewsArticles();
  }

  if (source.type === 'rss') {
    return fetchRssArticles(source);
  }

  return [];
}

async function runIngestion() {
  const startTime = Date.now();
  const report = {
    fetched: 0,
    normalized: 0,
    inserted: 0,
    modified: 0,
    skippedSources: [],
    failedSources: []
  };

  const normalizedArticles = [];

  for (const source of SOURCE_REGISTRY) {
    if (!isSafeExternalUrl(source.endpoint)) {
      report.failedSources.push({ source: source.name, error: 'Unsafe source endpoint rejected' });
      continue;
    }

    const blocked = await sourceStateRepository.isBlocked(source.key);

    if (blocked) {
      report.skippedSources.push({ source: source.name, reason: 'Temporarily inactive' });
      continue;
    }

    try {
      const rawArticles = await fetchSourceArticles(source);
      report.fetched += rawArticles.length;

      for (const raw of rawArticles) {
        const normalized = normalizeArticle(raw);
        if (normalized) {
          normalizedArticles.push(normalized);
        }
      }

      await sourceStateRepository.markSuccess(source.key);
    } catch (error) {
      report.failedSources.push({ source: source.name, error: error.message });
      await sourceStateRepository.markFailure(source.key, error.message, 6);

      logger.warn({ source: source.name, err: error }, 'Source fetch failed');
    }
  }

  report.normalized = normalizedArticles.length;

  const deduped = [];
  const urlSet = new Set();
  for (const article of normalizedArticles) {
    if (!urlSet.has(article.url)) {
      deduped.push(article);
      urlSet.add(article.url);
    }
  }

  const persistence = await articleRepository.upsertMany(deduped);
  report.inserted = persistence.insertedCount;
  report.modified = persistence.modifiedCount;
  report.elapsedMs = Date.now() - startTime;

  logger.info({ report }, 'Ingestion completed');

  return report;
}

module.exports = {
  runIngestion
};
