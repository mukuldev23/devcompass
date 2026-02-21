const articleRepository = require('./article.repository');
const { categories } = require('./article.validation');
const cacheClient = require('../../config/cache');
const { runIngestion } = require('../ingestion/ingestion.orchestrator');
const sourceStateRepository = require('../ingestion/source-state.repository');
const { SOURCE_REGISTRY } = require('../ingestion/source.registry');
const { rankHotArticles } = require('./hot-ranking');

const CACHE_KEYS = {
  articles: 'articles:list:',
  hot: 'articles:hot:',
  categories: 'articles:categories',
  sources: 'articles:sources',
  randomState: 'articles:random:state'
};

const TTL_SECONDS = {
  list: 300,
  categories: 600,
  sources: 600,
  randomState: 24 * 3600
};

class ArticleService {
  async listArticles({ category, page, limit }) {
    const cacheKey = `${CACHE_KEYS.articles}${category || 'all'}:${page}:${limit}`;
    const cached = await cacheClient.get(cacheKey);
    if (cached) return cached;

    const response = await articleRepository.findPaginated({ category, page, limit });

    await cacheClient.set(cacheKey, response, TTL_SECONDS.list);
    return response;
  }

  async getHotArticles({ category, limit }) {
    const cacheKey = `${CACHE_KEYS.hot}${category || 'all'}:${limit}`;
    const cached = await cacheClient.get(cacheKey);
    if (cached) return cached;

    const recentArticles = await articleRepository.findRecent({ category, limit: 450 });
    const ranked = rankHotArticles(recentArticles).slice(0, limit);

    await cacheClient.set(cacheKey, ranked, TTL_SECONDS.list);
    return ranked;
  }

  async getCategories() {
    const cached = await cacheClient.get(CACHE_KEYS.categories);
    if (cached) return cached;

    const countsByCategory = await articleRepository.countByCategory();
    const response = categories.map((name) => ({
      name,
      count: countsByCategory[name] || 0
    }));

    await cacheClient.set(CACHE_KEYS.categories, response, TTL_SECONDS.categories);
    return response;
  }

  async getSources() {
    const cached = await cacheClient.get(CACHE_KEYS.sources);
    if (cached) return cached;

    const [availableSources, sourceStates] = await Promise.all([
      articleRepository.findDistinctSources(),
      sourceStateRepository.listAll()
    ]);

    const stateByKey = sourceStates.reduce((acc, row) => {
      acc[row.sourceKey] = row;
      return acc;
    }, {});

    const response = SOURCE_REGISTRY.map((source) => {
      const state = stateByKey[source.key];

      return {
        key: source.key,
        name: source.name,
        endpoint: source.endpoint,
        hasArticles: availableSources.includes(source.name),
        active: state ? state.active : true,
        blockedUntil: state?.blockedUntil || null,
        lastError: state?.lastError || ''
      };
    });

    await cacheClient.set(CACHE_KEYS.sources, response, TTL_SECONDS.sources);

    return response;
  }

  async getRandomArticle() {
    const state = (await cacheClient.get(CACHE_KEYS.randomState)) || {
      seenIds: [],
      lastSource: null
    };

    let candidate = await articleRepository.findRandomCandidate({
      excludedIds: state.seenIds,
      excludedSource: state.lastSource
    });

    if (!candidate) {
      candidate = await articleRepository.findRandomCandidate({
        excludedIds: [],
        excludedSource: state.lastSource
      });
    }

    if (!candidate) {
      candidate = await articleRepository.findRandomAny();
    }

    if (!candidate) {
      return null;
    }

    const seenIds = [...state.seenIds, String(candidate._id)].slice(-500);
    await cacheClient.set(
      CACHE_KEYS.randomState,
      {
        seenIds,
        lastSource: candidate.source
      },
      TTL_SECONDS.randomState
    );

    return candidate;
  }

  async refreshArticles() {
    const report = await runIngestion();

    await Promise.all([
      cacheClient.deleteByPrefix(CACHE_KEYS.articles),
      cacheClient.deleteByPrefix(CACHE_KEYS.hot),
      cacheClient.del(CACHE_KEYS.categories),
      cacheClient.del(CACHE_KEYS.sources)
    ]);

    return report;
  }
}

module.exports = new ArticleService();
