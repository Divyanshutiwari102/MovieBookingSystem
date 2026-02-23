import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {  BiCalendar, BiTime, BiArrowBack, BiHome, BiCameraMovie } from 'react-icons/bi';
import { bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader/Loader';

const formatDate = (s) => s
  ? new Date(s).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  : '';
const formatTime = (s) => s
  ? new Date(s).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  : '';

// ✅ Theater from booking.show.screen.theater
const getTheater = (booking) =>
  booking.show?.theater || booking.show?.screen?.theater || null;

// ✅ Seat numbers from booking.seats[].seat.seatNumber
const getSeatLabels = (booking) => {
  const seats = booking.seats || [];
  if (!seats.length) return '—';
  return seats.map((s) => s.seat?.seatNumber || s.seatNumber || s.label || s.number).join(', ');
};

const BookingsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await bookingAPI.getByUser(user?.id);
        const data = Array.isArray(res.data) ? res.data : res.data?.content || [];
        // Sort newest first
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

  if (isLoading) return <Loader />;

  const filtered = activeTab === 'all' ? bookings : bookings.filter((b) =>
    activeTab === 'confirmed' ? b.status === 'CONFIRMED' : b.status === 'CANCELLED'
  );

  return (
    <div className="min-h-screen bg-[#0d0e1a]">
      {/* Header */}
      <div className="bg-[#1a1a2e] shadow-lg sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <BiArrowBack className="text-xl" />
            </button>
            <h1 className="text-xl font-bold text-white">My Bookings</h1>
            {bookings.length > 0 && (
              <span className="bg-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {bookings.length}
              </span>
            )}
          </div>
          {/* Home button */}
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            <BiHome className="text-lg" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        </div>

        {/* Tabs */}
        {bookings.length > 0 && (
          <div className="max-w-3xl mx-auto px-4 pb-0 flex gap-1">
            {[
              { key: 'all', label: `All (${bookings.length})` },
              { key: 'confirmed', label: `Confirmed (${bookings.filter(b => b.status === 'CONFIRMED').length})` },
              { key: 'cancelled', label: `Cancelled (${bookings.filter(b => b.status === 'CANCELLED').length})` },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 text-sm font-semibold border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-red-500 text-red-500'
                    : 'border-transparent text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {!user ? (
          <div className="text-center py-20">
            <BiTicket className="text-6xl text-gray-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-400 mb-2">Please log in to view bookings</h2>
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
                  {/* Top bar: booking number + status */}
                  <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-0.5 rounded">THEATER</span>
                      <span className="text-xs text-gray-500 font-mono">
                        #{booking.bookingNumber?.slice(0, 8).toUpperCase() || booking.id}
                      </span>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${
                      isConfirmed
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {booking.status || 'CONFIRMED'}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex gap-4 p-4">
                    {/* Poster */}
                    {movie?.posterUrl ? (
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-16 h-24 object-cover rounded-lg shrink-0"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div className="w-16 h-24 bg-gray-700 rounded-lg shrink-0 flex items-center justify-center">
                        <BiCameraMovie className="text-gray-500 text-2xl" />
                      </div>
                    )}

                    {/* Info */}
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

                    {/* Amount */}
                    <div className="text-right shrink-0">
                      <p className="text-white font-bold text-xl">₹{booking.totalAmount}</p>
                    </div>
                  </div>

                  {/* Seats + Date booked */}
                  <div className="flex items-center justify-between px-4 pb-4">
                    <p className="text-sm text-gray-400">
                      Seats: <span className="text-white font-semibold">{seatLabels}</span>
                    </p>
                    <p className="text-xs text-gray-500">
                      Booked {formatDate(booking.bookingTime)}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Browse more */}
            <div className="text-center pt-4">
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
