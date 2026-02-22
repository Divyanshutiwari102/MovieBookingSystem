import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

const STEPS = [
  { label: 'Verifying payment details...',     pct: 30  },
  { label: 'Connecting to payment gateway...', pct: 60  },
  { label: 'Processing transaction...',        pct: 85  },
  { label: 'Confirming booking...',            pct: 100 },
];

/* ── Save streaming booking to localStorage ─────────────────────────── */
const saveStreamingBooking = (user, movie, price) => {
  if (!user) return null;
  const booking = {
    id:            `TXN${Date.now().toString().slice(-10)}`,
    bookingNumber: `STR-${Date.now().toString().slice(-8)}`,
    bookingTime:   new Date().toISOString(),
    status:        'CONFIRMED',
    totalAmount:   price,
    type:          'STREAMING',
    purchaseType:  price <= 149 ? 'RENT' : 'BUY',
    userId:        user?.id || user?.email,
    show: {
      movie: {
        id:           movie?.id,
        title:        movie?.title      || 'Unknown Movie',
        posterUrl:    movie?.posterUrl  || '',
        genre:        movie?.genre      || '',
        language:     movie?.language   || '',
        durationMins: movie?.durationMins || 0,
      },
    },
    seats: [],
  };
  const key      = `bms_bookings_${user.id || user.email}`;
  const existing = JSON.parse(localStorage.getItem(key) || '[]');
  existing.unshift(booking);
  localStorage.setItem(key, JSON.stringify(existing));
  return booking;
};

