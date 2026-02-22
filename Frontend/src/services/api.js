/**
 * ============================================================
 * API SERVICE — Mapped exactly to the Spring Boot backend code
 * ============================================================
 *
 * CRITICAL BACKEND FACTS (read from actual source):
 *
 * ── AUTH ────────────────────────────────────────────────────
 * POST /api/auth/login
 *   → @RequestParam String email, @RequestParam String password
 *   → MUST be sent as URL query params, NOT as JSON body!
 *   → Returns: plain String JWT token  e.g. "eyJhbGci..."
 *
 * POST /api/auth/register
 *   → @RequestBody RegisterRequest { name, email, password, phoneNumber, roles? }
 *   → phoneNumber is @Column(nullable=false) — REQUIRED
 *   → Returns: plain String "User registered successfully"
 *
 * JWT subject = email   (from jwtUtil.generateToken(email))
 * JWT expiry  = 1 hour  (1000 * 60 * 60 ms)
 * No refresh token, no /me endpoint
 *
 * ── MOVIES (all GETs are public, no auth needed) ─────────────
 * MovieDto fields: id, title, description, language, genre, durationMins, releaseDate, posterUrl
 *
 * ── SHOWS ────────────────────────────────────────────────────
 * ShowDto: { id, startTime (ISO), endTime (ISO),
 *   movie: MovieDto,
 *   screen: { id, name, totalSeats, theater: { id, name, address, city, totalScreens } },
 *   availableSeats: [ { id, seat: { id, seatNumber, seatType, basePrice }, status, price } ]
 * }
 * endTime is AUTO-CALCULATED by backend (startTime + movie.durationMins)
 *
 * ── BOOKINGS ─────────────────────────────────────────────────
 * POST /api/bookings
 *   → @RequestBody { userId, showId, seatIds: Long[], paymentMethod }
 *   → seatIds = ShowSeat IDs (the `id` from availableSeats array), NOT Seat IDs!
 *   → Requires: USER or ADMIN role (JWT token in header)
 *
 * BookingDto: { id, bookingNumber, bookingTime, user, show, status, totalAmount, seats[], payment }
 *
 * ── USERS ────────────────────────────────────────────────────
 * GET /api/users     → List<UserDto>  (requires USER or ADMIN auth)
 * GET /api/users/{id} → UserDto { id, name, email, phoneNumber }
 * No /me endpoint — use GET /api/users then filter by email from JWT
 *
 * ── SECURITY ─────────────────────────────────────────────────
 * CORS: only http://localhost:3000 is whitelisted
 * All requests with JWT need: Authorization: Bearer <token>
 */

import axios from 'axios';

export const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

// TMDB — only used for fallback posters/backdrops when backend has no image data
export const TMDB_KEY  = process.env.REACT_APP_TMDB_KEY || '';
export const TMDB_BASE = 'https://api.themoviedb.org/3';
export const IMG_W500  = 'https://image.tmdb.org/t/p/w500';
export const IMG_ORIG  = 'https://image.tmdb.org/t/p/original';

// ─── Axios instance ──────────────────────────────────────────
const api = axios.create({ baseURL: API_BASE });

// Auto-attach JWT on every request
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('jwt_token');
  if (token) cfg.headers['Authorization'] = `Bearer ${token}`;
  return cfg;
});

// Auto-logout when JWT expires (401/403 response)
api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      const token = localStorage.getItem('jwt_token');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.exp * 1000 < Date.now()) {
            localStorage.removeItem('jwt_token');
            localStorage.removeItem('user_data');
            window.dispatchEvent(new Event('bms_session_expired'));
          }
        } catch {}
      }
    }
    return Promise.reject(err);
  }
);

// ─── AUTH ────────────────────────────────────────────────────
export const authAPI = {
  /**
   * LOGIN — @RequestParam (URL params), NOT body!
   * Returns: plain String JWT
   */
  login: (email, password) =>
    api.post(`/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`),

  /**
   * REGISTER — @RequestBody JSON
   * phoneNumber is required (nullable=false in DB)
   * Returns: plain String "User registered successfully"
   */
  register: (name, email, password, phoneNumber) =>
    api.post('/auth/register', { name, email, password, phoneNumber: phoneNumber || '0000000000' }),
};

