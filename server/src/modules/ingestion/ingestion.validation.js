const { z } = require('zod');
const { categories } = require('../articles/article.validation');

const normalizedArticleSchema = z.object({
  title: z.string().min(3).max(220),
  description: z.string().min(3).max(500),
  url: z.string().url(),
  source: z.string().min(2).max(120),
  author: z.string().min(1).max(90),
  tags: z.array(z.string()).max(8),
  category: z.enum(categories),
  coverImage: z.string().optional(),
  publishedAt: z.date(),
  isRedirectOnly: z.boolean()
});

module.exports = {
  normalizedArticleSchema
};