/* ── Component ────────────────────────────────────────────────────────── */
const PaymentModal = ({ isOpen, setIsOpen, price, movie }) => {
  const { user }              = useAuth();
  const [phase,   setPhase]   = useState('idle');
  const [step,    setStep]    = useState(0);
  const [pct,     setPct]     = useState(0);
  const [booking, setBooking] = useState(null);

  if (!isOpen) return null;

  const animateStep = (i, resolve) => {
    const start = i === 0 ? 0 : STEPS[i - 1].pct;
    const end   = STEPS[i].pct;
    const inc   = (end - start) / (380 / 20);
    let   cur   = start;
    const iv = setInterval(() => {
      cur += inc;
      if (cur >= end) { cur = end; clearInterval(iv); resolve(); }
      setPct(Math.round(cur));
    }, 20);
  };

  const handlePay = async () => {
    setPhase('processing');
    setStep(0);
    setPct(0);

    for (let i = 0; i < STEPS.length; i++) {
      setStep(i);
      if (i > 0) await new Promise(res => setTimeout(res, 600));
      await new Promise(res => animateStep(i, res));
    }

    await new Promise(res => setTimeout(res, 300));

    // Save to localStorage — this makes it appear in My Bookings
    const saved = saveStreamingBooking(user, movie, price);
    setBooking(saved);
    setPhase('success');
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => { setPhase('idle'); setStep(0); setPct(0); setBooking(null); }, 400);
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/80" style={{ backdropFilter: 'blur(8px)' }}
        onClick={phase === 'processing' ? undefined : handleClose} />

      <div className="relative z-10 rounded-2xl w-full max-w-sm mx-4 overflow-hidden animate-scale-in"
        style={{ background: '#14152b', border: '1px solid rgba(255,255,255,0.08)' }}>

        {/* Top glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px"
          style={{ background: 'linear-gradient(to right, transparent, #e51937, transparent)' }} />

        {/* ── IDLE ─────────────────────────────────────────── */}
        {phase === 'idle' && (
          <div className="p-7">
            <h3 className="text-white font-black text-xl mb-1">Complete Payment</h3>
            <p className="text-gray-500 text-sm mb-6">Secure checkout</p>

            {/* Movie info strip */}
            {movie?.title && (
              <div className="flex items-center gap-3 p-3 rounded-xl mb-5"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(229,25,55,0.15)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#e51937" strokeWidth="2" width="16" height="16">
                    <path d="M15 10l4.553-2.069A1 1 0 0121 8.87v6.26a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z"/>
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-white text-xs font-semibold truncate">{movie.title}</p>
                  <p className="text-gray-600 text-xs">{price <= 149 ? 'Rent · 48hr access' : 'Buy · Lifetime access'}</p>
                </div>
              </div>
            )}

            {/* Amount */}
            <div className="text-center py-4 rounded-2xl mb-5"
              style={{ background: 'rgba(229,25,55,0.08)', border: '1px solid rgba(229,25,55,0.15)' }}>
              <p className="text-gray-500 text-xs mb-0.5">Amount to Pay</p>
              <p className="text-white font-black" style={{ fontSize: '2.5rem' }}>&#8377; {price}</p>
            </div>

            {/* Payment method chips */}
            <div className="grid grid-cols-3 gap-2 mb-5">
              {['UPI', 'Card', 'Netbanking'].map(m => (
                <div key={m} className="text-center py-2.5 rounded-xl text-xs font-semibold text-gray-400 cursor-pointer hover:text-white transition-colors"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {m}
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={handlePay} className="flex-1 btn-red text-white py-3.5 rounded-xl font-bold text-sm">
                Pay &#8377; {price}
              </button>
              <button onClick={handleClose}
                className="flex-1 text-gray-400 hover:text-white py-3.5 rounded-xl font-semibold text-sm transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* ── PROCESSING ───────────────────────────────────── */}
        {phase === 'processing' && (
          <div className="p-8 text-center">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 rounded-full" style={{ border: '3px solid rgba(229,25,55,0.15)' }} />
              <div className="absolute inset-0 rounded-full"
                style={{ border: '3px solid transparent', borderTopColor: '#e51937', animation: 'spin 0.8s linear infinite' }} />
              <div className="absolute inset-3 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(229,25,55,0.12)' }}>
                <span className="text-red-400 font-bold text-xs">{pct}%</span>
              </div>
            </div>
            <h3 className="text-white font-bold text-base mb-1">Processing Payment</h3>
            <p className="text-gray-500 text-sm mb-6 min-h-5">{STEPS[step]?.label}</p>
            <div className="h-1.5 rounded-full mb-1" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div className="h-full rounded-full transition-all duration-100"
                style={{ width: `${pct}%`, background: 'linear-gradient(to right, #c01530, #e51937)' }} />
            </div>
            <p className="text-gray-700 text-xs mt-1">Do not close this window</p>
          </div>
        )}

        {/* ── SUCCESS ──────────────────────────────────────── */}
        {phase === 'success' && (
          <div className="p-8 text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full mx-auto mb-5 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 0 40px rgba(22,163,74,0.35)' }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" width="36" height="36">
                <path strokeLinecap="round" strokeLinejoin="round" d="m5 13 4 4L19 7" />
              </svg>
            </div>

            <h3 className="text-white font-black text-xl mb-1">Payment Successful!</h3>
            <p className="text-green-400 text-sm font-semibold mb-1">&#8377; {price} paid</p>
            <p className="text-gray-500 text-xs mb-5 leading-relaxed">
              {movie?.title
                ? <><span className="text-gray-300">&ldquo;{movie.title}&rdquo;</span> added to your bookings</>
                : 'Booking confirmed!'}
            </p>

            {/* Booking detail card */}
            {booking && (
              <div className="text-left rounded-xl p-4 mb-6"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 text-xs">Booking No.</span>
                  <span className="text-gray-300 text-xs font-mono font-semibold">{booking.bookingNumber}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 text-xs">Type</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={booking.purchaseType === 'RENT'
                      ? { background: 'rgba(59,130,246,0.15)', color: '#93c5fd' }
                      : { background: 'rgba(139,92,246,0.15)', color: '#c4b5fd' }}>
                    {booking.purchaseType === 'RENT' ? 'Rent · 48hr' : 'Buy · Lifetime'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-xs">Transaction ID</span>
                  <span className="text-gray-500 text-xs font-mono">{booking.id}</span>
                </div>
              </div>
            )}

            <button onClick={handleClose} className="w-full btn-red text-white py-3.5 rounded-xl font-bold text-sm">
              Done — View in My Bookings
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;