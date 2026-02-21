import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchArticles, fetchCategories, fetchHotArticles, fetchSources } from '../api/articles.api';
import { ExternalLink } from '../components/icons';
import { FALLBACK_IMAGE } from '../lib/constants';
import { optimizeImageUrl } from '../lib/image';

const PAGE_SIZE = 12;
const MAX_PAGES_IN_MEMORY = 20;

function formatDateLabel(dateInput) {
  const date = dateInput ? new Date(dateInput) : new Date();
  if (Number.isNaN(date.getTime())) return 'Today';

  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(date);
}

function LeadStoryCard({ article }) {
  if (!article) return null;

  const imageSrc = optimizeImageUrl(article.coverImage || FALLBACK_IMAGE, 740);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border border-slate-300 bg-[#f4f4f3] p-3 transition hover:border-slate-500"
    >
      <img src={imageSrc} alt={article.title} className="h-52 w-full object-cover" loading="lazy" decoding="async" />
      <p className="mt-3 font-sans text-xs font-bold uppercase tracking-[0.16em] text-slate-500">{article.source}</p>
      <h2 className="mt-2 font-display text-[2.1rem] font-bold leading-[1.02] text-slate-900">{article.title}</h2>
      <p className="mt-3 font-editorial text-2xl leading-8 text-slate-700">{article.description}</p>
      <p className="mt-4 inline-flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-[0.13em] text-slate-900">
        Read More <ExternalLink />
      </p>
    </a>
  );
}

