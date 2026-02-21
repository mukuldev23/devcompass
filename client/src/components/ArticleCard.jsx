import { ExternalLink } from './icons';
import SourceBadge from './SourceBadge';
import { FALLBACK_IMAGE } from '../lib/constants';
import { optimizeImageUrl } from '../lib/image';

function ArticleCard({ article }) {
  const imageSrc = optimizeImageUrl(article.coverImage || FALLBACK_IMAGE, 640);

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-xl" style={{ contentVisibility: 'auto', containIntrinsicSize: '320px' }}>
      <div className="pointer-events-none absolute inset-0 -z-0 bg-gradient-to-br from-white to-brand-50/40 opacity-0 transition group-hover:opacity-100" />
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={imageSrc}
          alt={article.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
          decoding="async"
          width="640"
          height="360"
          fetchpriority="low"
        />
      </div>

      <div className="relative z-10 space-y-4 p-5">
        <div className="flex items-center justify-between gap-2">
          <SourceBadge source={article.source} />
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{article.category}</p>
        </div>

        <h2 className="line-clamp-2 text-lg font-semibold text-slate-900">{article.title}</h2>

        <p className="line-clamp-3 text-sm leading-6 text-slate-600">{article.description}</p>

        <div className="flex flex-wrap gap-2">
          {article.tags?.slice(0, 4).map((tag) => (
            <span key={`${article._id}-${tag}`} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
              #{tag}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1 text-sm">
          <span className="text-slate-500">By {article.author || 'Unknown'}</span>
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 rounded-full bg-brand-700 px-3 py-1.5 font-semibold text-white transition hover:bg-brand-900">
            Read Original <ExternalLink />
          </a>
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;
