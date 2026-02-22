#Movie Booking System  — Frontend

> React 18 frontend for the Spring Boot Movie Booking System backend.

---

## Setup

```bash
git clone <repo>
cd bms-clone
npm install
cp .env.example .env
# Fill in .env values (see below)
npm start
```

Open http://localhost:3000

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_API_URL` | Yes | Spring Boot URL e.g. `http://localhost:8080/api` |
| `REACT_APP_TMDB_KEY` | Recommended | Free from https://www.themoviedb.org/settings/api |
| `REACT_APP_RAZORPAY_KEY` | For payments | From https://dashboard.razorpay.com/ |

---

## Backend API Contract (read from actual source code)

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

### MOVIES (all GETs are public)

```
GET /api/movies          → List<MovieDto>
GET /api/movies/{id}     → MovieDto
GET /api/movies/search?title={q}
GET /api/movies/language/{lang}
GET /api/movies/genre/{genre}

MovieDto: { id, title, description, language, genre, durationMins, releaseDate, posterUrl }
```

### SHOWS (all GETs are public)

```
GET /api/shows/movie/{movieId}               → List<ShowDto>
GET /api/shows/movie/{movieId}/city/{city}   → List<ShowDto>

ShowDto: {
  id, startTime, endTime,
  movie: MovieDto,
  screen: { id, name, totalSeats, theater: { id, name, address, city, totalScreens } },
  availableSeats: [ { id, seat: { id, seatNumber, seatType, basePrice }, status, price } ]
}
Note: endTime is auto-calculated by backend (startTime + movie.durationMins)
```

### BOOKINGS (requires USER or ADMIN role)

```
POST /api/bookings
  Body: { userId, showId, seatIds: [Long], paymentMethod }
  ⚠️  seatIds = ShowSeat.id values (availableSeats[].id), NOT Seat.id!
  → Returns: BookingDto

GET /api/bookings/user/{userId}  → List<BookingDto>
PUT /api/bookings/cancel/{id}    → BookingDto (sets status=CANCELLED, frees seats)
```

### USERS (requires USER or ADMIN role)

```
GET /api/users           → List<UserDto>  (used to find user after login)
GET /api/users/{id}      → UserDto { id, name, email, phoneNumber }
```

---

## Known Backend Quirks

1. **Login returns plain String** — not JSON `{ token: "..." }`, just the raw JWT string
2. **Login uses `@RequestParam`** — must be URL params (`?email=&password=`), not request body
3. **No `/me` endpoint** — after login we decode JWT for email, then GET /api/users to find user
4. **phoneNumber required** — register will fail if phoneNumber is null (DB constraint)
5. **GlobalExceptionHandler has a bug** — `Exception.class` handler parameter is typed as `ResourceNotFoundException ex`, so generic errors (like wrong credentials) return HTTP 500 instead of 401
6. **seatIds = ShowSeat.id** — booking takes ShowSeat IDs (from show.availableSeats[].id), not Seat IDs
7. **CORS whitelist** — only `http://localhost:3000` is allowed by default in SecurityConfig.java

---

## Database Setup

The `roles` table must be seeded before any user can register:

```sql
INSERT INTO roles (name) VALUES ('USER');
INSERT INTO roles (name) VALUES ('ADMIN');
```

---

## Deployment

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
