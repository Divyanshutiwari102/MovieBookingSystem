# 🎬 Moving Booking System  — 


> Built by **Divyanshu Tiwari**

---

## 🚀 Setup

```bash
git clone <repo>
cd bms-clone
npm install
cp .env.example .env
# Fill in .env values (see below)
npm start
```

Open [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_API_URL` | Yes | Spring Boot URL e.g. `http://localhost:8080/api` |
| `REACT_APP_TMDB_KEY` | Recommended | Free from [themoviedb.org](https://www.themoviedb.org/) |

---

## 📡 Backend API Contract

### AUTH

```
POST /api/auth/login?email={email}&password={password}
  → @RequestParam (query params, NOT JSON body!)
  → Returns: plain String JWT   e.g. "eyJhbGci..."

POST /api/auth/register
  Body: { name, email, password, phoneNumber }
  → phoneNumber is required (NOT NULL in DB)
  → Returns: plain String "User registered successfully"
```

### MOVIES — all GETs are public

```
GET /api/movies                      → List<MovieDto>
GET /api/movies/{id}                 → MovieDto
GET /api/movies/search?title={q}     → List<MovieDto>
GET /api/movies/language/{lang}      → List<MovieDto>
GET /api/movies/genre/{genre}        → List<MovieDto>

MovieDto: {
  id, title, description, language, genre,
  durationMins, releaseDate, posterUrl
}
```

### SHOWS — all GETs are public

```
GET /api/shows/movie/{movieId}                 → List<ShowDto>
GET /api/shows/movie/{movieId}/city/{city}     → List<ShowDto>

ShowDto: {
  id, startTime, endTime,
  movie: MovieDto,
  screen: {
    id, name, totalSeats,
    theater: { id, name, address, city, totalScreens }
  },
  availableSeats: [
    { id, seat: { id, seatNumber, seatType, basePrice }, status, price }
  ]
}

Note: endTime is auto-calculated by backend (startTime + movie.durationMins)
```

### BOOKINGS — requires USER or ADMIN role

```
POST /api/bookings
  Body: { userId, showId, seatIds: [Long], paymentMethod }
  ⚠️  seatIds = ShowSeat.id values (availableSeats[].id), NOT Seat.id!
  → Returns: BookingDto

GET /api/bookings/user/{userId}    → List<BookingDto>
PUT /api/bookings/cancel/{id}      → BookingDto (sets status=CANCELLED, frees seats)
```

### USERS — requires USER or ADMIN role

```
GET /api/users        → List<UserDto>  (used to find user after login)
GET /api/users/{id}   → UserDto { id, name, email, phoneNumber }
```

---

## ⚠️ Known Backend Quirks

| # | Quirk | Details |
|---|---|---|
| 1 | **Login returns plain String** | Not JSON `{ token: "..." }`, just the raw JWT string |
| 2 | **Login uses `@RequestParam`** | Must be URL params (`?email=&password=`), not request body |
| 3 | **No `/me` endpoint** | After login, decode JWT for email → GET /api/users to find user |
| 4 | **phoneNumber required** | Register fails if phoneNumber is null (DB NOT NULL constraint) |
| 5 | **GlobalExceptionHandler bug** | `Exception.class` handler typed as `ResourceNotFoundException` — wrong credentials return HTTP 500 instead of 401 |
| 6 | **seatIds = ShowSeat.id** | Booking takes ShowSeat IDs from `show.availableSeats[].id`, not raw Seat IDs |
| 7 | **CORS whitelist** | Only `http://localhost:3000` allowed by default in SecurityConfig.java |

---

## 🗄️ Database Setup

The `roles` table must be seeded before any user can register:

```sql
INSERT INTO roles (name) VALUES ('USER');
INSERT INTO roles (name) VALUES ('ADMIN');
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| UI Framework | React 18 |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| HTTP Client | Axios (with JWT interceptors) |
| State Management | Context API (AuthContext) |
| Image CDN | TMDB (`https://image.tmdb.org/t/p/w500`) |

---

## 📦 Deployment

```bash
npm run build
# Deploy `build/` to Netlify, Vercel, or Spring Boot static resources
```

For production, update CORS in `SecurityConfig.java`:

```java
configuration.setAllowedOrigins(List.of(
    "http://localhost:3000",
    "https://your-production-domain.com"
));
```

---

## 👨‍💻 Author

**Divyanshu Tiwari**  
Full Stack Developer — React.js · Spring Boot · MySQL

---

> ⭐ If you found this project useful, give it a star!