// ─── USERS ───────────────────────────────────────────────────
export const userAPI = {
  getAll:   ()            => api.get('/users'),           // returns List<UserDto>
  getById:  (id)          => api.get(`/users/${id}`),     // returns UserDto
  update:   (id, data)    => api.put(`/users/${id}`, data),
  delete:   (id)          => api.delete(`/users/${id}`),
};

// ─── MOVIES ──────────────────────────────────────────────────
// MovieDto: { id, title, description, language, genre, durationMins, releaseDate, posterUrl }
export const movieAPI = {
  getAll:         ()          => api.get('/movies'),
  getById:        (id)        => api.get(`/movies/${id}`),
  getByLanguage:  (lang)      => api.get(`/movies/language/${lang}`),
  getByGenre:     (genre)     => api.get(`/movies/genre/${genre}`),
  search:         (title)     => api.get(`/movies/search?title=${encodeURIComponent(title)}`),
  create:         (data)      => api.post('/movies', data),      // ADMIN only
  update:         (id, data)  => api.put(`/movies/${id}`, data), // ADMIN only
  delete:         (id)        => api.delete(`/movies/${id}`),    // ADMIN only
};

// ─── SHOWS ───────────────────────────────────────────────────
export const showAPI = {
  getAll:         ()                    => api.get('/shows'),
  getById:        (id)                  => api.get(`/shows/${id}`),
  getByMovie:     (movieId)             => api.get(`/shows/movie/${movieId}`),
  getByMovieCity: (movieId, city)       => api.get(`/shows/movie/${movieId}/city/${city}`),
  getByDateRange: (start, end)          => api.get(`/shows/date?start=${start}&end=${end}`),
  create:         (data)                => api.post('/shows', data), // ADMIN only
};

// ─── THEATERS ────────────────────────────────────────────────
export const theaterAPI = {
  getAll:    ()         => api.get('/theaters'),
  getById:   (id)       => api.get(`/theaters/${id}`),
  getByCity: (city)     => api.get(`/theaters/city/${city}`),
  create:    (data)     => api.post('/theaters', data),       // ADMIN only
  update:    (id, data) => api.put(`/theaters/${id}`, data),  // ADMIN only
  delete:    (id)       => api.delete(`/theaters/${id}`),     // ADMIN only
};

// ─── BOOKINGS ─────────────────────────────────────────────────
export const bookingAPI = {
  /**
   * CREATE — body: { userId, showId, seatIds: Long[], paymentMethod }
   * seatIds = ShowSeat.id values from show.availableSeats[].id
   */
  create:      (data)          => api.post('/bookings', data),
  getById:     (id)            => api.get(`/bookings/${id}`),
  getByNumber: (bookingNumber) => api.get(`/bookings/number/${bookingNumber}`),
  getByUser:   (userId)        => api.get(`/bookings/user/${userId}`),
  cancel:      (id)            => api.put(`/bookings/cancel/${id}`),
};

// ─── TMDB fallback ───────────────────────────────────────────
const tmdb = axios.create({ baseURL: TMDB_BASE, params: { api_key: TMDB_KEY } });
export const tmdbAPI = {
  topRated:    ()   => tmdb.get('/movie/top_rated'),
  popular:     ()   => tmdb.get('/movie/popular'),
  upcoming:    ()   => tmdb.get('/movie/upcoming'),
  getById:     (id) => tmdb.get(`/movie/${id}`),
  credits:     (id) => tmdb.get(`/movie/${id}/credits`),
  similar:     (id) => tmdb.get(`/movie/${id}/similar`),
  recommended: (id) => tmdb.get(`/movie/${id}/recommendations`),
  search:      (q)  => tmdb.get(`/search/movie?query=${encodeURIComponent(q)}`),
};

export default api;