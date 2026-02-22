<div align="center">

# 🎬 BookMyShow Clone

### A Full-Stack Movie Booking Platform

[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.0-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)](https://spring.io/projects/spring-boot)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Java](https://img.shields.io/badge/Java-17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

<br/>

> A complete BookMyShow-inspired movie ticket booking platform with theater seat selection,
> OTT streaming purchases, JWT authentication, and a fully relational MySQL database.

<br/>

**Built by [Divyanshu Tiwari](https://github.com/divyanshu)**

</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Database Setup](#-database-setup)
- [API Reference](#-api-reference)
- [Security Architecture](#-security-architecture)
- [Known Backend Quirks](#-known-backend-quirks)
- [Deployment](#-deployment)
- [Author](#-author)

---

## Features

### User Features
- **Authentication** — Register / Login with JWT (7-day token)
- **Browse Movies** — 50+ movies with TMDB poster images
- **Smart Filters** — Filter by city, genre, language
- **Theater Booking** — Select seats from a 500-seat interactive layout
- **Seat Types** — NORMAL (Rs.150) · PREMIUM (Rs.300) · RECLINER (Rs.550)
- **OTT Streaming** — Rent (Rs.149) or Buy (Rs.499) movies
- **My Bookings** — View all theater + streaming purchases
- **Cancel Booking** — Cancel confirmed theater bookings

### System Features
- **10 Cities** — Mumbai, Delhi, Bangalore, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad, Jaipur, Lucknow
- **200 Theaters** — 20 theaters per city
- **500K+ Seats** — 500 seats per screen, auto-generated
- **Seat Timeout** — Pending seats auto-release after 15 minutes
- **Demo Fallback** — App works even if backend is offline
- **Role-Based Access** — USER and ADMIN roles

---

## Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| **React.js** | 18 | Core UI framework — component-based SPA |
| **React Router** | v6 | Client-side routing, navigation |
| **Tailwind CSS** | v3 | Utility-first styling, dark theme |
| **Axios** | latest | HTTP client with JWT interceptors |
| **Context API** | built-in | Global auth state management (useContext) |
| **useState / useEffect** | built-in | Local state and side effects |
| **useRef / useCallback** | built-in | DOM access and memoized functions |
| **React Router useNavigate** | v6 | Programmatic navigation |
| **localStorage** | Web API | JWT token and streaming bookings storage |
| **TMDB CDN** | — | Movie poster and backdrop images |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| **Spring Boot** | 3.x | REST API framework with embedded Tomcat |
| **Spring Security** | 6.x | Authentication, authorization, CORS config |
| **Spring Data JPA** | 3.x | ORM layer — repository pattern, zero SQL |
| **Hibernate** | 6.x | JPA implementation, auto DDL generation |
| **JWT (jjwt)** | 0.11.5 | Stateless token-based authentication |
| **BCrypt** | built-in | Password hashing — never stores plain text |
| **Maven** | 3.x | Dependency management and build tool |
| **Java** | 17 | Programming language |
| **Tomcat** | embedded | Web server (no separate install needed) |
| **GlobalExceptionHandler** | custom | Centralized error handling via @ControllerAdvice |
| **RestTemplate / DTO** | custom | Data Transfer Objects for clean API responses |

### Database

| Technology | Purpose |
|---|---|
| **MySQL 8.0** | Primary relational database |
| **InnoDB Engine** | ACID transactions, foreign key support |
| **Foreign Keys** | Referential integrity across all tables |
| **MySQL Event Scheduler** | Auto-release PENDING seats after 15 minutes |
| **INSERT IGNORE** | Idempotent bulk inserts — safe to re-run |
| **CROSS JOIN** | Generate shows for all movie-screen combinations |
| **NOT EXISTS subquery** | Prevent duplicate show_seats records |

---

## Project Structure

```
BookMyShow-Clone/
│
├── frontend/                           # React Application
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx            # Hero carousel + genre filters + sliders
│   │   │   ├── MoviePage.jsx           # Movie detail + city filter + showtimes
│   │   │   ├── SeatPicker.jsx          # Interactive 500-seat layout
│   │   │   ├── BookingsPage.jsx        # Theater + streaming booking history
│   │   │   └── AuthPage.jsx            # Login / Register forms
│   │   │
│   │   ├── components/
│   │   │   ├── HeroCarousel/           # Auto-rotating hero with TMDB backdrops
│   │   │   ├── PosterSlider/           # Horizontal movie slider with arrows
│   │   │   ├── Navbar/                 # City selector + auth state display
│   │   │   ├── Payment/
│   │   │   │   └── PaymentModal.jsx    # 4-step animated payment flow
│   │   │   ├── Poster/                 # Movie card with image fallback
│   │   │   └── Loader/                 # Loading spinner component
│   │   │
│   │   ├── context/
│   │   │   └── AuthContext.jsx         # Global user state + JWT management
│   │   │
│   │   ├── services/
│   │   │   ├── api.js                  # Axios instance + all API call functions
│   │   │   └── demoData.js             # 50 movies fallback (works offline)
│   │   │
│   │   ├── layout/
│   │   │   └── DefaultLayout.jsx       # HOC wrapping pages with Navbar
│   │   │
│   │   └── index.css                   # Tailwind + custom animations
│   │
│   ├── .env
│   └── package.json
│
├── backend/
│   └── src/main/java/com/cfs/MovieBookingSystem/
│       ├── controllers/
│       │   ├── AuthController.java
│       │   ├── MovieController.java
│       │   ├── ShowController.java
│       │   ├── BookingController.java
│       │   └── UserController.java
│       │
│       ├── services/
│       │   ├── MovieService.java
│       │   ├── ShowService.java
│       │   ├── BookingService.java
│       │   └── UserService.java
│       │
│       ├── repositories/               # JPA interfaces (Spring auto-implements)
│       ├── models/                     # @Entity classes mapped to DB tables
│       ├── security/
│       │   ├── JwtUtil.java
│       │   ├── JwtAuthenticationFilter.java
│       │   └── SecurityConfig.java
│       └── dto/                        # Data Transfer Objects
│
└── sql/
    ├── insert_movies.sql               # 50 movies with TMDB IDs
    ├── theaters_setup.sql              # 200 theaters + 1000 screens + 500K seats
    ├── generate_show_seats.sql         # Populate show x seat availability records
    └── after_restart.sql               # City-by-city show inserts (lock-safe)
```

---

## Getting Started

### Prerequisites

```
Node.js  >= 16
Java     >= 17
MySQL    >= 8.0
Maven    >= 3.6
```

### 1. Clone

```bash
git clone https://github.com/divyanshu/bookmyshow-clone.git
cd bookmyshow-clone
```

### 2. Backend Setup

```bash
cd backend
```

Edit `src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/movie_booking_system_db
spring.datasource.username=root
spring.datasource.password=yourpassword
spring.jpa.hibernate.ddl-auto=update
```

```bash
mvn spring-boot:run
# Backend starts at http://localhost:8080
```

### 3. Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env (see Environment Variables section)
npm start
# Frontend starts at http://localhost:3000
```

### 4. Database Seed

Run in MySQL Workbench — in this order:

```sql
-- Required before first registration
INSERT INTO roles (name) VALUES ('USER');
INSERT INTO roles (name) VALUES ('ADMIN');
```

Then run the SQL files from the `sql/` folder:

```
1. insert_movies.sql          → 50 movies
2. theaters_setup.sql         → 200 theaters, screens, seats
3. after_restart.sql          → Shows + seat availability
```

---

## Environment Variables

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_TMDB_KEY=your_free_tmdb_key
```

| Variable | Required | Description |
|---|---|---|
| `REACT_APP_API_URL` | Yes | Spring Boot base API URL |
| `REACT_APP_TMDB_KEY` | Recommended | Free from [themoviedb.org](https://www.themoviedb.org/settings/api) |

---

## Database Design

### Tables

| Table | Approx Rows | Description |
|---|---|---|
| `users` | dynamic | Registered users |
| `roles` | 2 | USER, ADMIN |
| `movies` | 50 | Movie catalog with TMDB data |
| `theaters` | 200 | 20 per city x 10 cities |
| `screens` | 1,000 | 5 screens per theater |
| `seats` | 5,00,000 | 500 seats per screen |
| `shows` | 1,500+ | 3 showtimes per movie per screen |
| `show_seats` | 7,50,000+ | Seat availability per show |
| `bookings` | dynamic | Confirmed reservations |

### Key Design Decisions

- **show_seats join table** — Each seat has an independent status per show. Seat A1 can be AVAILABLE for the 10 AM show and BOOKED for the 7 PM show simultaneously.
- **Seat timeout** — MySQL Event Scheduler reverts PENDING seats to AVAILABLE after 15 minutes to prevent abandoned holds.
- **INSERT IGNORE** — All bulk inserts are idempotent and safe to re-run without creating duplicates.
- **Normalized schema** — No data duplication; all relationships enforced via foreign keys.

---

## API Reference

### Auth

```http
POST /api/auth/register
Body: { name, email, password, phoneNumber }

POST /api/auth/login?email=x@x.com&password=secret
# Returns: plain JWT string
```

### Movies

```http
GET /api/movies
GET /api/movies/{id}
GET /api/movies/genre/{genre}
GET /api/movies/language/{lang}
```

### Shows

```http
GET /api/shows/movie/{movieId}
GET /api/shows/movie/{movieId}/city/{city}
```

### Bookings (JWT required)

```http
POST /api/bookings
Body: { userId, showId, seatIds: [showSeatId, ...], paymentMethod }

GET  /api/bookings/user/{userId}
PUT  /api/bookings/cancel/{id}
```

> **Important:** `seatIds` takes `ShowSeat.id` values (from `show.availableSeats[].id`), NOT `Seat.id`.

---

## Security Architecture

```
HTTP Request
     |
     v
JwtAuthenticationFilter
     |
     +-- Extract "Authorization: Bearer <token>"
     |
     +-- Valid token? --> Set SecurityContext --> Controller
     |
     +-- Expired/Invalid? --> 401 Unauthorized
```

- Passwords hashed with **BCrypt** (strength 10)
- JWT valid for **7 days**
- Frontend **Axios interceptor** auto-attaches token to every request
- On 401 response, frontend clears localStorage and fires logout event
- **CORS** restricted to `http://localhost:3000`

---

## Known Backend Quirks

| # | Issue | Workaround |
|---|---|---|
| 1 | Login returns plain String JWT | Parse as plain text, not JSON |
| 2 | Login uses @RequestParam | Send as URL params, not body |
| 3 | No /me endpoint | Decode JWT -> GET /api/users to find user |
| 4 | phoneNumber is required | Always include in register payload |
| 5 | Wrong credentials return 500 | Handle both 401 and 500 on login error |
| 6 | seatIds must be ShowSeat IDs | Use availableSeats[].id from show response |
| 7 | CORS only allows localhost:3000 | Update SecurityConfig for production |

---

## Deployment

### Frontend

```bash
npm run build
# Deploy build/ to Netlify or Vercel
```

### Backend

```bash
mvn clean package
java -jar target/MovieBookingSystem-0.0.1-SNAPSHOT.jar
```

### Production Checklist

- [ ] Update CORS in `SecurityConfig.java` with production domain
- [ ] Set `REACT_APP_API_URL` to production backend
- [ ] Use environment variables for DB credentials
- [ ] Enable HTTPS
- [ ] Move streaming bookings from localStorage to backend DB
- [ ] Add rate limiting on `/api/auth/**`

---

## Author

<div align="center">

**Divyanshu Tiwari**

Full Stack Developer

React.js · Spring Boot · MySQL · Java

[![GitHub](https://img.shields.io/badge/GitHub-divyanshu-181717?style=for-the-badge&logo=github)](https://github.com/divyanshu)

---

*If you found this project useful, please give it a star!*

*Made with love by Divyanshu Tiwari*

</div>
