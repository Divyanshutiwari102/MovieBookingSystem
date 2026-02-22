import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { DefaultlayoutHoc } from '../layout/DefaultLayout';
import { bookingAPI, IMG_W500 } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader/Loader';

/* ── Helpers ──────────────────────────────────────────────────────────── */
const loadLocalBookings = (user) => {
  if (!user) return [];
  try {
    return JSON.parse(localStorage.getItem(`bms_bookings_${user.id || user.email}`) || '[]');
  } catch { return []; }
};

const fmtDate = dt => {
  try {
    return new Date(dt).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return dt || ''; }
};

const STATUS_STYLE = {
  CONFIRMED: { bg: 'rgba(34,197,94,0.1)',  text: '#4ade80', border: 'rgba(34,197,94,0.2)'  },
  CANCELLED: { bg: 'rgba(239,68,68,0.1)',  text: '#f87171', border: 'rgba(239,68,68,0.2)'  },
  PENDING:   { bg: 'rgba(234,179,8,0.1)',  text: '#fbbf24', border: 'rgba(234,179,8,0.2)'  },
};

const Badge = ({ label, bg, color, border }) => (
  <span className="text-xs font-bold px-2.5 py-1 rounded-full"
    style={{ background: bg, color, border: `1px solid ${border}` }}>
    {label}
  </span>
);

/* ── Streaming card ───────────────────────────────────────────────────── */
const StreamingCard = ({ b, i }) => {
  const st    = STATUS_STYLE[b.status] || STATUS_STYLE.CONFIRMED;
  const movie = b.show?.movie || {};
  const src   = movie.posterUrl
    ? (movie.posterUrl.startsWith('http') ? movie.posterUrl : `${IMG_W500}${movie.posterUrl}`)
    : null;

  return (
    <div className="rounded-2xl overflow-hidden animate-fade-up"
      style={{ background: '#14152b', border: '1px solid rgba(255,255,255,0.05)', animationDelay: `${i * 0.05}s` }}>

      <div className="px-5 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' }}>
            STREAMING
          </span>
          <span className="text-gray-600 text-xs font-mono">{b.bookingNumber}</span>
        </div>
        <Badge
          label={b.purchaseType === 'RENT' ? 'Rented · 48hr' : 'Purchased · Lifetime'}
          bg={b.purchaseType === 'RENT' ? 'rgba(59,130,246,0.1)' : 'rgba(139,92,246,0.1)'}
          color={b.purchaseType === 'RENT' ? '#93c5fd' : '#c4b5fd'}
          border={b.purchaseType === 'RENT' ? 'rgba(59,130,246,0.2)' : 'rgba(139,92,246,0.2)'}
        />
      </div>

      <div className="p-5 flex gap-4">
        {src
          ? <img src={src} alt={movie.title} className="w-14 h-20 rounded-xl object-cover shrink-0" onError={e => { e.target.style.display = 'none'; }} />
          : (
            <div className="w-14 h-20 rounded-xl shrink-0 flex items-center justify-center"
              style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="1.5" width="22" height="22">
                <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
              </svg>
            </div>
          )
        }
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-sm mb-1 truncate">{movie.title || 'Unknown'}</h3>
          <p className="text-gray-600 text-xs mb-3">
            {[movie.genre, movie.language].filter(Boolean).join(' · ')}
          </p>
          <p className="text-gray-700 text-xs">{fmtDate(b.bookingTime)}</p>
        </div>
        <div className="flex flex-col items-end justify-between shrink-0">
          <p className="text-white font-black text-xl">&#8377;{b.totalAmount}</p>
          <Badge label={b.status} bg={st.bg} color={st.text} border={st.border} />
        </div>
      </div>
    </div>
  );
};

