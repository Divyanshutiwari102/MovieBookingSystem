import React, { useContext, useState } from 'react';
import { MovieContext } from '../../context/MovieContext';
import { useAuth } from '../../context/AuthContext';
import PaymentModal from '../Payment/PaymentModal';
import SignInModal from '../Modal/SignInModal';
import { IMG_ORIG, IMG_W500 } from '../../services/api';

const resolveImg = (url, size = 'orig') => {
  if (!url) return null;
  if (url.startsWith('http')) return url;
  return size === 'orig' ? `${IMG_ORIG}${url}` : `${IMG_W500}${url}`;
};

// Small inline banner asking user to sign in
const SignInPrompt = ({ onSignIn, onClose }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center animate-fade-in">
    <div className="absolute inset-0 bg-black/70" style={{ backdropFilter: 'blur(6px)' }} onClick={onClose} />
    <div className="relative z-10 rounded-2xl p-8 w-full max-w-sm mx-4 text-center animate-scale-in"
      style={{ background: '#14152b', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
        style={{ background: 'linear-gradient(to right, transparent, #e51937, transparent)' }} />

      {/* Lock icon */}
      <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
        style={{ background: 'rgba(229,25,55,0.1)', border: '1px solid rgba(229,25,55,0.2)' }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="#e51937" strokeWidth="2" width="28" height="28">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>

      <h3 className="text-white font-black text-xl mb-2">Sign In Required</h3>
      <p className="text-gray-500 text-sm mb-7 leading-relaxed">
        Please sign in to your account to rent or buy movies.
      </p>

      <button onClick={onSignIn}
        className="w-full btn-red text-white py-3.5 rounded-xl font-bold text-sm mb-3">
        Sign In / Register
      </button>
      <button onClick={onClose}
        className="w-full text-gray-500 hover:text-white py-2 text-sm transition-colors">
        Maybe Later
      </button>
    </div>
  </div>
);

const MovieHero = () => {
  const { movie, isOpen, setIsOpen, price, rentMovie, buyMovie, showAuthPrompt, setShowAuthPrompt } = useContext(MovieContext);
  const { user } = useAuth();
  const [showSignIn, setShowSignIn] = useState(false);

  const title       = movie.title || '';
  const lang        = movie.language || '';
  const genre       = movie.genre || '';
  const duration    = movie.durationMins || '';
  const releaseDate = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '';
  const posterSrc   = resolveImg(movie.posterUrl, 'w500');
  const backdropSrc = resolveImg(movie.posterUrl, 'orig');

  const handleSignInClick = () => {
    setShowAuthPrompt(false);
    setShowSignIn(true);
  };

  const handleSignInClose = () => {
    setShowSignIn(false);
    // If now logged in after sign-in, open payment automatically
  };

  const Badges = () => (
    <div className="flex flex-wrap gap-2 text-xs">
      {lang     && <span className="px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.1)', color: '#d1d5db' }}>{lang}</span>}
      {genre    && <span className="px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(229,25,55,0.2)', color: '#fca5a5' }}>{genre}</span>}
      {duration && <span className="px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.1)', color: '#d1d5db' }}>{duration} min</span>}
      {releaseDate && <span className="px-2.5 py-1 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.1)', color: '#d1d5db' }}>{releaseDate}</span>}
    </div>
  );

  const ActionButtons = ({ className = '' }) => (
    <div className={`flex gap-3 ${className}`}>
      <button onClick={rentMovie}
        className="btn-red text-white px-8 py-3.5 rounded-xl font-bold text-sm">
        {user ? 'Rent' : '🔒 Rent'} &#8377; 149
      </button>
      <button onClick={buyMovie}
        className="text-white px-8 py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-white/10"
        style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
        {user ? 'Buy' : '🔒 Buy'} &#8377; 599
      </button>
    </div>
  );

  return (
    <>
      <PaymentModal isOpen={isOpen} setIsOpen={setIsOpen} price={price} movie={movie} />

      {/* Auth prompt — shown when user tries to pay without signing in */}
      {showAuthPrompt && (
        <SignInPrompt
          onSignIn={handleSignInClick}
          onClose={() => setShowAuthPrompt(false)}
        />
      )}

      {/* Sign-in modal */}
      <SignInModal isOpen={showSignIn} onClose={handleSignInClose} />

      {/* ── Mobile ───────────────────────────────────────── */}
      <div className="lg:hidden relative">
        <div className="relative overflow-hidden" style={{ height: 280 }}>
          {backdropSrc
            ? <img src={backdropSrc} alt="" className="w-full h-full object-cover" />
            : <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }} />
          }
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0d0e1a 0%, transparent 50%)' }} />
        </div>
        <div className="px-4 pt-2 pb-6" style={{ background: '#0d0e1a' }}>
          <h1 className="text-2xl font-black text-white mb-2">{title}</h1>
          <div className="mb-4"><Badges /></div>
          <ActionButtons />
        </div>
      </div>

      {/* ── Desktop ──────────────────────────────────────── */}
      <div className="hidden lg:block relative overflow-hidden" style={{ height: '28rem' }}>
        {backdropSrc
          ? <img src={backdropSrc} alt="" className="absolute inset-0 w-full h-full object-cover object-center scale-105"
              style={{ filter: 'blur(2px) brightness(0.6)' }} />
          : <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)' }} />
        }
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0.1) 100%)' }} />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0d0e1a 0%, transparent 30%)' }} />

        <div className="absolute inset-0 flex items-center z-10 px-16 py-8">
          <div className="flex items-center gap-10">
            {posterSrc && (
              <div className="shrink-0 rounded-2xl overflow-hidden shadow-2xl animate-scale-in"
                style={{ width: 165, height: 248, boxShadow: '0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.1)' }}>
                <img src={posterSrc} alt={title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="text-white animate-slide-right">
              <div className="mb-3"><Badges /></div>
              <h1 className="text-4xl lg:text-5xl font-black mb-5 leading-tight" style={{ letterSpacing: '-1px' }}>{title}</h1>
              <ActionButtons />
              {!user && (
                <p className="mt-3 text-gray-600 text-xs">
                  Sign in required to rent or buy
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MovieHero;