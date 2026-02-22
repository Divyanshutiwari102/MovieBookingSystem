import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { bookingAPI } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const TYPE_STYLES = {
  RECLINER:  { idle: 'rgba(139,92,246,0.15)', idleBorder: 'rgba(139,92,246,0.4)', sel: '#8b5cf6', label: 'Recliner',   labelColor: '#a78bfa' },
  PREMIUM:   { idle: 'rgba(245,158,11,0.15)',  idleBorder: 'rgba(245,158,11,0.4)',  sel: '#f59e0b', label: 'Premium',    labelColor: '#fcd34d' },
  EXECUTIVE: { idle: 'rgba(59,130,246,0.15)',  idleBorder: 'rgba(59,130,246,0.4)',  sel: '#3b82f6', label: 'Executive',  labelColor: '#93c5fd' },
  NORMAL:    { idle: 'rgba(107,114,128,0.15)', idleBorder: 'rgba(107,114,128,0.3)', sel: '#6b7280', label: 'Normal',     labelColor: '#9ca3af' },
};

const getStyle = (t = '') => TYPE_STYLES[t.toUpperCase()] || TYPE_STYLES.NORMAL;

const SeatPicker = ({ show, onClose, onSignInClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selected, setSelected] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [err,      setErr]      = useState('');

  const seats = show?.availableSeats || [];
  const grouped = seats.reduce((acc, s) => {
    const t = s.seat?.seatType?.toUpperCase() || 'NORMAL';
    (acc[t] = acc[t] || []).push(s);
    return acc;
  }, {});

  const toggle = seat => setSelected(p => p.find(s => s.id === seat.id) ? p.filter(s => s.id !== seat.id) : [...p, seat]);
  const total  = selected.reduce((s, x) => s + (x.price || 0), 0);

  const handleBook = async () => {
    if (!user) { onSignInClick?.(); return; }
    if (!selected.length) return;
    if (!user.id) { setErr('User ID not found. Please logout and sign in again.'); return; }
    setLoading(true); setErr('');
    try {
      const res = await bookingAPI.create({ userId: user.id, showId: show.id, seatIds: selected.map(s => s.id), paymentMethod: 'ONLINE' });
      alert(`Booking Confirmed!\nBooking #: ${res.data.bookingNumber}`);
      onClose?.();
      navigate('/bookings');
    } catch (e) {
      setErr(e.response?.data?.message || e.response?.data?.error || 'Booking failed. Seats may have been taken.');
    } finally { setLoading(false); }
  };

  const fmtTime = dt => { try { return new Date(dt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }); } catch { return dt; } };
  const fmtDate = dt => { try { return new Date(dt).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }); } catch { return ''; } };

  return (
    <div className="fixed inset-0 z-[150] flex items-end sm:items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/80" style={{ backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div
        className="relative z-10 w-full max-w-3xl rounded-t-3xl sm:rounded-3xl max-h-[92vh] overflow-y-auto animate-scale-in"
        style={{ background: '#12131f', border: '1px solid rgba(255,255,255,0.07)' }}
      >
        
        <div className="sticky top-0 px-6 py-4 flex items-center justify-between z-10"
          style={{ background: 'rgba(18,19,31,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            <h3 className="text-white font-bold text-base">{show?.movie?.title}</h3>
            <p className="text-gray-500 text-xs mt-0.5">
              {show?.screen?.theater?.name} · {show?.screen?.name} · {fmtDate(show?.startTime)} {fmtTime(show?.startTime)}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">✕</button>
        </div>

        <div className="px-6 py-6">
          
          <div className="text-center mb-10">
            <div className="h-0.5 rounded-full mb-3 mx-auto" style={{ width: '70%', background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.3), transparent)' }} />
            <p className="text-gray-600 text-xs uppercase tracking-widest">SCREEN THIS WAY</p>
          </div>

          
          <div className="flex flex-wrap gap-3 justify-center mb-8 text-xs">
            {Object.entries(TYPE_STYLES).map(([k, v]) => (
              <div key={k} className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md" style={{ background: v.idle, border: `1px solid ${v.idleBorder}` }} />
                <span style={{ color: v.labelColor }}>{v.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md" style={{ background: 'rgba(229,25,55,0.3)', border: '1px solid rgba(229,25,55,0.6)' }} />
              <span className="text-red-400">Selected</span>
            </div>
          </div>

          
          {Object.entries(grouped).map(([type, typeSeats]) => {
            const ts = getStyle(type);
            return (
              <div key={type} className="mb-7">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold" style={{ color: ts.labelColor }}>{ts.label} — ₹{typeSeats[0]?.price}</span>
                  <span className="text-gray-600 text-xs">{typeSeats.length} available</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {typeSeats.map(seat => {
                    const isSel = !!selected.find(s => s.id === seat.id);
                    return (
                      <button key={seat.id} onClick={() => toggle(seat)}
                        className="w-10 h-9 text-xs font-bold rounded-lg transition-all duration-200"
                        style={isSel
                          ? { background: '#e51937', border: '1px solid #ff2244', color: '#fff', transform: 'scale(1.12)', boxShadow: '0 4px 12px rgba(229,25,55,0.5)' }
                          : { background: ts.idle, border: `1px solid ${ts.idleBorder}`, color: ts.labelColor }
                        }
                        title={`${seat.seat?.seatNumber} · ₹${seat.price}`}
                      >
                        {seat.seat?.seatNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {seats.length === 0 && (
            <div className="text-center py-14">
              <div className="text-5xl mb-3 animate-float">★</div>
              <p className="text-gray-500">No available seats for this show.</p>
            </div>
          )}

          {err && (
            <div className="rounded-xl px-4 py-3 mb-4 text-sm text-red-300"
              style={{ background: 'rgba(229,25,55,0.1)', border: '1px solid rgba(229,25,55,0.2)' }}>
              {err}
            </div>
          )}

         
          <div className="flex items-center justify-between pt-5 mt-4"
            style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              <p className="text-gray-500 text-sm">{selected.length} seat{selected.length !== 1 ? 's' : ''} selected</p>
              <p className="text-white font-black text-2xl">₹ {total.toFixed(0)}</p>
            </div>
            <button onClick={handleBook} disabled={!selected.length || loading}
              className="btn-red disabled:opacity-40 disabled:cursor-not-allowed text-white px-10 py-3.5 rounded-xl font-bold text-sm flex items-center gap-2">
              {loading
                ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/></svg> Booking...</>
                : user ? 'Confirm Booking' : 'Sign In to Book'
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatPicker;
