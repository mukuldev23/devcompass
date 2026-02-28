import { writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const DEFAULT_SITE_URL = 'https://devcompass.co.in';
const siteUrlRaw = process.env.VITE_SITE_URL || DEFAULT_SITE_URL;
const siteUrl = siteUrlRaw.replace(/\/+$/, '');
const today = new Date().toISOString().split('T')[0];

const routes = [
  { path: '/', changefreq: 'hourly', priority: '1.0' },
  { path: '/discover', changefreq: 'daily', priority: '0.8' }
];

const sitemapEntries = routes
  .map((route) => `  <url>\n    <loc>${siteUrl}${route.path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${route.changefreq}</changefreq>\n    <priority>${route.priority}</priority>\n  </url>`)
  .join('\n');

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`;

const robots = `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;

const publicDir = resolve(process.cwd(), 'public');
writeFileSync(resolve(publicDir, 'sitemap.xml'), sitemap, 'utf8');
writeFileSync(resolve(publicDir, 'robots.txt'), robots, 'utf8');

console.log(`Generated sitemap.xml and robots.txt for ${siteUrl}`);
