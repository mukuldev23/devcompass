const httpClient = require('../../utils/http-client');
const env = require('../../config/env');
const { isAllowedByRobots } = require('./robots-checker');

async function fetchDevToArticles() {
  const endpoint = 'https://dev.to/api/articles';
  const robotsAllowed = await isAllowedByRobots(endpoint);

  if (!robotsAllowed) {
    throw new Error('Dev.to disallowed by robots policy');
  }

  const response = await httpClient.get(endpoint, {
    params: {
      per_page: env.INGEST_BATCH_SIZE,
      top: 7
    }
  });

  return response.data.map((article) => ({
    title: article.title,
    description: article.description || 'Read on dev.to',
    url: article.url,
    source: 'Dev.to',
    author: article.user?.name || 'Unknown',
    tags: article.tag_list || [],
    coverImage: article.cover_image || article.social_image || '',
    publishedAt: article.published_at
  }));
}

module.exports = {
  fetchDevToArticles
};
