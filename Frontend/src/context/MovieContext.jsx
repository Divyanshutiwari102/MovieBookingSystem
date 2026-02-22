import React, { createContext, useContext, useState } from 'react';
import { useAuth } from './AuthContext';

export const MovieContext = createContext();

export const MovieProvider = ({ children }) => {
  const { user } = useAuth();
  const [movie, setMovie]           = useState({});
  const [isOpen, setIsOpen]         = useState(false);
  const [price, setPrice]           = useState(0);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  // Check sign-in before opening payment
  const openPayment = (amount) => {
    if (!user) {
      setShowAuthPrompt(true); // trigger sign-in prompt
    } else {
      setPrice(amount);
      setIsOpen(true);
    }
  };

  const rentMovie = () => openPayment(149);
  const buyMovie  = () => openPayment(599);

  return (
    <MovieContext.Provider value={{
      movie, setMovie,
      isOpen, setIsOpen,
      price,
      rentMovie, buyMovie,
      showAuthPrompt, setShowAuthPrompt,
    }}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovie = () => useContext(MovieContext);