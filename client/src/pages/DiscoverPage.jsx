import { useMutation } from '@tanstack/react-query';
import { fetchRandomArticle } from '../api/articles.api';
import ArticleCard from '../components/ArticleCard';

function DiscoverPage() {
  const randomMutation = useMutation({
    mutationFn: fetchRandomArticle
  });

  return (
    <section className="mx-auto max-w-3xl space-y-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-card">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-700">Discovery Mode</p>
        <h1 className="mt-3 font-display text-4xl font-bold text-slate-900">One click. One new idea.</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600">
          Discover an article from a different source while keeping attribution and legal metadata boundaries intact.
        </p>

        <button
          type="button"
          onClick={() => randomMutation.mutate()}
          className="mt-6 inline-flex items-center rounded-full bg-brand-700 px-10 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-brand-900"
        >
          Discover Something New
        </button>
      </div>

      {randomMutation.isPending && <p className="text-center text-sm text-slate-600">Finding an article...</p>}

      {randomMutation.isError && (
        <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Unable to fetch a random article right now. Please try again.
        </p>
      )}

      {randomMutation.data && <ArticleCard article={randomMutation.data} />}
    </section>
  );
}

export default DiscoverPage;
