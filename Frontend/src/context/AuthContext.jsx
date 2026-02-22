import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI, userAPI } from '../services/api';

const AuthContext = createContext();


const decodeJwt = (token) => {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  // Restore session on mount
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    const saved = localStorage.getItem('user_data');
    if (token && saved) {
      const decoded = decodeJwt(token);
      // Check token not expired
      if (decoded && decoded.exp * 1000 > Date.now()) {
        setUser(JSON.parse(saved));
      } else {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_data');
      }
    }


    const handleExpired = () => {
      setUser(null);
      alert('Your session has expired. Please sign in again.');
    };
    window.addEventListener('bms_session_expired', handleExpired);
    return () => window.removeEventListener('bms_session_expired', handleExpired);
  }, []);


  const fetchUserData = async (email) => {
    try {
      const res = await userAPI.getAll();
      const found = res.data.find(u => u.email === email);
      if (found) return found; // { id, name, email, phoneNumber }
    } catch {
    }

    return { email, name: email.split('@')[0] };
  };


  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authAPI.login(email, password);
      // Response data is a plain string JWT
      const token = typeof res.data === 'string' ? res.data.trim() : res.data?.token;
      if (!token) throw new Error('No token received');

      localStorage.setItem('jwt_token', token);

      // Get email from JWT, then fetch full user data
      const decoded = decodeJwt(token);
      const userEmail = decoded?.sub || email;
      const userData = await fetchUserData(userEmail);

      localStorage.setItem('user_data', JSON.stringify(userData));
      setUser(userData);
      return { ok: true };
    } catch (e) {

      const msg =
        e.response?.data?.message ||
        e.response?.data ||
        (e.response?.status === 401 ? 'Invalid email or password.' : 'Login failed. Please try again.');
      setError(typeof msg === 'string' ? msg : 'Login failed.');
      return { ok: false };
    } finally {
      setLoading(false);
    }
  };


  const register = async (name, email, password, phoneNumber) => {
    setLoading(true);
    setError(null);
    try {
      await authAPI.register(name, email, password, phoneNumber || '0000000000');
      // Auto login after register
      return await login(email, password);
    } catch (e) {
      const raw = e.response?.data;
      const msg =
        (typeof raw === 'string' ? raw : raw?.message) ||
        'Registration failed.';

      setError(msg.includes('Email already exists') ? 'This email is already registered.' : msg);
      return { ok: false };
    } finally {
      setLoading(false);
    }
  };

  const logout = useCallback(() => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_data');
    setUser(null);
  }, []);

  const isAdmin = user?.roles?.some(r =>
    (typeof r === 'string' ? r : r?.name) === 'ADMIN'
  ) || false;

  return (
    <AuthContext.Provider value={{ user, loading, error, setError, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);