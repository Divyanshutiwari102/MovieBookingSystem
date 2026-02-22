import React, { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';

const IMG_BASE = 'https://image.tmdb.org/t/p/w500';

/* ── Poster Card ──────────────────────────────────────────────────── */
const PosterCard = ({ id, title, original_title, posterUrl, poster_path }) => {
  const [err, setErr] = useState(false);
  const name = title || original_title || '';

  const src = (() => {
    if (err) return null;
    if (posterUrl && posterUrl.startsWith('http')) return posterUrl;
    if (posterUrl && posterUrl.startsWith('/')) return `${IMG_BASE}${posterUrl}`;
    if (poster_path) return `${IMG_BASE}${poster_path}`;
    return null;
  })();

  return (
    <Link
      to={`/movie/${id}`}
      className="group outline-none flex-shrink-0"
      style={{ width: '150px' }}
    >
      <div className="rounded-xl overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-red-900/30"
        style={{ background: '#1a1b2e', border: '1px solid rgba(255,255,255,0.07)' }}>

        <div className="relative" style={{ paddingBottom: '150%' }}>
          {src && !err ? (
            <img
              src={src}
              alt={name}
              onError={() => setErr(true)}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center"
              style={{ background: 'linear-gradient(135deg,#1e1f35,#2a1f3d)' }}>
              <div className="w-10 h-10 rounded-lg mb-2 flex items-center justify-center"
                style={{ background: 'rgba(229,25,55,0.12)', border: '1px solid rgba(229,25,55,0.25)' }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="#e51937" strokeWidth="1.5" width="20" height="20">
                  <path d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 4h16a1 1 0 011 1v14a1 1 0 01-1 1H4a1 1 0 01-1-1V5a1 1 0 011-1z"/>
                </svg>
              </div>
              <p className="text-white text-xs font-semibold line-clamp-3 leading-tight">{name}</p>
            </div>
          )}
          {/* Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end"
            style={{ background: 'linear-gradient(to top,rgba(229,25,55,0.82) 0%,transparent 55%)' }}>
            <p className="text-white text-xs font-bold px-3 pb-3">Book Now →</p>
          </div>
        </div>

        <div className="px-2.5 py-2">
          <h4 className="text-white text-xs font-semibold line-clamp-2 leading-snug">{name}</h4>
        </div>
      </div>
    </Link>
  );
};

/* ── Arrow ────────────────────────────────────────────────────────── */
const Arrow = ({ dir, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="absolute top-1/2 z-10 flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none"
    style={{
      transform: 'translateY(-60%)',
      [dir === 'left' ? 'left' : 'right']: '-18px',
      width: '36px',
      height: '36px',
      background: disabled ? 'rgba(20,21,43,0.6)' : 'rgba(229,25,55,0.85)',
      border: `1.5px solid ${disabled ? 'rgba(255,255,255,0.1)' : '#e51937'}`,
      boxShadow: disabled ? 'none' : '0 4px 20px rgba(229,25,55,0.4)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.35 : 1,
    }}
  >
    <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="15" height="15">
      <path strokeLinecap="round" strokeLinejoin="round"
        d={dir === 'left' ? 'M15 19l-7-7 7-7' : 'M9 5l7 7-7 7'} />
    </svg>
  </button>
);

/* ── Slider ───────────────────────────────────────────────────────── */
const PosterSlider = ({ title, subtitle, posters = [] }) => {
  const trackRef = useRef(null);
  const [canLeft,  setCanLeft]  = useState(false);
  const [canRight, setCanRight] = useState(true);

  const STEP = 600; // px per arrow click

  const slide = useCallback((dir) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * STEP, behavior: 'smooth' });
  }, []);

  const onScroll = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 10);
    setCanRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  if (!posters.length) return null;

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-white text-xl font-bold">{title}</h3>
          {subtitle && <p className="text-gray-500 text-xs mt-0.5">{subtitle}</p>}
        </div>
        {/* Desktop arrows in header (secondary) */}
        
      </div>

      {/* Track with side arrows */}
      <div className="relative">
        {/* Left arrow — on slider edge */}
        <Arrow dir="left"  onClick={() => slide(-1)} disabled={!canLeft} />

        {/* Scrollable track */}
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex gap-3 overflow-x-auto pb-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {posters.map((m, i) => <PosterCard key={m.id || i} {...m} />)}
        </div>

        {/* Right arrow — on slider edge */}
        <Arrow dir="right" onClick={() => slide(1)}  disabled={!canRight} />
      </div>
    </div>
  );
};

export default PosterSlider;