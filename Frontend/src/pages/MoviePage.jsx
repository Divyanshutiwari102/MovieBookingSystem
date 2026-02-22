import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { MovieLayoutHoc } from '../layout/DefaultLayout';
import { MovieContext } from '../context/MovieContext';
import MovieHero from '../components/MovieHero/MovieHero';
import Cast from '../components/Cast/Cast';
import PosterSlider from '../components/PosterSlider/PosterSlider';
import SeatPicker from '../components/SeatPicker/SeatPicker';
import Footer from '../components/Footer/Footer';
import Loader from '../components/Loader/Loader';
import { movieAPI, showAPI, tmdbAPI } from '../services/api';
import { DEMO_MOVIES } from '../services/demoData';

const CAST_SETTINGS = {
  arrows: true, infinite: true, slidesToShow: 5, slidesToScroll: 1,
  autoplay: true, speed: 3000, autoplaySpeed: 0, cssEase: 'linear', pauseOnHover: true,
  responsive: [{ breakpoint: 1024, settings: { slidesToShow: 3 } }, { breakpoint: 640, settings: { slidesToShow: 2 } }],
};

const ALL_CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'];

const fmtTime = dt => { try { return new Date(dt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); } catch { return dt; } };

const SectionTitle = ({ children }) => (
  <div className="flex items-center gap-3 mb-5">
    <div className="w-1 h-6 rounded-full" style={{ background: '#e51937' }} />
    <h2 className="text-white text-xl font-bold">{children}</h2>
  </div>
);

