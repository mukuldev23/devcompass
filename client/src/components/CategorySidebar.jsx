function CategorySidebar({ categories, activeCategory, onSelect }) {
  return (
    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-slate-900">Categories</h2>
        <button
          type="button"
          onClick={() => onSelect('')}
          className="text-xs font-semibold uppercase tracking-wide text-brand-700"
        >
          Clear
        </button>
      </div>

      <div className="space-y-2">
        {categories.map((category) => {
          const active = activeCategory === category.name;

          return (
            <button
              type="button"
              key={category.name}
              onClick={() => onSelect(category.name)}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                active ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span>{category.name}</span>
              <span className={`rounded-full px-2 py-0.5 text-xs ${active ? 'bg-brand-500/40' : 'bg-white'}`}>{category.count}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default CategorySidebar;
