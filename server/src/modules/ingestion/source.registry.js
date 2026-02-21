const SOURCE_REGISTRY = [
  {
    key: 'devto',
    name: 'Dev.to',
    type: 'api',
    endpoint: 'https://dev.to/api/articles'
  },
  {
    key: 'hackernews',
    name: 'Hacker News',
    type: 'api',
    endpoint: 'https://hacker-news.firebaseio.com/v0/topstories.json'
  },
  { key: 'stackoverflow-blog', name: 'StackOverflow Blog', type: 'rss', endpoint: 'https://stackoverflow.blog/feed/' },
  { key: 'infoq', name: 'InfoQ', type: 'rss', endpoint: 'https://www.infoq.com/feed/' },
  { key: 'smashing-magazine', name: 'Smashing Magazine', type: 'rss', endpoint: 'https://www.smashingmagazine.com/feed/' },
  { key: 'css-tricks', name: 'CSS-Tricks', type: 'rss', endpoint: 'https://css-tricks.com/feed/' },
  { key: 'freecodecamp', name: 'freeCodeCamp', type: 'rss', endpoint: 'https://www.freecodecamp.org/news/rss/' },
  { key: 'mozilla-developer-blog', name: 'Mozilla Developer Blog', type: 'rss', endpoint: 'https://hacks.mozilla.org/feed/' },
  { key: 'webdev', name: 'web.dev', type: 'rss', endpoint: 'https://web.dev/feed.xml' },
  { key: 'microsoft-devblogs', name: 'Microsoft DevBlogs', type: 'rss', endpoint: 'https://devblogs.microsoft.com/feed/' },
  { key: 'google-opensource-blog', name: 'Google Open Source Blog', type: 'rss', endpoint: 'https://opensource.googleblog.com/feeds/posts/default?alt=rss' },
  { key: 'react-blog', name: 'React Blog', type: 'rss', endpoint: 'https://react.dev/feed.xml' },
  { key: 'nodejs-blog', name: 'Node.js Blog', type: 'rss', endpoint: 'https://nodejs.org/en/feed/blog.xml' },
  { key: 'angular-blog', name: 'Angular Blog', type: 'rss', endpoint: 'https://blog.angular.dev/feed' },
  { key: 'vue-blog', name: 'Vue Blog', type: 'rss', endpoint: 'https://blog.vuejs.org/feed.xml' },
  { key: 'svelte-blog', name: 'Svelte Blog', type: 'rss', endpoint: 'https://svelte.dev/blog/rss.xml' },
  { key: 'vite-blog', name: 'Vite Blog', type: 'rss', endpoint: 'https://vite.dev/blog/rss.xml' },
  { key: 'aws-architecture', name: 'AWS Architecture Blog', type: 'rss', endpoint: 'https://aws.amazon.com/blogs/architecture/feed/' },
  { key: 'netflix-tech', name: 'Netflix Tech Blog', type: 'rss', endpoint: 'https://netflixtechblog.com/feed' },
  { key: 'uber-engineering', name: 'Uber Engineering', type: 'rss', endpoint: 'https://www.uber.com/en-IN/blog/engineering/rss/' },
  { key: 'cloudflare-blog', name: 'Cloudflare Blog', type: 'rss', endpoint: 'https://blog.cloudflare.com/rss/' },
  { key: 'digitalocean-blog', name: 'DigitalOcean Blog', type: 'rss', endpoint: 'https://www.digitalocean.com/blog/rss.xml' },
  { key: 'nginx-blog', name: 'Nginx Blog', type: 'rss', endpoint: 'https://www.nginx.com/blog/feed/' },
  { key: 'openai-blog', name: 'OpenAI Blog', type: 'rss', endpoint: 'https://openai.com/blog/rss.xml' },
  { key: 'huggingface-blog', name: 'HuggingFace Blog', type: 'rss', endpoint: 'https://huggingface.co/blog/feed.xml' },
  { key: 'google-ai-blog', name: 'Google AI Blog', type: 'rss', endpoint: 'https://blog.google/technology/ai/rss/' },
  { key: 'meta-ai-blog', name: 'Meta AI Blog', type: 'rss', endpoint: 'https://ai.meta.com/blog/rss/' },
  { key: 'python-insider', name: 'Python Insider', type: 'rss', endpoint: 'https://feeds.feedburner.com/PythonInsider' },
  { key: 'go-blog', name: 'Go Blog', type: 'rss', endpoint: 'https://go.dev/blog/feed.atom' },
  { key: 'rust-blog', name: 'Rust Blog', type: 'rss', endpoint: 'https://blog.rust-lang.org/feed.xml' },
  { key: 'kotlin-blog', name: 'Kotlin Blog', type: 'rss', endpoint: 'https://blog.jetbrains.com/kotlin/feed/' },
  { key: 'java-blog', name: 'Java Official Blog', type: 'rss', endpoint: 'https://inside.java/feed.xml' },
  { key: 'krebs-security', name: 'KrebsOnSecurity', type: 'rss', endpoint: 'https://krebsonsecurity.com/feed/' },
  { key: 'owasp-blog', name: 'OWASP Blog', type: 'rss', endpoint: 'https://owasp.org/feed.xml' },
  { key: 'snyk-blog', name: 'Snyk Blog', type: 'rss', endpoint: 'https://snyk.io/blog/feed/' }
];

module.exports = {
  SOURCE_REGISTRY
};