/* ── Theater booking card ─────────────────────────────────────────────── */
const TheaterCard = ({ b, i, onCancel }) => {
  const st    = STATUS_STYLE[b.status] || STATUS_STYLE.PENDING;
  const movie = b.show?.movie || {};
  const src   = movie.posterUrl
    ? (movie.posterUrl.startsWith('http') ? movie.posterUrl : `${IMG_W500}${movie.posterUrl}`)
    : null;

  return (
    <div className="rounded-2xl overflow-hidden animate-fade-up"
      style={{ background: '#14152b', border: '1px solid rgba(255,255,255,0.05)', animationDelay: `${i * 0.05}s` }}>

      <div className="px-5 py-3 flex items-center justify-between"
        style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(229,25,55,0.12)', color: '#fca5a5', border: '1px solid rgba(229,25,55,0.2)' }}>
            THEATER
          </span>
          <span className="text-gray-600 text-xs font-mono truncate max-w-xs">{b.bookingNumber}</span>
        </div>
        <Badge label={b.status} bg={st.bg} color={st.text} border={st.border} />
      </div>

      <div className="p-5 flex gap-4">
        {src && (
          <img src={src} alt={movie.title} className="w-14 h-20 rounded-xl object-cover shrink-0"
            onError={e => { e.target.style.display = 'none'; }} />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-sm mb-1 truncate">{movie.title || 'Unknown'}</h3>
          <p className="text-gray-500 text-xs mb-0.5">
            {[b.show?.screen?.theater?.name, b.show?.screen?.name].filter(Boolean).join(' · ')}
          </p>
          <p className="text-gray-600 text-xs mb-3">{fmtDate(b.show?.startTime)}</p>
          <div className="flex flex-wrap gap-1">
            {b.seats?.slice(0, 6).map(s => (
              <span key={s.id} className="text-xs px-2 py-0.5 rounded-md font-mono"
                style={{ background: 'rgba(255,255,255,0.05)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.07)' }}>
                {s.seat?.seatNumber}
              </span>
            ))}
            {b.seats?.length > 6 && <span className="text-xs text-gray-600">+{b.seats.length - 6}</span>}
          </div>
        </div>
        <div className="flex flex-col items-end justify-between shrink-0 gap-2">
          <p className="text-white font-black text-xl">&#8377;{b.totalAmount?.toFixed(0)}</p>
          <div className="flex flex-col items-end gap-1.5">
            <p className="text-gray-700 text-xs">{fmtDate(b.bookingTime)}</p>
            {b.status === 'CONFIRMED' && (
              <button onClick={() => onCancel(b)}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                style={{ color: '#f87171', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ────────────────────────────────────────────────────────── */
const BookingsPage = () => {
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState('all');
  const [error,    setError]    = useState('');

  useEffect(() => {
    if (!user) { navigate('/'); return; }

    // Load local streaming bookings immediately (instant)
    const local = loadLocalBookings(user);
    setBookings(local);

    // Then fetch theater bookings from backend
    const fetchAPI = async () => {
      try {
        if (!user.id) throw new Error('no id');
        const res = await bookingAPI.getByUser(user.id);
        const api = res.data || [];
        // Merge: local first (newest), then API (deduplicated)
        const localNums = new Set(local.map(b => b.bookingNumber));
        setBookings([...local, ...api.filter(b => !localNums.has(b.bookingNumber))]);
      } catch {
        if (!local.length) setError('Backend offline — no theater bookings to show.');
      } finally {
        setLoading(false);
      }
    };
    fetchAPI();
  }, [user, navigate]);

  const handleCancel = async (b) => {
    if (!window.confirm('Cancel this booking?')) return;
    try {
      if (b.id && typeof b.id === 'number') await bookingAPI.cancel(b.id);
    } catch {}
    // Update localStorage for streaming bookings
    const key = `bms_bookings_${user.id || user.email}`;
    try {
      const saved = JSON.parse(localStorage.getItem(key) || '[]');
      localStorage.setItem(key, JSON.stringify(
        saved.map(x => x.bookingNumber === b.bookingNumber ? { ...x, status: 'CANCELLED' } : x)
      ));
    } catch {}
    setBookings(p => p.map(x => x.bookingNumber === b.bookingNumber ? { ...x, status: 'CANCELLED' } : x));
  };

  const streaming = bookings.filter(b => b.type === 'STREAMING');
  const theater   = bookings.filter(b => b.type !== 'STREAMING');
  const shown     = tab === 'all' ? bookings : tab === 'streaming' ? streaming : theater;

  if (loading && bookings.length === 0) return <Loader />;

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl animate-fade-up">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-1 h-8 rounded-full" style={{ background: '#e51937' }} />
        <h1 className="text-white text-2xl font-black">My Bookings</h1>
        {bookings.length > 0 && (
          <span className="text-xs font-bold px-2.5 py-1 rounded-full"
            style={{ background: 'rgba(229,25,55,0.12)', color: '#fca5a5', border: '1px solid rgba(229,25,55,0.2)' }}>
            {bookings.length}
          </span>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl px-4 py-3 mb-5 text-sm text-yellow-300 flex gap-2"
          style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)' }}>
          ⚠ {error}
        </div>
      )}

      {/* Tabs */}
      {bookings.length > 0 && (
        <div className="flex gap-1.5 p-1 rounded-xl mb-6 w-fit"
          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {[
            { key: 'all',       label: `All (${bookings.length})` },
            { key: 'theater',   label: `Theater (${theater.length})` },
            { key: 'streaming', label: `Streaming (${streaming.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className="px-4 py-2 rounded-lg text-xs font-bold transition-all"
              style={tab === t.key
                ? { background: '#e51937', color: '#fff', boxShadow: '0 2px 12px rgba(229,25,55,0.35)' }
                : { color: '#6b7280' }}>
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && shown.length === 0 && (
        <div className="text-center py-20 rounded-2xl"
          style={{ background: '#14152b', border: '1px solid rgba(255,255,255,0.04)' }}>
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center"
            style={{ background: 'rgba(229,25,55,0.08)', border: '1px solid rgba(229,25,55,0.15)' }}>
            <svg viewBox="0 0 24 24" fill="none" stroke="#e51937" strokeWidth="1.5" width="28" height="28">
              <path strokeLinecap="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 010 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a3 3 0 010-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375z"/>
            </svg>
          </div>
          <h3 className="text-white font-bold text-lg mb-2">No bookings yet</h3>
          <p className="text-gray-600 text-sm mb-6">Rent, buy, or book a theater seat to get started</p>
          <Link to="/" className="btn-red inline-block text-white px-8 py-3 rounded-xl font-bold text-sm">
            Browse Movies
          </Link>
        </div>
      )}

      {/* Cards */}
      <div className="space-y-4">
        {shown.map((b, i) =>
          b.type === 'STREAMING'
            ? <StreamingCard key={b.id || b.bookingNumber} b={b} i={i} />
            : <TheaterCard   key={b.id || b.bookingNumber} b={b} i={i} onCancel={handleCancel} />
        )}
      </div>
    </div>
  );
};

export default DefaultlayoutHoc(BookingsPage);