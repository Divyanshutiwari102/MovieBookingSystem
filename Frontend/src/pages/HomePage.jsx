import React, { useEffect, useState } from 'react';
import { DefaultlayoutHoc } from '../layout/DefaultLayout';
import HeroCarousel from '../components/HeroCarousel/HeroCarousel';
import EntertainmentSection from '../components/Entertainment/EntertainmentSection';
import PosterSlider from '../components/PosterSlider/PosterSlider';
import Loader from '../components/Loader/Loader';
import { movieAPI, tmdbAPI } from '../services/api';
import { DEMO_MOVIES, DEMO_BACKDROPS } from '../services/demoData';

const GENRES = ['All', 'Action', 'Drama', 'Comedy', 'Sci-Fi', 'Horror', 'Animation', 'Thriller'];

const AUTO = {
  arrows: true, infinite: true, dots: false, slidesToShow: 6, slidesToScroll: 1,
  autoplay: true, speed: 3500, autoplaySpeed: 0, cssEase: 'linear', pauseOnHover: true,
  responsive: [
    { breakpoint: 1536, settings: { slidesToShow: 5 } },
    { breakpoint: 1280, settings: { slidesToShow: 4 } },
    { breakpoint: 1024, settings: { slidesToShow: 3 } },
    { breakpoint: 640,  settings: { slidesToShow: 2 } },
  ],
};

const MARQUEE_LABELS = ['🎬 Now Showing','🔥 Trending','⭐ Top Rated','🎭 New Release','🍿 Must Watch','💥 Blockbuster'];

const HomePage = () => {
  const [movies, setMovies]       = useState([]);
  const [backdrops, setBackdrops] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [source, setSource]       = useState(''); // 'backend' | 'tmdb' | 'demo'
  const [genre, setGenre]         = useState('All');

  useEffect(() => {
    const load = async () => {
      // 1. Try backend
      try {
        const res = await movieAPI.getAll();
        const data = res.data || [];
        if (data.length > 0) {
          setMovies(data);
          // Always use DEMO_BACKDROPS for hero carousel — they have real wide backdrop images
          // Backend only stores poster_url (portrait), not backdrop (landscape)
          setBackdrops(DEMO_BACKDROPS.map(b => ({
            ...b,
            description: data.find(m => m.id === b.id)?.description || b.description,
          })));
          setSource('backend');
          return;
        }
      } catch {}

      // 2. Try TMDB
      if (process.env.REACT_APP_TMDB_KEY) {
        try {
          const [a, b, c] = await Promise.allSettled([
                tmdbAPI.topRated(),
                tmdbAPI.popular(),
                tmdbAPI.upcoming(),
              ]);

              const all = [
                ...(a.status === 'fulfilled' ? a.value.data.results : []),
                ...(b.status === 'fulfilled' ? b.value.data.results : []),
                ...(c.status === 'fulfilled' ? c.value.data.results : []),
              ].filter((m, i, arr) => arr.findIndex(x => x.id === m.id) === i);
          if (all.length > 0) {
            const backd = all.filter(m => m.backdrop_path).slice(0, 5).map(m => ({
              ...m, description: m.overview, id: m.id,
            }));
            setMovies(all.map(m => ({ ...m, title: m.title || m.original_title })));
            setBackdrops(backd);
            setSource('tmdb');
            return;
          }
        } catch {}
      }

      // 3. Demo data — TMDB CDN images, no auth needed
      setMovies(DEMO_MOVIES);
      setBackdrops(DEMO_BACKDROPS.map(b => ({ ...b, description: DEMO_MOVIES.find(m => m.id === b.id)?.description })));
      setSource('demo');
    };

    load().finally(() => setLoading(false));
  }, []);

  const filtered = genre === 'All'
    ? movies
    : movies.filter(m => (m.genre || m.genres?.map(g => g.name).join(',')).toLowerCase().includes(genre.toLowerCase()));

  const half = Math.ceil(filtered.length / 2);

  if (loading) return <Loader />;

  return (
    <div style={{ background: '#0d0e1a', minHeight: '100vh' }}>
      {/* Source banner */}
      {source === 'demo' && (
        <div className="text-center py-2 text-xs font-medium animate-fade-in"
          style={{ background: 'rgba(229,25,55,0.1)', borderBottom: '1px solid rgba(229,25,55,0.2)', color: '#f87171' }}>
          ⚡ Demo mode — start your Spring Boot server at{' '}
          <code className="bg-red-900/30 px-1.5 py-0.5 rounded text-red-300">localhost:8080</code>
          {' '}or add <code className="bg-red-900/30 px-1.5 py-0.5 rounded text-red-300">REACT_APP_TMDB_KEY</code> in .env
        </div>
      )}
      {source === 'backend' && (
        <div className="text-center py-2 text-xs font-medium animate-fade-in"
          style={{ background: 'rgba(34,197,94,0.08)', borderBottom: '1px solid rgba(34,197,94,0.15)', color: '#4ade80' }}>
          
        </div>
      )}

      {/* Cinematic Hero */}
      <HeroCarousel backdrops={backdrops} />

      {/* Marquee strip */}
      <div className="overflow-hidden py-3" style={{ background: 'rgba(229,25,55,0.06)', borderTop: '1px solid rgba(229,25,55,0.1)', borderBottom: '1px solid rgba(229,25,55,0.1)' }}>
        <div className="marquee-inner select-none">
          {[...MARQUEE_LABELS, ...MARQUEE_LABELS].map((l, i) => (
            <span key={i} className="text-xs font-bold uppercase tracking-widest whitespace-nowrap" style={{ color: i % 2 === 0 ? '#e51937' : '#6b7280' }}>{l}</span>
          ))}
        </div>
      </div>

      {/* Entertainment section */}
      <EntertainmentSection />

      {/* Genre filter */}
      <div className="px-4 md:px-10 mb-8 animate-fade-up">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {GENRES.map(g => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className="shrink-0 px-5 py-2 rounded-full text-sm font-semibold transition-all"
              style={genre === g
                ? { background: '#e51937', color: '#fff', boxShadow: '0 4px 15px rgba(229,25,55,0.4)' }
                : { background: 'rgba(255,255,255,0.06)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.08)' }
              }
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Recommended */}
      <div className="px-4 md:px-10 mb-12 animate-fade-up">
        <PosterSlider
          title="Recommended Movies"
          subtitle={`${filtered.length} movies available`}
          posters={filtered.slice(0, half)}
        />
      </div>

      {/* Dark section */}
      <div className="py-14 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f0f1f 0%, #1a0a14 50%, #0f0f1f 100%)' }}>
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(229,25,55,0.08) 0%, transparent 70%)' }} />
        <div className="px-4 md:px-10 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#e51937' }}>
              <span className="text-white text-sm font-black">▶</span>
            </div>
            <div>
              <p className="text-white font-black text-sm uppercase tracking-widest">PREMIERE</p>
              <p className="text-gray-500 text-xs">Brand new releases every Friday</p>
            </div>
          </div>
          <PosterSlider
            title="Now Premiering"
            posters={filtered.slice(half)}
            config={AUTO}
          />
        </div>
      </div>

      {/* Online streaming */}
      {movies.length > 6 && (
        <div className="px-4 md:px-10 py-12 animate-fade-up">
          <PosterSlider
            title="Online Streaming"
            subtitle="Watch from the comfort of your home"
            posters={movies.slice(0, 8)}
          />
        </div>
      )}
    </div>
  );
};

export default DefaultlayoutHoc(HomePage);
