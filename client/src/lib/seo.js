const DEFAULT_SITE_URL = 'https://devcompass.co.in';
const SITE_URL = (import.meta.env.VITE_SITE_URL || DEFAULT_SITE_URL).replace(/\/+$/, '');
const DEFAULT_OG_IMAGE = 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80';

function absoluteUrl(path = '/') {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${normalizedPath}`;
}

function upsertMeta(selector, attrs) {
  let node = document.head.querySelector(selector);
  if (!node) {
    node = document.createElement('meta');
    document.head.appendChild(node);
  }

  Object.entries(attrs).forEach(([key, value]) => {
    node.setAttribute(key, value);
  });
}

function upsertCanonical(href) {
  let node = document.head.querySelector('link[rel="canonical"]');
  if (!node) {
    node = document.createElement('link');
    node.setAttribute('rel', 'canonical');
    document.head.appendChild(node);
  }

  node.setAttribute('href', href);
}

function upsertJsonLd(pathname, pageTitle, pageDescription) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}#organization`,
        name: 'DevCompass',
        url: SITE_URL,
        logo: `${SITE_URL}/logo-512.png`
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}#website`,
        url: SITE_URL,
        name: 'DevCompass',
        publisher: { '@id': `${SITE_URL}#organization` },
        inLanguage: 'en',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/?q={search_term_string}`,
          'query-input': 'required name=search_term_string'
        }
      },
      {
        '@type': 'WebPage',
        '@id': `${absoluteUrl(pathname)}#webpage`,
        url: absoluteUrl(pathname),
        name: pageTitle,
        description: pageDescription,
        isPartOf: { '@id': `${SITE_URL}#website` }
      }
    ]
  };

  let node = document.head.querySelector('script[type="application/ld+json"][data-devcompass="1"]');
  if (!node) {
    node = document.createElement('script');
    node.type = 'application/ld+json';
    node.setAttribute('data-devcompass', '1');
    document.head.appendChild(node);
  }

  node.textContent = JSON.stringify(jsonLd);
}

export function applySeo({ title, description, path = '/', image = DEFAULT_OG_IMAGE }) {
  const canonical = absoluteUrl(path);

  document.title = title;
  upsertCanonical(canonical);

  upsertMeta('meta[name="description"]', { name: 'description', content: description });
  upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' });
  upsertMeta('meta[name="googlebot"]', { name: 'googlebot', content: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1' });

  upsertMeta('meta[property="og:type"]', { property: 'og:type', content: 'website' });
  upsertMeta('meta[property="og:site_name"]', { property: 'og:site_name', content: 'DevCompass' });
  upsertMeta('meta[property="og:title"]', { property: 'og:title', content: title });
  upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
  upsertMeta('meta[property="og:url"]', { property: 'og:url', content: canonical });
  upsertMeta('meta[property="og:image"]', { property: 'og:image', content: image });

  upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
  upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: title });
  upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
  upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: image });

  upsertJsonLd(path, title, description);
}