function HeroStoryCard({ article }) {
  if (!article) return null;

  const imageSrc = optimizeImageUrl(article.coverImage || FALLBACK_IMAGE, 1100);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border border-slate-300 bg-[#f4f4f3] p-3 transition hover:border-slate-500"
    >
      <img src={imageSrc} alt={article.title} className="h-80 w-full object-cover" loading="lazy" decoding="async" />
      <p className="mt-3 font-sans text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Most Talked About</p>
      <h2 className="mt-1 font-display text-[3.2rem] font-bold leading-[0.98] text-slate-900">{article.title}</h2>
      <p className="mt-3 font-editorial text-3xl leading-10 text-slate-700">{article.description}</p>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        {(article.tags || []).slice(0, 4).map((tag) => (
          <span key={`${article._id}-${tag}`} className="border border-slate-300 px-2 py-1 font-mono text-xs uppercase tracking-widest text-slate-600">
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
}

function StreamCard({ article }) {
  const imageSrc = optimizeImageUrl(article.coverImage || FALLBACK_IMAGE, 760);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block border border-slate-300 bg-[#f4f4f3] p-3 transition hover:border-slate-500"
    >
      <img src={imageSrc} alt={article.title} className="h-44 w-full object-cover" loading="lazy" decoding="async" />
      <p className="mt-3 font-mono text-xs uppercase tracking-[0.12em] text-slate-500">{article.category}</p>
      <h3 className="mt-1 font-display text-[1.9rem] leading-[1.02] text-slate-900">{article.title}</h3>
      <p className="mt-2 line-clamp-3 font-editorial text-2xl leading-8 text-slate-700">{article.description}</p>
      <p className="mt-3 font-sans text-sm font-semibold text-slate-500">By {article.author || 'Unknown'}</p>
    </a>
  );
}

function HomePage() {
  const [category, setCategory] = useState('');

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: Infinity
  });

  const { data: sources = [] } = useQuery({
    queryKey: ['sources'],
    queryFn: fetchSources,
    staleTime: Infinity
  });

  const { data: hotArticles = [] } = useQuery({
    queryKey: ['hot-articles', category],
    queryFn: () => fetchHotArticles({ category, limit: 6 })
  });

  const loadMoreRef = useRef(null);
  const autoFetchingRef = useRef(false);

  const {
    data: articlePages,
    isLoading: articlesLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['articles', category],
    queryFn: ({ pageParam }) => fetchArticles({ category, page: pageParam, limit: PAGE_SIZE }),
    initialPageParam: 1,
    maxPages: MAX_PAGES_IN_MEMORY,
    gcTime: 60_000,
    getNextPageParam: (lastPage) => {
      if (!lastPage || lastPage.page >= lastPage.pages) return undefined;
      return lastPage.page + 1;
    }
  });

  const articles = useMemo(
    () => (articlePages?.pages || []).flatMap((page) => page.items || []),
    [articlePages]
  );

  const leadStory = articles[0] || null;
  const heroStory = articles[1] || articles[0] || null;
  const sideHeadlines = (hotArticles.length ? hotArticles : articles).slice(2, 6);
  const streamStories = articles.slice(2);
  const activeSourceCount = sources.filter((source) => source.active).length;
  const categoryStrip = categories.filter((cat) => cat.count > 0);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage && !autoFetchingRef.current) {
          autoFetchingRef.current = true;
          fetchNextPage().finally(() => {
            setTimeout(() => {
              autoFetchingRef.current = false;
            }, 300);
          });
        }
      },
      {
        rootMargin: '500px 0px',
        threshold: 0
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <section className="space-y-4 pb-6">
      <div className="border-2 border-slate-300 bg-[#ebebe9] p-4 sm:p-6">
        <div className="grid gap-4 border-b border-slate-300 pb-4 lg:grid-cols-[1fr,2fr,1fr] lg:items-end">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-700">Quality Publication</p>
            <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">AI • WEB • ARCH • OSS</p>
          </div>

          <div className="text-center">
            <h1 className="font-headline text-6xl uppercase leading-none tracking-[0.18em] text-slate-900 sm:text-7xl">Devcompass</h1>
            <p className="mt-2 font-editorial text-3xl text-slate-600">{formatDateLabel(heroStory?.publishedAt)}</p>
          </div>

          <div className="text-right">
            <p className="mt-1 font-headline text-5xl tracking-[0.08em] text-slate-700">{activeSourceCount}</p>
            <p className="font-sans text-sm uppercase tracking-[0.2em] text-slate-500">active sources</p>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto border-y border-slate-300 py-2">
          <div className="flex min-w-max items-center gap-2">
            {categoryStrip.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => setCategory(cat.name)}
                className={`inline-flex items-center gap-2 border border-slate-300 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] transition ${category === cat.name
                  ? 'bg-slate-900 text-white'
                  : 'bg-[#f6ece0] text-slate-800 hover:bg-[#eddccc]'
                  }`}
              >
                <span>{cat.name}</span>
                <span className="bg-[#f2d6b7] px-1.5 py-0.5 text-slate-900">{cat.count}</span>
              </button>
            ))}
            {category && (
              <button
                type="button"
                onClick={() => setCategory('')}
                className="inline-flex items-center border border-slate-300 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.12em] text-slate-600 hover:bg-slate-100"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {articlesLoading ? (
        <p className="border border-slate-300 bg-[#f4f4f3] p-6 font-editorial text-3xl text-slate-600">Loading newsroom feed...</p>
      ) : articles.length ? (
        <>
          <div className="grid gap-4 xl:grid-cols-[0.9fr,1.2fr,0.7fr]">
            <LeadStoryCard article={leadStory} />
            <HeroStoryCard article={heroStory} />

            <aside className="space-y-4">
              <div className="border border-slate-300 bg-[#f4f4f3] p-3">
                {sideHeadlines.map((story, idx) => (
                  <a
                    key={story._id || story.url}
                    href={story.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block border-b border-slate-300 py-3 last:border-0 last:pb-0 first:pt-0"
                  >
                    <p className="font-sans text-sm uppercase tracking-[0.14em] text-slate-500">{story.category}</p>
                    <h3 className="mt-1 font-display text-[1.8rem] leading-[1.02] text-slate-900">{story.title}</h3>
                    <p className="mt-1 font-editorial text-2xl text-slate-600">By {story.author || 'Unknown'}</p>
                    {idx === 0 && (
                      <p className="mt-1 font-mono text-xs uppercase tracking-widest text-slate-500">Top talked topic</p>
                    )}
                  </a>
                ))}
              </div>


            </aside>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {streamStories.map((article) => (
              <StreamCard key={article._id || article.url} article={article} />
            ))}
          </div>

          <div ref={loadMoreRef} className="pt-3 text-center">
            {isFetchingNextPage ? (
              <p className="font-editorial text-3xl text-slate-600">Loading more stories...</p>
            ) : hasNextPage ? (
              <button
                type="button"
                onClick={() => fetchNextPage()}
                className="border border-slate-400 bg-[#f6ece0] px-5 py-2 font-mono text-xs uppercase tracking-[0.13em] text-slate-800 transition hover:bg-[#eddccc]"
              >
                Load more now
              </button>
            ) : (
              <p className="font-editorial text-3xl text-slate-600">You reached the end of this edition.</p>
            )}
          </div>
        </>
      ) : (
        <p className="border border-slate-300 bg-[#f4f4f3] p-6 font-editorial text-3xl text-slate-600">
          No articles found for this category yet. Try another category.
        </p>
      )}
    </section>
  );
}

export default HomePage;
