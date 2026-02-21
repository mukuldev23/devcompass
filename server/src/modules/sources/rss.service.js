const Parser = require('rss-parser');
const { isAllowedByRobots } = require('./robots-checker');
const env = require('../../config/env');

const parser = new Parser({
  timeout: env.REQUEST_TIMEOUT_MS,
  customFields: {
    item: ['media:content', 'content:encoded', 'dc:creator']
  }
});

async function fetchRssArticles(source) {
  const allowed = await isAllowedByRobots(source.endpoint);
  if (!allowed) {
    throw new Error(`${source.name} disallowed by robots policy`);
  }

  const feed = await parser.parseURL(source.endpoint);

  return (feed.items || [])
    .slice(0, env.INGEST_BATCH_SIZE)
    .map((item) => {
      const resolvedUrl =
        (typeof item.link === 'string' && item.link) ||
        (typeof item.id === 'string' && item.id) ||
        (typeof item.guid === 'string' && item.guid) ||
        '';

      return {
        title: item.title,
        description: item.contentSnippet || item.summary || item.content || 'External source preview only',
        url: resolvedUrl,
        source: source.name,
        author: item.creator || item['dc:creator'] || feed.creator || feed.title,
        tags: item.categories || [],
        coverImage: item.enclosure?.url || item['media:content']?.url || '',
        publishedAt: item.isoDate || item.pubDate || new Date().toISOString()
      };
    })
    .filter((item) => Boolean(item.url));
}

module.exports = {
  fetchRssArticles
};
