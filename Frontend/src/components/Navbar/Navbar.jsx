import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CITIES = ['Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Surat','Lucknow','Chandigarh'];

const NAV_LINKS = [
  { label: 'Movies',   to: '/' },
  { label: 'Events',   to: '/' },
  { label: 'Plays',    to: '/' },
  { label: 'Sports',   to: '/' },
  { label: 'My Bookings', to: '/bookings' },
];


const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <circle cx="11" cy="11" r="8"/><path strokeLinecap="round" d="m21 21-4.35-4.35"/>
  </svg>
);
const ChevronIcon = ({ open }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14"
    style={{ transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'rotate(0)' }}>
    <path strokeLinecap="round" d="m6 9 6 6 6-6"/>
  </svg>
);
const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#e51937" strokeWidth="2" width="14" height="14">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
  </svg>
);
const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
    <path strokeLinecap="round" d="M6 18 18 6M6 6l12 12"/>
  </svg>
);
const TicketIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path strokeLinecap="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a3 3 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"/>
  </svg>
);
const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <path strokeLinecap="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"/>
  </svg>
);

const Navbar = ({ onSignInClick }) => {
  const { user, logout } = useAuth();
  const [city, setCity]         = useState(localStorage.getItem('bms_city') || 'Select City');
  const [showCity, setShowCity] = useState(false);
  const [showUser, setShowUser] = useState(false);
  const [search, setSearch]     = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const cityRef = useRef();
  const userRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const h = e => {
      if (cityRef.current && !cityRef.current.contains(e.target)) setShowCity(false);
      if (userRef.current && !userRef.current.contains(e.target)) setShowUser(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

 
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  const selectCity = c => { setCity(c); localStorage.setItem('bms_city', c); setShowCity(false); };
  const handleSearch = e => {
    e.preventDefault();
    const q = search.trim();
    if (q) { navigate(`/search?q=${encodeURIComponent(q)}`); setSearch(''); setDrawerOpen(false); }
  };
  const firstName = user?.name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  const dropdownStyle = {
    background: '#0f1021',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
    borderRadius: 14,
  };

  return (
    <>
      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(8,9,17,0.97)' : 'rgba(10,11,24,0.93)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.06)' : '1px solid transparent',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        <div className="flex items-center gap-4 px-4 py-2.5 max-w-screen-2xl mx-auto">

          {}
          <Link to="/" className="shrink-0 group">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #e51937, #c01530)', boxShadow: '0 4px 15px rgba(229,25,55,0.4)' }}>
              <span className="text-white font-black text-sm" style={{ letterSpacing: '-0.5px' }}>my</span>
            </div>
          </Link>

          {}
          <form onSubmit={handleSearch} className="flex-1 max-w-2xl">
            <div className="flex items-center px-4 py-2.5 gap-3 rounded-xl transition-all"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="text-gray-500 shrink-0"><SearchIcon /></span>
              <input value={search} onChange={e => setSearch(e.target.value)} type="text"
                placeholder="Search for movies, events, plays, sports..."
                className="flex-1 text-sm bg-transparent border-none focus:outline-none text-gray-200 placeholder-gray-600 min-w-0"
              />
            </div>
          </form>

          <div className="flex-1 hidden lg:block" />

          {}
          <div ref={cityRef} className="relative hidden sm:block shrink-0">
            <button onClick={() => setShowCity(s => !s)}
              className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors px-2 py-1.5 rounded-lg hover:bg-white/5">
              <LocationIcon />
              <span>{city.length > 10 ? city.slice(0, 9) + '...' : city}</span>
              <ChevronIcon open={showCity} />
            </button>
            {showCity && (
              <div className="absolute right-0 top-full mt-2 w-48 py-2 z-50 overflow-hidden" style={dropdownStyle}>
                {CITIES.map(c => (
                  <button key={c} onClick={() => selectCity(c)}
                    className="w-full text-left px-4 py-2.5 text-sm transition-colors"
                    style={c === city ? { color: '#e51937', background: 'rgba(229,25,55,0.08)', fontWeight: 600 } : { color: '#9ca3af' }}
                    onMouseEnter={e => { if (c !== city) { e.currentTarget.style.color = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}}
                    onMouseLeave={e => { if (c !== city) { e.currentTarget.style.color = '#9ca3af'; e.currentTarget.style.background = 'transparent'; }}}>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {}
          <div className="hidden sm:block">
            {user ? (
              <div ref={userRef} className="relative">
                <button onClick={() => setShowUser(s => !s)}
                  className="btn-red text-white px-4 py-2 rounded-xl font-semibold text-sm">
                  Hi, {firstName}
                </button>
                {showUser && (
                  <div className="absolute right-0 top-full mt-2 w-44 py-2 z-50 overflow-hidden animate-scale-in" style={dropdownStyle}>
                    <Link to="/bookings" onClick={() => setShowUser(false)}
                      className="flex items-center gap-2.5 px-4 py-3 text-sm text-gray-300 transition-colors"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <TicketIcon /> My Bookings
                    </Link>
                    <button onClick={() => { logout(); setShowUser(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-gray-500 hover:text-red-400 transition-colors"
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <LogoutIcon /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={onSignInClick}
                className="btn-red text-white px-5 py-2 rounded-xl font-semibold text-sm">
                Sign In
              </button>
            )}
          </div>

          {}
          <button
            onClick={() => setDrawerOpen(true)}
            className="flex flex-col justify-center items-center gap-1.5 p-2 rounded-lg transition-colors hover:bg-white/5"
            aria-label="Open menu"
          >
            <span className="block rounded-full transition-all" style={{ width: 22, height: 2, background: '#9ca3af' }} />
            <span className="block rounded-full transition-all" style={{ width: 16, height: 2, background: '#9ca3af' }} />
            <span className="block rounded-full transition-all" style={{ width: 22, height: 2, background: '#9ca3af' }} />
          </button>
        </div>
      </nav>

      {}
      {}
      <div
        onClick={() => setDrawerOpen(false)}
        className="fixed inset-0 z-[90] transition-all duration-300"
        style={{
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
        }}
      />

      {}
      <div
        className="fixed top-0 right-0 h-full z-[100] flex flex-col"
        style={{
          width: 300,
          background: '#0f1021',
          borderLeft: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '-20px 0 60px rgba(0,0,0,0.6)',
          transform: drawerOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        {}
        <div className="flex items-center justify-between px-5 py-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #e51937, #c01530)' }}>
              <span className="text-white font-black text-xs">my</span>
            </div>
            <span className="text-white font-bold text-sm">Menu</span>
          </div>
          <button onClick={() => setDrawerOpen(false)}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5">
            <CloseIcon />
          </button>
        </div>

        {}
        {user && (
          <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(229,25,55,0.05)' }}>
            <p className="text-gray-500 text-xs mb-0.5">Signed in as</p>
            <p className="text-white font-bold text-sm">{user.name || user.email}</p>
            <p className="text-gray-600 text-xs">{user.email}</p>
          </div>
        )}

        {}
        <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <p className="text-gray-600 text-xs uppercase tracking-wider mb-2 font-semibold">Your City</p>
          <div className="grid grid-cols-2 gap-1.5">
            {CITIES.slice(0, 8).map(c => (
              <button key={c} onClick={() => selectCity(c)}
                className="px-3 py-2 rounded-lg text-xs font-medium transition-all text-left"
                style={c === city
                  ? { background: 'rgba(229,25,55,0.15)', color: '#e51937', border: '1px solid rgba(229,25,55,0.3)' }
                  : { background: 'rgba(255,255,255,0.04)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.05)' }
                }>
                {c}
              </button>
            ))}
          </div>
        </div>

      
        <nav className="flex-1 px-3 py-3 overflow-y-auto">
          <p className="text-gray-600 text-xs uppercase tracking-wider mb-2 px-2 font-semibold">Explore</p>
          {NAV_LINKS.map(({ label, to }) => (
            <Link key={label} to={to}
              onClick={() => setDrawerOpen(false)}
              className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all mb-0.5"
              style={{ color: '#9ca3af' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = '#fff'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9ca3af'; }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#e51937' }} />
              {label}
            </Link>
          ))}
        </nav>

        
        <div className="px-5 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          {user ? (
            <button onClick={() => { logout(); setDrawerOpen(false); }}
              className="w-full py-3 rounded-xl text-sm font-bold transition-all text-red-400"
              style={{ background: 'rgba(229,25,55,0.08)', border: '1px solid rgba(229,25,55,0.2)' }}>
              Sign Out
            </button>
          ) : (
            <button onClick={() => { onSignInClick(); setDrawerOpen(false); }}
              className="w-full btn-red text-white py-3 rounded-xl text-sm font-bold">
              Sign In
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
