import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Use w1280 NOT original — faster load, same visual quality at screen size
const TMDB_BACK = 'https://image.tmdb.org/t/p/w1280';
const TMDB_THUMB = 'https://image.tmdb.org/t/p/w300';

// Gradient fallbacks per movie (when image fails to load)
const GRADIENTS = [
  'linear-gradient(135deg, #1a0a0a 0%, #3d0f1a 40%, #1a0510 100%)',
  'linear-gradient(135deg, #0a0a1a 0%, #0f1a3d 40%, #050a20 100%)',
  'linear-gradient(135deg, #0a1a0a 0%, #1a3d0f 40%, #051005 100%)',
  'linear-gradient(135deg, #1a1a0a 0%, #3d3d0f 40%, #201505 100%)',
  'linear-gradient(135deg, #1a0a1a 0%, #2d0f3d 40%, #150520 100%)',
];

const getBackdropSrc = (slide) => {
  if (slide.backdrop_path) return `${TMDB_BACK}${slide.backdrop_path}`;
  if (slide.posterUrl) {
    if (slide.posterUrl.startsWith('http')) return slide.posterUrl;
    return `${TMDB_BACK}${slide.posterUrl}`;
  }
  return null;
};

const getThumbSrc = (slide) => {
  if (slide.backdrop_path) return `${TMDB_THUMB}${slide.backdrop_path}`;
  if (slide.posterUrl) {
    if (slide.posterUrl.startsWith('http')) return slide.posterUrl;
    return `${TMDB_THUMB}${slide.posterUrl}`;
  }
  return null;
};

const HeroCarousel = ({ backdrops = [] }) => {
  const [current, setCurrent]   = useState(0);
  const [imgLoaded, setImgLoaded] = useState({});
  const [imgErr, setImgErr]     = useState({});
  const navigate = useNavigate();

  const slides = backdrops.length ? backdrops : [];

  // Auto-advance
  useEffect(() => {
    if (slides.length <= 1) return;
    const t = setInterval(() => {
      setCurrent(c => (c + 1) % slides.length);
    }, 5000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (!slides.length) return null;

  const goTo = (i) => setCurrent(i);

  return (
    <div className="relative overflow-hidden" style={{ height: '72vh', minHeight: 440, maxHeight: 680 }}>

      {/* Render ALL slides stacked — CSS opacity transition handles crossfade */}
      {slides.map((s, i) => {
        const src = getBackdropSrc(s);
        const loaded = imgLoaded[i];
        const failed = imgErr[i];

        return (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700"
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            {/* Gradient fallback always shown behind image */}
            <div className="absolute inset-0" style={{ background: GRADIENTS[i % GRADIENTS.length] }} />

            {/* Actual image — crossfades in when loaded */}
            {src && !failed && (
              <img
                src={src}
                alt=""
                onLoad={() => setImgLoaded(p => ({ ...p, [i]: true }))}
                onError={() => setImgErr(p => ({ ...p, [i]: true }))}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500"
                style={{ opacity: loaded ? 1 : 0 }}
              />
            )}

            {/* Gradient overlays */}
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0.1) 100%)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(13,14,26,1) 0%, transparent 40%)' }} />
          </div>
        );
      })}

      {/* Content — on top */}
      <div className="absolute inset-0 flex items-center px-8 md:px-16" style={{ zIndex: 10 }}>
        <div key={current} className="text-white max-w-xl animate-fade-up">
          <div className="text-green-400 text-xs font-bold mb-4 tracking-widest uppercase">
            ● Now Showing
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-3 leading-tight"
            style={{ textShadow: '0 4px 30px rgba(0,0,0,0.9)', letterSpacing: '-1px' }}>
            {slides[current]?.title}
          </h1>
          {slides[current]?.description && (
            <p className="text-gray-300 text-sm md:text-base mb-6 line-clamp-2 leading-relaxed">
              {slides[current].description}
            </p>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => navigate(`/movie/${slides[current]?.id}`)}
              className="btn-red text-white px-8 py-3 rounded-xl font-bold text-sm"
            >
              Book Tickets
            </button>
            <button
              onClick={() => navigate(`/movie/${slides[current]?.id}`)}
              className="text-white px-6 py-3 rounded-xl font-semibold text-sm"
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2" style={{ zIndex: 10 }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className="transition-all duration-300 rounded-full"
            style={{
              width: i === current ? 28 : 8, height: 8,
              background: i === current ? '#e51937' : 'rgba(255,255,255,0.3)',
            }}
          />
        ))}
      </div>

      {/* Thumbnail strip */}
      <div className="absolute right-5 top-1/2 -translate-y-1/2 hidden xl:flex flex-col gap-2.5" style={{ zIndex: 10 }}>
        {slides.map((sl, i) => {
          const tsrc = getThumbSrc(sl);
          const tLoaded = imgLoaded[`t${i}`];
          const tErr = imgErr[`t${i}`];
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-lg overflow-hidden transition-all duration-300 relative"
              style={{
                width: 88, height: 50, flexShrink: 0,
                border: i === current ? '2px solid #e51937' : '2px solid rgba(255,255,255,0.15)',
                opacity: i === current ? 1 : 0.55,
                background: GRADIENTS[i % GRADIENTS.length],
                boxShadow: i === current ? '0 0 16px rgba(229,25,55,0.5)' : 'none',
              }}
            >
              {tsrc && !tErr && (
                <img
                  src={tsrc}
                  alt={sl.title}
                  onLoad={() => setImgLoaded(p => ({ ...p, [`t${i}`]: true }))}
                  onError={() => setImgErr(p => ({ ...p, [`t${i}`]: true }))}
                  className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
                  style={{ opacity: tLoaded ? 1 : 0 }}
                />
              )}
              {/* Title fallback on thumbnail */}
              {(!tsrc || tErr) && (
                <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold px-1 text-center leading-tight">
                  {sl.title?.slice(0, 15)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default HeroCarousel;