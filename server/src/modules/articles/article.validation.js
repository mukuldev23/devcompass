const { z } = require('zod');

const categories = [
  'AI',
  'Frontend',
  'Backend',
  'DevOps',
  'Mobile',
  'Security',
  'Programming Languages',
  'Architecture',
  'Career',
  'WebAssembly & Systems',
  'Edge & Serverless',
  'Developer Tooling',
  'Testing & QA',
  'Performance Engineering',
  'Browser Internals',
  'Data Engineering',
  'Accessibility',
  'Open Source Governance'
];

function normalizeCategoryKey(value) {
  return value
    .toLowerCase()
    .replaceAll('&', 'and')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

const categoryMap = categories.reduce((acc, category) => {
  const normalized = normalizeCategoryKey(category);
  acc[category.toLowerCase()] = category;
  acc[normalized] = category;
  acc[normalized.replace(/\s+/g, '')] = category;
  return acc;
}, {});

function toCanonicalCategory(input) {
  if (!input) return undefined;
  const trimmed = input.trim();
  return categoryMap[trimmed.toLowerCase()] || categoryMap[normalizeCategoryKey(trimmed)] || categoryMap[normalizeCategoryKey(trimmed).replace(/\s+/g, '')];
}

const listArticlesQuerySchema = z.object({
  category: z
    .string()
    .optional()
    .refine((value) => !value || Boolean(toCanonicalCategory(value)), {
      message: 'Unknown category'
    })
    .transform((value) => toCanonicalCategory(value)),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(50).default(20)
});

const hotArticlesQuerySchema = z.object({
  category: z
    .string()
    .optional()
    .refine((value) => !value || Boolean(toCanonicalCategory(value)), {
      message: 'Unknown category'
    })
    .transform((value) => toCanonicalCategory(value)),
  limit: z.coerce.number().int().positive().max(40).default(12)
});

module.exports = {
  categories,
  toCanonicalCategory,
  listArticlesQuerySchema,
  hotArticlesQuerySchema
};
