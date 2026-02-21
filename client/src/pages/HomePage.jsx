import { useEffect, useMemo, useRef, useState } from 'react';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { fetchArticles, fetchCategories, fetchHotArticles, fetchSources } from '../api/articles.api';
import CategorySidebar from '../components/CategorySidebar';
import ArticleCard from '../components/ArticleCard';
import HotTopicCard from '../components/HotTopicCard';

const PAGE_SIZE = 12;
const MAX_PAGES_IN_MEMORY = 5;

function HomePage() {
  const [category, setCategory] = useState('');

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: Infinity
  });

  const loadMoreRef = useRef(null);
  const lastFetchAtRef = useRef(0);
  const lastSentinelYRef = useRef(Number.POSITIVE_INFINITY);

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

  const { data: sources = [] } = useQuery({
    queryKey: ['sources'],
    queryFn: fetchSources,
    staleTime: Infinity
  });

  const { data: hotArticles = [], isLoading: hotLoading } = useQuery({
    queryKey: ['hot-articles', category],
    queryFn: () => fetchHotArticles({ category, limit: 6 })
  });

  const articles = useMemo(
    () => (articlePages?.pages || []).flatMap((page) => page.items || []),
    [articlePages]
  );

  const sourceCountLabel = useMemo(() => {
    const activeSources = sources.filter((source) => source.active);
    return `${activeSources.length} active sources`;
  }, [sources]);

  const hasNextPageRef = useRef(hasNextPage);
  const isFetchingNextPageRef = useRef(isFetchingNextPage);
  useEffect(() => { hasNextPageRef.current = hasNextPage; }, [hasNextPage]);
  useEffect(() => { isFetchingNextPageRef.current = isFetchingNextPage; }, [isFetchingNextPage]);

  useEffect(() => {
    const node = loadMoreRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        const now = Date.now();
        const currentY = entry.boundingClientRect.y;
        const scrollingDown = currentY < lastSentinelYRef.current;
        lastSentinelYRef.current = currentY;

        if (entry.isIntersecting && scrollingDown && hasNextPageRef.current && !isFetchingNextPageRef.current && now - lastFetchAtRef.current > 800) {
          lastFetchAtRef.current = now;
          fetchNextPage();
        }
      },
      {
        rootMargin: '100px 0px',
        threshold: 0.1
      }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, [fetchNextPage]);

  return (
    <section className="space-y-7">
      <div className="relative overflow-hidden rounded-3xl border border-brand-100 bg-white p-6 shadow-card sm:p-8">
        <div className="absolute -right-10 -top-10 h-36 w-36 rounded-full bg-brand-100 blur-2xl" />
        <div className="absolute -bottom-14 left-20 h-40 w-40 rounded-full bg-cyan-100 blur-2xl" />
        <p className="relative z-10 text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Developer News Discovery</p>
        <h1 className="relative z-10 mt-2 font-display text-3xl font-bold text-slate-900 sm:text-5xl">Find what developers are reading right now</h1>
        <p className="relative z-10 mt-3 max-w-3xl text-sm leading-6 text-slate-600">
          DevCompass respects robots.txt, stores metadata only, and always links you back to the original source for full content.
        </p>
        <div className="relative z-10 mt-4 flex flex-wrap gap-2">
          <p className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{sourceCountLabel}</p>
          <p className="inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">Trending topics boosted</p>
          <p className="inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">Niche categories enabled</p>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-rose-700">Hot Right Now</p>
            <h2 className="font-display text-2xl font-bold text-slate-900">Popular and buzz-heavy topics first</h2>
          </div>
          <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold text-white">Live Ranking</span>
        </div>

        {hotLoading ? (
          <p className="text-sm text-slate-500">Loading hot topics...</p>
        ) : hotArticles.length ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {hotArticles.map((article, index) => (
              <HotTopicCard key={`${article._id || article.url}-hot`} article={article} rank={index + 1} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500">No hot topics available yet. Trigger a refresh from admin.</p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px,1fr]">
        <div className="lg:sticky lg:top-24 lg:h-fit">
          {categoriesLoading ? (
            <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">Loading categories...</p>
          ) : (
            <CategorySidebar categories={categories} activeCategory={category} onSelect={setCategory} />
          )}
        </div>

        <div>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-display text-xl font-bold text-slate-900">Latest Feed</h3>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{articles.length} shown</span>
          </div>

          {articlesLoading ? (
            <p className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-500">Loading articles...</p>
          ) : articles.length ? (
            <>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {articles.map((article) => (
                  <ArticleCard article={article} key={article._id || article.url} />
                ))}
              </div>

              <div ref={loadMoreRef} className="py-6 text-center">
                {isFetchingNextPage ? (
                  <p className="text-sm text-slate-500">Loading more articles...</p>
                ) : hasNextPage ? (
                  <p className="text-sm text-slate-500">Scroll down to load more</p>
                ) : (
                  <p className="text-sm text-slate-500">You reached the end.</p>
                )}
              </div>
            </>
          ) : (
            <p className="rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
              No articles found for this category yet. Try another category or trigger a refresh from the admin endpoint.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

export default HomePage;
