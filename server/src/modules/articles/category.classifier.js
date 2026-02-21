const KEYWORDS = {
  AI: ['ai', 'artificial intelligence', 'llm', 'machine learning', 'deep learning', 'genai', 'rag', 'agentic'],
  Frontend: ['frontend', 'react', 'vue', 'angular', 'svelte', 'css', 'javascript', 'typescript', 'web ui'],
  Backend: ['backend', 'api', 'microservice', 'server', 'node.js', 'django', 'spring', 'database', 'rest'],
  DevOps: ['devops', 'ci/cd', 'kubernetes', 'docker', 'infrastructure', 'terraform', 'observability', 'sre'],
  Mobile: ['mobile', 'android', 'ios', 'react native', 'flutter', 'swift', 'kotlin'],
  Security: ['security', 'vulnerability', 'cve', 'xss', 'owasp', 'threat', 'exploit'],
  'Programming Languages': ['python', 'go', 'rust', 'java', 'kotlin', 'c++', 'language', 'compiler'],
  Architecture: ['architecture', 'distributed systems', 'scaling', 'resilience', 'event-driven', 'design'],
  Career: ['career', 'interview', 'productivity', 'leadership', 'developer experience', 'learning path'],
  'WebAssembly & Systems': ['webassembly', 'wasm', 'systems programming', 'memory model', 'wasi', 'low-level'],
  'Edge & Serverless': ['edge runtime', 'edge function', 'cloudflare workers', 'serverless', 'lambda', 'cdn edge'],
  'Developer Tooling': ['devtools', 'vite', 'bundler', 'linter', 'formatter', 'dx tooling', 'cli tool'],
  'Testing & QA': ['testing', 'qa', 'playwright', 'cypress', 'unit test', 'integration test', 'e2e'],
  'Performance Engineering': ['performance', 'latency', 'benchmark', 'profiling', 'optimization', 'web vitals'],
  'Browser Internals': ['browser engine', 'chromium', 'v8', 'rendering pipeline', 'layout engine', 'gecko'],
  'Data Engineering': ['data pipeline', 'stream processing', 'etl', 'warehouse', 'lakehouse', 'spark'],
  Accessibility: ['accessibility', 'a11y', 'screen reader', 'aria', 'inclusive design'],
  'Open Source Governance': ['open source governance', 'maintainer', 'license', 'foundation', 'oss sustainability']
};

function classifyArticle({ title = '', description = '', tags = [] }) {
  const searchableText = `${title} ${description} ${tags.join(' ')}`.toLowerCase();

  let bestCategory = 'Developer Tooling';
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(KEYWORDS)) {
    const score = keywords.reduce((total, keyword) => {
      if (searchableText.includes(keyword)) {
        return total + 1;
      }
      return total;
    }, 0);

    if (score > bestScore) {
      bestCategory = category;
      bestScore = score;
    }
  }

  return bestCategory;
}

module.exports = {
  classifyArticle
};
