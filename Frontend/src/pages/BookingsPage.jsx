import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BiCalendar, BiTime, BiArrowBack, BiMovie, BiBookmark } from 'react-icons/bi';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader/Loader';

const formatDate = (s) => s ? new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';
const formatTime = (s) => s ? new Date(s).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : '—';

// ✅ Fix: API returns show.screen.theater — extract safely
const getTheater = (show) => show?.theater || show?.screen?.theater || null;

const BookingsPage = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingAPI.getByUser(user?.id);
        setBookings(Array.isArray(res.data) ? res.data : res.data?.content || []);
      } catch {
        setBookings([]);
      } finally {
        setIsLoading(false);
      }
    };
    if (user) fetchBookings();
    else setIsLoading(false);
  }, [user]);

  if (isLoading) return <Loader />;

  const theaterBookings = bookings.filter(b => b.show);
  const filtered = activeTab === 'all' ? bookings : activeTab === 'theater' ? theaterBookings : [];

  return (
    <div className="min-h-screen bg-[#0d0e1a] py-8">
      <div className="max-w-3xl mx-auto px-4">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors">
            <BiArrowBack className="text-xl" />
          </Link>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            My Bookings
            {bookings.length > 0 && (
              <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">{bookings.length}</span>
            )}
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-700">
          {[
            { id: 'all', label: `All (${bookings.length})` },
            { id: 'theater', label: `Theater (${theaterBookings.length})` },
            { id: 'streaming', label: 'Streaming (0)' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-semibold rounded-t-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {!user ? (
          <div className="text-center py-20">
            <BiBookmark className="text-6xl text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-300 mb-2">Please log in to view bookings</h2>
            <Link to="/" className="text-red-500 hover:underline">Go Home</Link>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-[#1a1b2e] rounded-2xl border border-gray-700">
            <BiBookmark className="text-6xl text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-300 mb-2">No bookings yet</h2>
            <p className="text-gray-500 text-sm mb-6">Book your first movie experience!</p>
            <Link to="/" className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-colors">
              Browse Movies
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((booking) => {
              const theater = getTheater(booking.show);
              // ✅ Fix: seats show seatNumber from nested seat object
              const seatLabels = booking.seats?.map(s =>
                s.seat?.seatNumber || s.seatNumber || s.label || s.number
              ).join(', ') || '—';

              return (
                <div key={booking.id} className="bg-[#1a1b2e] rounded-2xl border border-gray-700 overflow-hidden hover:border-gray-500 transition-colors">
                  {/* Top bar */}
                  <div className="flex items-center justify-between px-5 py-3 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="bg-red-900/50 text-red-400 text-xs font-bold px-2 py-0.5 rounded">THEATER</span>
                      <span className="text-xs text-gray-500 font-mono">{booking.bookingNumber || booking.id}</span>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      booking.status === 'CONFIRMED' ? 'bg-green-900/50 text-green-400' :
                      booking.status === 'CANCELLED' ? 'bg-red-900/50 text-red-400' :
                      'bg-yellow-900/50 text-yellow-400'
                    }`}>
                      {booking.status || 'CONFIRMED'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex gap-4 p-5">
                    {/* Poster */}
                    {booking.show?.movie?.posterUrl ? (
                      <img
                        src={booking.show.movie.posterUrl}
                        alt={booking.show.movie.title}
                        className="w-16 h-24 object-cover rounded-lg shrink-0"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-16 h-24 bg-gray-700 rounded-lg shrink-0 flex items-center justify-center">
                        <BiMovie className="text-gray-500 text-2xl" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          {/* ✅ Fix: movie title */}
                          <h3 className="font-bold text-white text-lg leading-tight">
                            {booking.show?.movie?.title || 'Movie'}
                          </h3>
                          {/* ✅ Fix: theater from screen.theater */}
                          <p className="text-sm text-gray-400 mt-0.5">
                            {theater?.name || '—'} · {booking.show?.screen?.name || '—'}
                          </p>
                          {/* ✅ Fix: use startTime not showDate/showTime */}
                          <p className="text-sm text-gray-400">
                            {formatDate(booking.show?.startTime)}, {formatTime(booking.show?.startTime)}
                          </p>
                        </div>
                        <span className="text-white font-bold text-lg shrink-0">
                          ₹{booking.totalAmount || booking.amount || '—'}
                        </span>
                      </div>

                      {/* Seats */}
                      <div className="mt-3 pt-3 border-t border-gray-700 flex items-center justify-between">
                        <span className="text-sm text-gray-400">
                          Seats: <span className="text-gray-200 font-medium">{seatLabels}</span>
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(booking.bookingTime)}, {formatTime(booking.bookingTime)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingsPage;
