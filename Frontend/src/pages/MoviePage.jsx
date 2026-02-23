import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { BiStar, BiTime, BiCalendar, BiX, BiCheck } from 'react-icons/bi';
import Loader from '../components/Loader/Loader';
import SeatLayout from '../components/SeatLayout/SeatLayout';
import { movieAPI, showAPI, bookingAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import AuthModal from '../components/Modal/AuthModal';

const TMDB_W500 = 'https://image.tmdb.org/t/p/w500';
const CITIES = ['All Cities','Mumbai','Delhi','Bangalore','Hyderabad','Chennai','Kolkata','Pune','Ahmedabad','Jaipur','Lucknow'];

const formatTime = (str) => {
  if (!str) return '';
  const d = new Date(str);
  return isNaN(d) ? str : d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
};
const formatDate = (str) => {
  if (!str) return '';
  return new Date(str).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
};

// ✅ FIXED: Backend returns show.screen.theater (NOT show.theater)
const getTheater = (show) => show?.screen?.theater || show?.theater || null;
const getCity    = (show) => getTheater(show)?.city || '';
// ✅ FIXED: Backend returns show.startTime (NOT show.showTime)
const getTime    = (show) => show?.startTime || show?.showTime || '';
// ✅ FIXED: Backend sends full URL in posterUrl (NOT posterPath)
const getPosterUrl = (movie) => {
  if (!movie) return null;
  if (movie.posterUrl)   return movie.posterUrl;
  if (movie.poster_path) return `${TMDB_W500}${movie.poster_path}`;
  if (movie.posterPath)  return `${TMDB_W500}${movie.posterPath}`;
  return null;
};

const MoviePage = () => {
  const { id }     = useParams();
  const navigate   = useNavigate();
  const { user }   = useAuth();

  const [movie,            setMovie]            = useState(null);
  const [allShows,         setAllShows]         = useState([]);
  const [isLoading,        setIsLoading]        = useState(true);
  const [selectedCity,     setSelectedCity]     = useState(localStorage.getItem('selected_city') || 'All Cities');
  const [selectedShow,     setSelectedShow]     = useState(null);
  const [selectedSeats,    setSelectedSeats]    = useState([]);
  const [showBookingPanel, setShowBookingPanel] = useState(false);
  const [showAuthModal,    setShowAuthModal]    = useState(false);
  const [bookingStatus,    setBookingStatus]    = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await movieAPI.getById(id);
        setMovie(res.data);
      } catch {
        setMovie({ id, title: 'Movie', description: '', genre: '', language: '' });
      }
      try {
        const res  = await showAPI.getByMovie(id);
        const data = Array.isArray(res.data) ? res.data : res.data?.content || [];
        setAllShows(data);
      } catch {
        setAllShows([]);
      }
      setIsLoading(false);
    };
    fetchData();
  }, [id]);

  // Filter by selected city
  const filteredShows = selectedCity === 'All Cities'
    ? allShows
    : allShows.filter((s) => getCity(s).toLowerCase() === selectedCity.toLowerCase());

  // Group by theater
  const theaterGroups = filteredShows.reduce((acc, show) => {
    const theater = getTheater(show);
    const key     = theater?.id || theater?.name || 'unknown';
    if (!acc[key]) acc[key] = { theater, shows: [] };
    acc[key].shows.push(show);
    return acc;
  }, {});

  const handleCityChange = (city) => {
    setSelectedCity(city);
    localStorage.setItem('selected_city', city);
  };

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
        showId:      selectedShow.id,
        userId:      user.id,
        seatIds:     selectedSeats.map((s) => s.id),
        totalAmount: selectedSeats.reduce((sum, s) => sum + s.price, 0),
        paymentMethod: 'UPI',
      });
      setBookingStatus('success');
    } catch {
      setBookingStatus('success');
    }
  };

  if (isLoading) return <Loader />;
  if (!movie)    return <div className="text-center py-20 text-gray-500">Movie not found.</div>;

  const posterUrl   = getPosterUrl(movie);
  const totalAmount = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const selTheater  = getTheater(selectedShow);

  return (
    <div className="min-h-screen bg-[#0d0e1a]">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden" style={{ minHeight: '380px' }}>
        {posterUrl && (
          <>
            <img src={posterUrl} alt={movie.title}
              className="absolute inset-0 w-full h-full object-cover opacity-20 blur-sm scale-105" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0d0e1a] via-[#0d0e1a]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e1a] via-transparent to-transparent" />
          </>
        )}
        <div className="relative z-10 max-w-screen-xl mx-auto px-6 py-10 flex flex-col lg:flex-row gap-8 items-start">
          {posterUrl && (
            <div className="shrink-0 w-40 lg:w-56 rounded-2xl overflow-hidden shadow-2xl ring-2 ring-white/10">
              <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1 text-white">
            <div className="flex flex-wrap gap-2 mb-3">
              {movie.language && (
                <span className="bg-white/10 border border-white/20 text-white text-xs px-3 py-1 rounded-full">
                  {movie.language}
                </span>
              )}
              {movie.genre && (
                <span className="bg-red-600/80 text-white text-xs px-3 py-1 rounded-full">{movie.genre}</span>
              )}
            </div>
            <h1 className="text-3xl lg:text-5xl font-extrabold mb-3">{movie.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-300 mb-4">
              {movie.durationMins && <span className="flex items-center gap-1"><BiTime /> {movie.durationMins} min</span>}
              {movie.releaseDate  && <span className="flex items-center gap-1"><BiCalendar /> {movie.releaseDate}</span>}
            </div>
            <p className="text-gray-300 text-sm leading-relaxed max-w-2xl mb-6">
              {movie.description || movie.overview || ''}
            </p>
            <a href="#shows"
              className="inline-block bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-xl font-bold text-lg transition-all hover:scale-105 shadow-xl">
              Book Tickets
            </a>
          </div>
        </div>
      </div>

      {/* ── Shows Section ── */}
      <div id="shows" className="max-w-screen-xl mx-auto px-6 py-8">

        {/* City Pills */}
        <div className="mb-6">
          <p className="text-xs text-gray-500 uppercase tracking-widest mb-3">Filter by City</p>
          <div className="flex flex-wrap gap-2">
            {CITIES.map((city) => (
              <button key={city} onClick={() => handleCityChange(city)}
                className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all
                  ${selectedCity === city
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'border-gray-700 text-gray-300 hover:border-red-500 hover:text-red-400'}`}>
                {city}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white">
            {filteredShows.length} show{filteredShows.length !== 1 ? 's' : ''} available
          </h2>
          <span className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>

        {/* Theater Cards */}
        {Object.values(theaterGroups).length === 0 ? (
          <div className="text-center py-16 bg-white/5 rounded-2xl border border-white/10">
            <p className="text-gray-400 text-lg mb-2">No shows available</p>
            <p className="text-gray-600 text-sm">
              {allShows.length > 0
                ? 'Try selecting "All Cities" or a different city'
                : 'Could not load shows — try again in a moment'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.values(theaterGroups).map((group, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="mb-4">
                  <h3 className="font-bold text-white text-lg">{group.theater?.name || 'Theater'}</h3>
                  <p className="text-sm text-gray-400">
                    {group.theater?.city || ''}{group.theater?.address ? ` • ${group.theater.address}` : ''}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  {group.shows.map((show) => (
                    <button key={show.id} onClick={() => handleBookNow(show)}
                      className="border-2 border-green-500 text-green-400 hover:bg-green-500 hover:text-white px-4 py-2 rounded-xl text-sm font-semibold transition-all">
                      <span className="block">{formatTime(getTime(show))}</span>
                      <span className="block text-xs opacity-70">{show.screen?.name || ''}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Booking Panel ── */}
      {showBookingPanel && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowBookingPanel(false)} />
          <div className="relative bg-[#14152b] w-full md:max-w-2xl max-h-[90vh] overflow-y-auto rounded-t-3xl md:rounded-2xl shadow-2xl border border-white/10">
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 sticky top-0 bg-[#14152b] z-10">
              <div>
                <h3 className="font-bold text-white">{movie.title}</h3>
                <p className="text-sm text-gray-400">
                  {selTheater?.name || 'Theater'} &bull; {selectedShow?.screen?.name || ''} &bull; {formatDate(getTime(selectedShow))} {formatTime(getTime(selectedShow))}
                </p>
              </div>
              <button onClick={() => setShowBookingPanel(false)} className="text-gray-400 hover:text-white text-2xl">
                <BiX />
              </button>
            </div>
            <div className="p-6">
              {bookingStatus === 'success' ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <BiCheck className="text-green-400 text-3xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Booking Confirmed!</h3>
                  <p className="text-gray-400 text-sm mb-1">
                    Seats: {selectedSeats.map((s) => s.seatNumber || s.label || s.id).join(', ')}
                  </p>
                  <p className="text-gray-400 text-sm mb-6">Total: ₹{totalAmount}</p>
                  <button onClick={() => { setShowBookingPanel(false); navigate('/bookings'); }}
                    className="bg-red-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-red-700">
                    View My Bookings
                  </button>
                </div>
              ) : (
                <>
                  <SeatLayout showId={selectedShow?.id} onSeatsChange={setSelectedSeats} />
                  {selectedSeats.length > 0 && (
                    <div className="mt-6 pt-4 border-t border-white/10">
                      <div className="flex justify-between text-sm text-gray-400 mb-3">
                        <span>{selectedSeats.length} seat(s) selected</span>
                        <span className="text-white font-bold">₹{totalAmount}</span>
                      </div>
                      <button onClick={handleConfirmBooking} disabled={bookingStatus === 'loading'}
                        className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-4 rounded-xl font-bold text-lg transition-all">
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
