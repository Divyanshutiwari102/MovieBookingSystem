import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BiTime, BiCalendar, BiX, BiCheck } from 'react-icons/bi';
import Loader from '../components/Loader/Loader';
import SeatLayout from '../components/Seatlayout/Seatlayout';
import { movieAPI, showAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/Modal/AuthModal';

const TMDB_ORIG = 'https://image.tmdb.org/t/p/original';

const formatTime = (str) => {
  if (!str) return '';
  const d = new Date(str);
  return isNaN(d) ? str : d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (str) => {
  if (!str) return '';
  return new Date(str).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
};

// ✅ Helper: API returns show.screen.theater — extract it safely
const getTheater = (show) =>
  show.theater || show.screen?.theater || null;

const mockShows = (movieId) => [
  { id: 1, movieId, theater: { id: 1, name: 'PVR Cinemas', city: 'Delhi' }, startTime: new Date(Date.now() + 3600000).toISOString(), screen: { name: 'Screen 1' } },
  { id: 2, movieId, theater: { id: 2, name: 'INOX Multiplex', city: 'Delhi' }, startTime: new Date(Date.now() + 7200000).toISOString(), screen: { name: 'Screen 2' } },
];

const MoviePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedShow, setSelectedShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [showBookingPanel, setShowBookingPanel] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null);
  const [selectedCity, setSelectedCity] = useState(localStorage.getItem('selected_city') || 'All Cities');

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const movieRes = await movieAPI.getById(id);
        setMovie(movieRes.data);
      } catch {
        setMovie({ id, title: 'Movie', overview: '', posterUrl: null });
      }

      try {
        const showsRes = await showAPI.getByMovie(id);
        const data = Array.isArray(showsRes.data) ? showsRes.data : showsRes.data?.content || [];
        setShows(data.length ? data : mockShows(id));
      } catch {
        setShows(mockShows(id));
      }

      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  const handleBookNow = (show) => {
    if (!user) { setShowAuthModal(true); return; }
    setSelectedShow(show);
    setSelectedSeats([]);
    setShowBookingPanel(true);
    setBookingStatus(null);
  };

  const handleConfirmBooking = async () => {
    if (!selectedSeats.length) return;
    setBookingStatus('loading');
    try {
      await bookingAPI.create({
        showId: selectedShow.id,
        userId: user.id,
        seatIds: selectedSeats.map((s) => s.id),
        paymentMethod: 'CARD',
      });
      setBookingStatus('success');
    } catch (err) {
      console.error('Booking failed:', err?.response?.data || err.message);
      setBookingStatus('error');
    }
  };

  if (isLoading) return <Loader />;
  if (!movie) return <div className="text-center py-20 text-gray-500">Movie not found.</div>;

  const posterUrl = movie.posterUrl || movie.posterPath || movie.poster_path
    ? (movie.posterUrl || `${TMDB_ORIG}${movie.posterPath || movie.poster_path}`)
    : null;
  const backdropUrl = movie.backdropPath || movie.backdrop_path
    ? `${TMDB_ORIG}${movie.backdropPath || movie.backdrop_path}`
    : posterUrl;

  const genres = movie.genres?.map((g) => g.name || g).join(', ') || movie.genre || '';
  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  // ✅ Fixed: use getTheater() helper — handles both show.theater and show.screen.theater
  const allCities = [...new Set(shows.map((s) => getTheater(s)?.city).filter(Boolean))];

  const filteredShows = selectedCity === 'All Cities'
    ? shows
    : shows.filter((s) => getTheater(s)?.city === selectedCity);

  const theaterGroups = filteredShows.reduce((acc, show) => {
    const theater = getTheater(show);
    const key = theater?.id || theater?.name || 'Other';
    if (!acc[key]) acc[key] = { theater, shows: [] };
    acc[key].shows.push(show);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="relative bg-[#1a1a2e] overflow-hidden" style={{ minHeight: '420px' }}>
        {backdropUrl && (
          <>
            <img src={backdropUrl} alt={movie.title} className="absolute inset-0 w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#1a1a2e] via-[#1a1a2e]/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a2e] via-transparent to-transparent" />
          </>
        )}
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8 items-start">
          {posterUrl && (
            <div className="shrink-0 w-48 lg:w-64 rounded-2xl overflow-hidden shadow-2xl">
              <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 text-white">
            <h1 className="text-3xl lg:text-5xl font-extrabold mb-3">{movie.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-4">
              {genres && <span className="text-gray-300">{genres}</span>}
              {movie.durationMins && <span className="flex items-center gap-1"><BiTime /> {movie.durationMins} min</span>}
              {movie.language && <span className="bg-gray-700 px-2 py-0.5 rounded text-xs">{movie.language}</span>}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-2xl mb-6">
              {movie.description || movie.overview || ''}
            </p>
            <a href="#shows" className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-xl">
              Book Tickets
            </a>
          </div>
        </div>
      </div>

      {/* Shows Section */}
      <div id="shows" className="max-w-screen-xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Book Tickets</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <BiCalendar />
            <span>{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
        </div>

        {/* City Filter */}
        {allCities.length > 0 && (
          <div className="mb-6">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Filter by City</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCity('All Cities')}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                  selectedCity === 'All Cities'
                    ? 'bg-red-600 text-white border-red-600'
                    : 'border-gray-300 text-gray-600 hover:border-red-400'
                }`}
              >
                All Cities
              </button>
              {allCities.map((city) => (
                <button
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    selectedCity === city
                      ? 'bg-red-600 text-white border-red-600'
                      : 'border-gray-300 text-gray-600 hover:border-red-400'
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Theater + Shows */}
        {Object.values(theaterGroups).length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <p className="text-gray-500 text-lg font-medium">No shows available for this movie.</p>
            <p className="text-gray-400 text-sm mt-1">Try selecting a different city.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.values(theaterGroups).map((group, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="mb-4">
                  <h3 className="font-bold text-gray-800 text-lg">{group.theater?.name || 'Theater'}</h3>
                  <p className="text-sm text-gray-500">{group.theater?.city || group.theater?.address || ''}</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {group.shows.map((show) => (
                    <button
                      key={show.id}
                      onClick={() => handleBookNow(show)}
                      className="border-2 border-green-500 text-green-700 hover:bg-green-500 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all group"
                    >
                      <span className="block">{formatTime(show.startTime || show.showTime)}</span>
                      <span className="text-xs text-gray-400 group-hover:text-green-100">
                        {show.screen?.name || 'Screen'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Panel */}
      {showBookingPanel && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowBookingPanel(false)} />
          <div className="relative bg-white w-full md:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-2xl shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b sticky top-0 bg-white z-10">
              <div>
                <h3 className="font-bold text-gray-800">{movie.title}</h3>
                <p className="text-sm text-gray-500">
                  {getTheater(selectedShow)?.name} • {formatDate(selectedShow?.startTime)} • {formatTime(selectedShow?.startTime)}
                </p>
              </div>
              <button onClick={() => setShowBookingPanel(false)} className="text-gray-400 hover:text-gray-700 text-2xl">
                <BiX />
              </button>
            </div>

            <div className="p-6">
              {bookingStatus === 'error' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BiX className="text-red-600 text-3xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Booking Failed</h3>
                  <p className="text-gray-500 text-sm mb-6">Seats may already be booked. Please select different seats.</p>
                  <button
                    onClick={() => setBookingStatus(null)}
                    className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700"
                  >
                    Try Again
                  </button>
                </div>
              ) : bookingStatus === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BiCheck className="text-green-600 text-3xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Booking Confirmed!</h3>
                  <p className="text-gray-500 text-sm mb-1">Seats: {selectedSeats.map((s) => s.label || s.seatNumber).join(', ')}</p>
                  <p className="text-gray-500 text-sm mb-6">Total paid: ₹{totalAmount}</p>
                  <button
                    onClick={() => { setShowBookingPanel(false); navigate('/bookings'); }}
                    className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700 transition-colors"
                  >
                    View My Bookings
                  </button>
                </div>
              ) : (
                <>
                  <SeatLayout showId={selectedShow?.id} onSeatsChange={setSelectedSeats} />
                  {selectedSeats.length > 0 && (
                    <div className="mt-6 pt-4 border-t">
                      <button
                        onClick={handleConfirmBooking}
                        disabled={bookingStatus === 'loading'}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white py-4 rounded-xl font-bold text-lg transition-all"
                      >
                        {bookingStatus === 'loading' ? 'Confirming...' : `Pay ₹${totalAmount} & Confirm`}
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default MoviePage;
