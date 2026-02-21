const { classifyArticle } = require('../articles/category.classifier');
const { isSafeExternalUrl, normalizeUrl } = require('../../utils/safe-url');
const { truncate, stripHtml } = require('../../utils/text');
const { normalizedArticleSchema } = require('./ingestion.validation');

function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) {
    return tags
      .map((item) => String(item).trim())
      .filter(Boolean)
      .slice(0, 8);
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean)
      .slice(0, 8);
  }

  return [];
}

function normalizeArticle(rawArticle) {
  const title = truncate(stripHtml(rawArticle.title || ''), 220);
  const description = truncate(stripHtml(rawArticle.description || 'External source preview only.'), 480);
  const url = rawArticle.url || '';

  if (!title || !url || !isSafeExternalUrl(url)) {
    return null;
  }

  const tags = normalizeTags(rawArticle.tags);

  const normalized = {
    title,
    description,
    url: normalizeUrl(url),
    source: rawArticle.source,
    author: truncate(stripHtml(rawArticle.author || 'Unknown'), 90),
    tags,
    category: rawArticle.category || classifyArticle({ title, description, tags }),
    coverImage: isSafeExternalUrl(rawArticle.coverImage || '') ? rawArticle.coverImage : '',
    publishedAt: rawArticle.publishedAt ? new Date(rawArticle.publishedAt) : new Date(),
    isRedirectOnly: true
  };

  const parsed = normalizedArticleSchema.safeParse(normalized);
  return parsed.success ? parsed.data : null;
}

module.exports = {
  normalizeArticle
};
