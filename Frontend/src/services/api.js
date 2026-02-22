

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

  login: (email, password) =>
    api.post(`/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`),


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