const MoviePage = ({ onSignInClick }) => {
  const { id } = useParams();
  const { setMovie, movie } = useContext(MovieContext);

  const [allShows,       setAllShows]       = useState([]);   // all shows regardless of city
  const [shows,          setShows]          = useState([]);   // filtered by city
  const [cast,           setCast]           = useState([]);
  const [similar,        setSimilar]        = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [showsLoading,   setShowsLoading]   = useState(false);
  const [selectedShow,   setSelectedShow]   = useState(null);
  const [selectedCity,   setSelectedCity]   = useState(
    localStorage.getItem('bms_city') !== 'Select City'
      ? (localStorage.getItem('bms_city') || '')
      : ''
  );

  // ── Load movie + cast + similar ──────────────────────────────
  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    const load = async () => {
      // Movie data
      try {
        const res = await movieAPI.getById(id);
        setMovie(res.data);
      } catch {
        try {
          const r = await tmdbAPI.getById(id);
          setMovie({
            id: r.data.id, title: r.data.title,
            description: r.data.overview,
            language: r.data.original_language?.toUpperCase(),
            genre: r.data.genres?.map(g => g.name).join(', '),
            durationMins: r.data.runtime,
            posterUrl: r.data.poster_path,
          });
        } catch {
          const demo = DEMO_MOVIES.find(m => String(m.id) === String(id));
          if (demo) setMovie(demo);
        }
      }
      // Cast + similar
      try {
        const [cR, sR] = await Promise.allSettled([tmdbAPI.credits(id), tmdbAPI.similar(id)]);
        if (cR.status === 'fulfilled') setCast(cR.value.data.cast?.slice(0, 20) || []);
        if (sR.status === 'fulfilled') setSimilar(sR.value.data.results?.map(m => ({ ...m, title: m.title || m.original_title })) || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, [id, setMovie]);

  // ── Load ALL shows once ───────────────────────────────────────
  useEffect(() => {
    const fetchShows = async () => {
      setShowsLoading(true);
      try {
        const r = await showAPI.getByMovie(id);
        setAllShows(r.data || []);
      } catch {
        setAllShows([]);
      } finally {
        setShowsLoading(false);
      }
    };
    fetchShows();
  }, [id]);

  // ── Filter shows by selectedCity ──────────────────────────────
  useEffect(() => {
    if (!selectedCity) {
      setShows(allShows);
      return;
    }
    // Client-side filter (instant, no extra API call)
    const filtered = allShows.filter(
      s => s.screen?.theater?.city?.toLowerCase() === selectedCity.toLowerCase()
    );

    // If nothing matches client-side and backend supports city endpoint, try API
    if (filtered.length === 0 && allShows.length > 0) {
      // All shows loaded but none for this city — show empty
      setShows([]);
    } else if (filtered.length === 0 && allShows.length === 0) {
      // Try backend city endpoint
      showAPI.getByMovieCity(id, selectedCity)
        .then(r => setShows(r.data || []))
        .catch(() => setShows([]));
    } else {
      setShows(filtered);
    }
  }, [selectedCity, allShows, id]);

  const handleCitySelect = (city) => {
    setSelectedCity(city === selectedCity ? '' : city);
    localStorage.setItem('bms_city', city === selectedCity ? 'Select City' : city);
  };

  if (loading) return <Loader />;

  // Group shows by theater name
  const showsByTheater = shows.reduce((acc, s) => {
    const t = s.screen?.theater?.name || 'Theater';
    (acc[t] = acc[t] || []).push(s);
    return acc;
  }, {});

  // All cities present in loaded shows (for smart city chips)
  const availableCities = [...new Set(allShows.map(s => s.screen?.theater?.city).filter(Boolean))];

  return (
    <div style={{ background: '#0d0e1a', minHeight: '100vh' }}>
      <MovieHero />

      {selectedShow && (
        <SeatPicker show={selectedShow} onClose={() => setSelectedShow(null)} onSignInClick={onSignInClick} />
      )}

      <div className="container px-4 lg:px-16 max-w-screen-xl mx-auto py-12">

        {/* About */}
        {movie.description && (
          <section className="mb-12 animate-fade-up">
            <SectionTitle>About the Movie</SectionTitle>
            <p className="text-gray-400 text-sm leading-7 max-w-3xl">{movie.description}</p>
          </section>
        )}

        <hr style={{ borderColor: 'rgba(255,255,255,0.05)', marginBottom: '3rem' }} />

        {/* Book Tickets */}
        <section className="mb-12 animate-fade-up">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
            <SectionTitle>Book Tickets</SectionTitle>
          </div>

          {/* ── City Filter ─────────────────────────────────── */}
          <div className="mb-6">
            <p className="text-gray-600 text-xs mb-3 font-medium uppercase tracking-wider">Filter by City</p>
            <div className="flex flex-wrap gap-2">
              {/* "All Cities" chip */}
              <button
                onClick={() => { setSelectedCity(''); localStorage.setItem('bms_city', 'Select City'); }}
                className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                style={!selectedCity
                  ? { background: '#e51937', color: '#fff', boxShadow: '0 2px 12px rgba(229,25,55,0.35)' }
                  : { background: 'rgba(255,255,255,0.04)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)' }
                }
              >
                All Cities
              </button>

              {/* Show only cities that have shows, fallback to ALL_CITIES */}
              {(availableCities.length > 0 ? availableCities : ALL_CITIES).map(city => (
                <button
                  key={city}
                  onClick={() => handleCitySelect(city)}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all"
                  style={selectedCity === city
                    ? { background: '#e51937', color: '#fff', boxShadow: '0 2px 12px rgba(229,25,55,0.35)' }
                    : { background: 'rgba(255,255,255,0.04)', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.08)' }
                  }
                >
                  {city}
                  {availableCities.includes(city) && (
                    <span className="ml-1.5 w-1.5 h-1.5 rounded-full inline-block align-middle"
                      style={{ background: '#4ade80' }} />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Shows loading */}
          {showsLoading && (
            <div className="flex items-center gap-3 py-8 text-gray-600">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
              </svg>
              <span className="text-sm">Loading showtimes...</span>
            </div>
          )}

          {/* No shows */}
          {!showsLoading && allShows.length === 0 && (
            <div className="text-center py-10 rounded-2xl"
              style={{ background: '#14152b', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-gray-600 text-sm">No shows scheduled for this movie yet.</p>
              <p className="text-gray-700 text-xs mt-1">
                Run the SQL shows INSERT or check your backend.
              </p>
            </div>
          )}

          {/* No shows for selected city */}
          {!showsLoading && allShows.length > 0 && shows.length === 0 && selectedCity && (
            <div className="text-center py-10 rounded-2xl"
              style={{ background: '#14152b', border: '1px solid rgba(255,255,255,0.05)' }}>
              <p className="text-gray-400 text-sm font-semibold mb-1">No shows in {selectedCity}</p>
              <p className="text-gray-600 text-xs">
                Try a different city or view{' '}
                <button onClick={() => setSelectedCity('')} className="text-red-400 underline">all cities</button>.
              </p>
            </div>
          )}

          {/* Theater cards */}
          {!showsLoading && Object.entries(showsByTheater).map(([theaterName, theaterShows]) => (
            <div key={theaterName} className="mb-4 rounded-2xl p-5"
              style={{ background: '#14152b', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h3 className="text-white font-bold mb-0.5 text-sm">{theaterName}</h3>
              <p className="text-gray-600 text-xs mb-4">
                {theaterShows[0]?.screen?.theater?.address}
                {theaterShows[0]?.screen?.theater?.city ? ` · ${theaterShows[0].screen.theater.city}` : ''}
              </p>
              <div className="flex flex-wrap gap-3">
                {theaterShows.map(show => (
                  <button key={show.id} onClick={() => setSelectedShow(show)}
                    className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:scale-105"
                    style={{ border: '1.5px solid rgba(34,197,94,0.4)', color: '#4ade80', background: 'rgba(34,197,94,0.08)' }}>
                    <div className="font-bold">{fmtTime(show.startTime)}</div>
                    <div className="text-xs opacity-60 mt-0.5">{show.screen?.name}</div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Offers */}
        <section className="mb-12 animate-fade-up">
          <SectionTitle>Applicable Offers</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Visa Stream Offer', desc: 'Get 50% off up to ₹150 on all RuPay cards on BookMyShow Stream.', accent: '#3b82f6' },
              { title: 'Film Pass',          desc: 'Get 50% off up to ₹150 on all RuPay cards on BookMyShow Stream.', accent: '#a855f7' },
            ].map((offer, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-2xl"
                style={{ background: '#14152b', border: `1px dashed ${offer.accent}40` }}>
                <div className="w-10 h-10 rounded-xl shrink-0 flex items-center justify-center font-bold text-white text-xs"
                  style={{ background: `${offer.accent}22`, color: offer.accent, border: `1px solid ${offer.accent}30` }}>
                  OFFER
                </div>
                <div>
                  <p className="text-white text-sm font-bold mb-1">{offer.title}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{offer.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr style={{ borderColor: 'rgba(255,255,255,0.05)', marginBottom: '3rem' }} />

        {/* Cast */}
        {cast.length > 0 && (
          <section className="mb-12 animate-fade-up">
            <SectionTitle>Cast &amp; Crew</SectionTitle>
            <Slider {...CAST_SETTINGS}>
              {cast.map(c => <Cast key={c.id} image={c.profile_path} castName={c.original_name} role={c.character} />)}
            </Slider>
          </section>
        )}

        {/* Similar */}
        {similar.length > 0 && (
          <section className="animate-fade-up">
            <PosterSlider title="Similar Movies" posters={similar} />
          </section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default MovieLayoutHoc(MoviePage);