import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BiCalendar, BiTime, BiCameraMovie, BiHome } from 'react-icons/bi';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader/Loader';

const formatDate = (s) => s
  ? new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  : '';
const formatTime = (s) => s
  ? new Date(s).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  : '';

const getTheater = (booking) =>
  booking.show?.theater || booking.show?.screen?.theater || null;

const getSeatLabels = (booking) => {
  const seats = booking.seats || [];
  if (!seats.length) return '—';
  return seats.map((s) => s.seat?.seatNumber || s.seatNumber || s.label || s.number).join(', ');
};

const BookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingAPI.getByUser(user?.id);
        const data = Array.isArray(res.data) ? res.data : res.data?.content || [];
        data.sort((a, b) => new Date(b.bookingTime) - new Date(a.bookingTime));
        setBookings(data);
      } catch {
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchBookings();
    else setIsLoading(false);
  }, [user]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Cancel this booking? Seats will be released.')) return;
    setCancellingId(bookingId);
    try {
      await bookingAPI.cancel(bookingId);
      setBookings(prev => prev.map(b =>
        b.id === bookingId ? { ...b, status: 'CANCELLED' } : b
      ));
    } catch {
      alert('Could not cancel booking. Please try again.');
    } finally {
      setCancellingId(null);
    }
  };

  if (isLoading) return <Loader />;

  const confirmed = bookings.filter(b => b.status === 'CONFIRMED');
  const cancelled = bookings.filter(b => b.status === 'CANCELLED');
  const filtered = activeTab === 'all' ? bookings
    : activeTab === 'confirmed' ? confirmed : cancelled;

  return (
    <div className="min-h-screen bg-[#0d0e1a] py-8">
      <div className="max-w-3xl mx-auto px-4">

        {/* Page Title */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">My Bookings</h1>
            {bookings.length > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {bookings.length}
              </span>
            )}
          </div>
          <Link to="/" className="flex items-center gap-1.5 text-gray-400 hover:text-white text-sm transition-colors">
            <BiHome /> Home
          </Link>
        </div>

        {/* Tabs */}
        {bookings.length > 0 && (
          <div className="flex gap-1 mb-6 bg-white/5 rounded-xl p-1">
            {[
              { key: 'all',       label: `All (${bookings.length})` },
              { key: 'confirmed', label: `Confirmed (${confirmed.length})` },
              { key: 'cancelled', label: `Cancelled (${cancelled.length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
                  activeTab === tab.key
                    ? 'bg-red-600 text-white shadow'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Empty states */}
        {!user ? (
          <div className="text-center py-20">
            <BiCameraMovie className="text-7xl text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-400 mb-4">Please log in to view bookings</h2>
            <Link to="/" className="text-red-500 hover:underline">Go Home</Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BiCameraMovie className="text-7xl text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-400 mb-2">No bookings yet</h2>
            <p className="text-gray-500 text-sm mb-8">Book your first movie experience!</p>
            <Link
              to="/"
              className="bg-red-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors inline-flex items-center gap-2"
            >
              <BiHome /> Browse Movies
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => {
              const theater = getTheater(booking);
              const seatLabels = getSeatLabels(booking);
              const movie = booking.show?.movie;
              const screen = booking.show?.screen;
              const isConfirmed = booking.status === 'CONFIRMED';

              return (
                <div
                  key={booking.id}
                  className="bg-[#1a1a2e] rounded-2xl overflow-hidden border border-white/10 shadow-lg"
                >
                  {/* Top bar */}
                  <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded">THEATER</span>
                      <span className="text-xs text-gray-500 font-mono">
                        #{booking.bookingNumber?.slice(0, 8).toUpperCase() || booking.id}
                      </span>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      isConfirmed ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {booking.status || 'CONFIRMED'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex gap-4 p-4">
                    {movie?.posterUrl ? (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-16 h-24 object-cover rounded-lg shrink-0"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-16 h-24 bg-gray-800 rounded-lg shrink-0 flex items-center justify-center">
                        <BiCameraMovie className="text-gray-600 text-2xl" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-lg leading-tight truncate">
                        {movie?.title || 'Movie'}
                      </h3>
                      <p className="text-gray-400 text-sm mt-0.5">
                        {theater?.name || '—'} · {screen?.name || ''}
                      </p>
                      <div className="flex gap-4 mt-2 text-sm text-gray-400">
                        <span className="flex items-center gap-1">
                          <BiCalendar className="text-red-400" />
                          {formatDate(booking.show?.startTime)}
                        </span>
                        <span className="flex items-center gap-1">
                          <BiTime className="text-red-400" />
                          {formatTime(booking.show?.startTime)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-white font-bold text-xl">₹{booking.totalAmount}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between px-4 pb-4 gap-3">
                    <div>
                      <p className="text-sm text-gray-400">
                        Seats: <span className="text-white font-semibold">{seatLabels}</span>
                      </p>
                      <p className="text-xs text-gray-600 mt-0.5">
                        Booked: {formatDate(booking.bookingTime)}
                      </p>
                    </div>
                    {isConfirmed && (
                      <button
                        onClick={() => handleCancel(booking.id)}
                        disabled={cancellingId === booking.id}
                        className="shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all"
                        style={{
                          background: cancellingId === booking.id ? 'rgba(255,255,255,0.05)' : 'rgba(229,25,55,0.1)',
                          border: '1px solid rgba(229,25,55,0.3)',
                          color: cancellingId === booking.id ? '#6b7280' : '#f87171',
                        }}
                        onMouseEnter={e => { if (cancellingId !== booking.id) { e.currentTarget.style.background = 'rgba(229,25,55,0.2)'; }}}
                        onMouseLeave={e => { e.currentTarget.style.background = cancellingId === booking.id ? 'rgba(255,255,255,0.05)' : 'rgba(229,25,55,0.1)'; }}
                      >
                        {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="text-center pt-4 pb-8">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors border border-white/10 px-5 py-2.5 rounded-xl hover:border-white/30"
              >
                <BiHome /> Browse More Movies
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
