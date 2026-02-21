import { ExternalLink } from './icons';
import SourceBadge from './SourceBadge';
import { FALLBACK_IMAGE } from '../lib/constants';
import { optimizeImageUrl } from '../lib/image';

function HotTopicCard({ article, rank }) {
  const imageSrc = optimizeImageUrl(article.coverImage || FALLBACK_IMAGE, 900);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="absolute left-3 top-3 z-10 rounded-full bg-rose-600 px-3 py-1 text-xs font-bold text-white">Hot #{rank}</div>
      <div className="relative h-48 overflow-hidden">
        <img
          src={imageSrc}
          alt={article.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          loading="lazy"
          decoding="async"
          width="900"
          height="500"
          fetchpriority="low"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent" />

        <div className="absolute bottom-0 w-full p-4 text-white">
          <div className="mb-2 flex items-center justify-between gap-2">
            <SourceBadge source={article.source} inverse />
            <span className="rounded-full bg-white/20 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide backdrop-blur">
              Score {article.hotScore}
            </span>
          </div>

          <h3 className="line-clamp-2 text-lg font-bold leading-6">{article.title}</h3>

          <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-brand-100">
            Read Original
            <ExternalLink />
          </p>
        </div>
      </div>
    </a>
  );
}

export default HotTopicCard;
