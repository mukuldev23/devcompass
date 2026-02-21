const httpClient = require('../../utils/http-client');
const env = require('../../config/env');
const { isAllowedByRobots } = require('./robots-checker');

async function fetchHackerNewsArticles() {
  const topStoriesEndpoint = 'https://hacker-news.firebaseio.com/v0/topstories.json';

  const allowed = await isAllowedByRobots(topStoriesEndpoint);
  if (!allowed) {
    throw new Error('Hacker News API disallowed by robots policy');
  }

  const { data: storyIds } = await httpClient.get(topStoriesEndpoint);
  const limitedIds = storyIds.slice(0, env.INGEST_BATCH_SIZE);

  const itemRequests = limitedIds.map((id) =>
    httpClient
      .get(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      .then((response) => response.data)
      .catch(() => null)
  );

  const items = await Promise.all(itemRequests);

  return items
    .filter((item) => item && item.url && item.title)
    .map((item) => ({
      title: item.title,
      description: `Hacker News discussion with score ${item.score || 0}.`,
      url: item.url,
      source: 'Hacker News',
      author: item.by || 'Unknown',
      tags: ['hackernews'],
      coverImage: '',
      publishedAt: new Date((item.time || Date.now() / 1000) * 1000).toISOString()
    }));
}

module.exports = {
  fetchHackerNewsArticles
};
