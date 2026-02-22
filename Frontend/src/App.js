import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import MoviePage from './pages/MoviePage';
import BookingsPage from './pages/BookingsPage';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/"           element={<HomePage />} />
      <Route path="/movie/:id"  element={<MoviePage />} />
      <Route path="/bookings"   element={<BookingsPage />} />
      <Route path="/search"     element={<SearchPage />} />
      <Route path="*"           element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
