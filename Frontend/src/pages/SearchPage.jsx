import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { DefaultlayoutHoc } from '../layout/DefaultLayout';
import { movieAPI, tmdbAPI, IMG_W500 } from '../services/api';
import { DEMO_MOVIES } from '../services/demoData';
import Loader from '../components/Loader/Loader';

const SearchPage = () => {
  const [params] = useSearchParams();
  const query = params.get('q') || '';
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);

    const run = async () => {
      // 1. Backend search
      try {
        const res = await movieAPI.search(query);
        if (res.data?.length > 0) { setResults(res.data); return; }
      } catch {}

      // 2. TMDB
      if (process.env.REACT_APP_TMDB_KEY) {
        try {
          const res = await tmdbAPI.search(query);
          if (res.data?.results?.length > 0) {
            setResults(res.data.results.map(m => ({ ...m, title: m.title || m.original_title, posterUrl: m.poster_path })));
            return;
          }
        } catch {}
      }

      // 3. Demo filter
      const q = query.toLowerCase();
      setResults(DEMO_MOVIES.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.genre.toLowerCase().includes(q) ||
        m.language.toLowerCase().includes(q)
      ));
    };

    run().finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="container mx-auto px-4 md:px-10 py-10 max-w-screen-xl">
      <h1 className="text-white text-2xl font-black mb-1">
        {query ? `Search results for "${query}"` : 'Search Movies'}
      </h1>
      {searched && !loading && (
        <p className="text-gray-500 text-sm mb-8">{results.length} result{results.length !== 1 ? 's' : ''} found</p>
      )}

      {loading && <Loader />}

      {!loading && searched && results.length === 0 && (
        <div className="text-center py-20 animate-scale-in">
          <div className="text-6xl mb-4" style={{ filter: 'grayscale(1) opacity(0.5)' }}>🔍</div>
          <h3 className="text-white text-xl font-bold mb-2">No results found</h3>
          <p className="text-gray-500 text-sm mb-6">
            No movies found for <span className="text-red-400">"{query}"</span>
          </p>
          <Link to="/" className="btn-red inline-block text-white px-8 py-3 rounded-xl font-bold text-sm">
            Browse All Movies
          </Link>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-up">
          {results.map((m, i) => {
            const src = m.posterUrl
              ? (m.posterUrl.startsWith('http') ? m.posterUrl : `${IMG_W500}${m.posterUrl}`)
              : m.poster_path ? `${IMG_W500}${m.poster_path}` : null;
            return (
              <Link key={m.id || i} to={`/movie/${m.id}`}
                className="movie-card block rounded-xl overflow-hidden"
                style={{ background: '#14152b', border: '1px solid rgba(255,255,255,0.05)', animationDelay: `${i * 0.04}s` }}>
                <div className="relative overflow-hidden" style={{ paddingBottom: '150%' }}>
                  {src
                    ? <img src={src} alt={m.title} className="absolute inset-0 w-full h-full object-cover"
                        onError={e => { e.target.src = `https://placehold.co/200x300/14152b/e51937?text=${encodeURIComponent(m.title?.slice(0,10) || '?')}`; }} />
                    : <div className="absolute inset-0 flex items-center justify-center" style={{ background: '#1a1b2e' }}>
                        <span className="text-gray-600 text-4xl">🎬</span>
                      </div>
                  }
                  <div className="card-overlay absolute inset-0 flex items-end p-3 opacity-0 transition-opacity duration-300"
                    style={{ background: 'linear-gradient(to top, rgba(229,25,55,0.85), transparent)' }}>
                    <span className="text-white text-xs font-bold">Book Now</span>
                  </div>
                </div>
                <div className="p-2.5 pb-3">
                  <p className="text-white text-xs font-semibold line-clamp-2 leading-tight mb-1">{m.title}</p>
                  {m.genre && <p className="text-gray-600 text-xs truncate">{m.genre}</p>}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DefaultlayoutHoc(SearchPage);
