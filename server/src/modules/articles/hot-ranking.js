const SOURCE_BOOST = {
  'Hacker News': 30,
  'Dev.to': 26,
  'OpenAI Blog': 24,
  'React Blog': 18,
  'Google AI Blog': 18,
  'Cloudflare Blog': 18,
  'Netflix Tech Blog': 16,
  'freeCodeCamp': 15,
  'InfoQ': 14,
  'StackOverflow Blog': 14
};

const HOT_TOPIC_KEYWORDS = [
  { keyword: 'agentic ai', weight: 24 },
  { keyword: 'ai agents', weight: 22 },
  { keyword: 'mcp', weight: 20 },
  { keyword: 'rag', weight: 18 },
  { keyword: 'reasoning model', weight: 17 },
  { keyword: 'multimodal', weight: 14 },
  { keyword: 'webgpu', weight: 16 },
  { keyword: 'wasm', weight: 16 },
  { keyword: 'bun', weight: 15 },
  { keyword: 'edge runtime', weight: 15 },
  { keyword: 'serverless', weight: 13 },
  { keyword: 'kubernetes', weight: 13 },
  { keyword: 'platform engineering', weight: 14 },
  { keyword: 'zero trust', weight: 14 },
  { keyword: 'supply chain', weight: 13 },
  { keyword: 'devtools', weight: 12 },
  { keyword: 'vite', weight: 10 },
  { keyword: 'next.js', weight: 11 },
  { keyword: 'react 19', weight: 13 },
  { keyword: 'typescript', weight: 10 },
  { keyword: 'benchmark', weight: 12 },
  { keyword: 'release', weight: 9 },
  { keyword: 'announc', weight: 8 }
];

const YOUTUBE_BUZZ_HINTS = ['tutorial', 'deep dive', 'explained', 'from scratch', 'build', 'demo', 'walkthrough'];

function getRecencyScore(publishedAt) {
  const date = new Date(publishedAt);
  const hoursAgo = Math.max(1, (Date.now() - date.getTime()) / (1000 * 60 * 60));

  if (hoursAgo <= 24) return 34;
  if (hoursAgo <= 72) return 27;
  if (hoursAgo <= 7 * 24) return 18;
  if (hoursAgo <= 14 * 24) return 11;
  if (hoursAgo <= 30 * 24) return 6;
  return 2;
}

function computeHotScore(article) {
  const searchable = `${article.title || ''} ${article.description || ''} ${(article.tags || []).join(' ')}`.toLowerCase();

  let score = 0;

  score += SOURCE_BOOST[article.source] || 8;
  score += getRecencyScore(article.publishedAt);

  for (const topic of HOT_TOPIC_KEYWORDS) {
    if (searchable.includes(topic.keyword)) {
      score += topic.weight;
    }
  }

  for (const hint of YOUTUBE_BUZZ_HINTS) {
    if (searchable.includes(hint)) {
      score += 3;
    }
  }

  score += Math.min((article.tags || []).length, 6);

  return score;
}

function rankHotArticles(articles) {
  return articles
    .map((article) => ({
      ...article,
      hotScore: computeHotScore(article)
    }))
    .sort((a, b) => {
      if (b.hotScore !== a.hotScore) return b.hotScore - a.hotScore;
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
}

module.exports = {
  rankHotArticles
};
