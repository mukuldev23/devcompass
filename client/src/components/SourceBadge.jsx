function SourceBadge({ source, inverse = false }) {
  const className = inverse
    ? 'inline-flex items-center rounded-full border border-white/30 bg-white/20 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur'
    : 'inline-flex items-center rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700';

  return (
    <span className={className}>{source}</span>
  );
}

export default SourceBadge;
