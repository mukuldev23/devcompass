import { Link, NavLink, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DiscoverPage from './pages/DiscoverPage';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 via-white to-slate-100 text-slate-900">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="block">
            <p className="font-display text-2xl font-bold tracking-wide text-brand-900">DevCompass</p>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">Guides developers to knowledge</p>
          </Link>
          <nav className="flex gap-2 text-sm font-semibold">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 transition ${isActive ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/discover"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 transition ${isActive ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`
              }
            >
              Discover
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/discover" element={<DiscoverPage />} />
        </Routes>
      </main>

      <footer className="border-t border-slate-200 bg-white/90">
        <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs leading-6 text-slate-600 sm:px-6 lg:px-8">
          <p>All articles belong to their respective authors and publishers.</p>
          <p>This platform aggregates publicly available feeds and redirects to original sources.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
