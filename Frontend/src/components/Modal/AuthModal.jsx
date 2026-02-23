import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, isLoading, error, setError } = useAuth();
  const [mode, setMode] = useState('login');
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  useEffect(() => {
    if (!isOpen) {
      setForm({ name: '', email: '', password: '' });
      setError(null);
      setMode('login');
      setShowPass(false);
    }
  }, [isOpen, setError]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = mode === 'login'
      ? await login(form.email, form.password)
      : await register(form.name, form.email, form.password);
    if (success) onClose();
  };

  const handle = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const inputStyle = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
  };
  const inputFocus = (e) => { e.target.style.border = '1px solid rgba(229,25,55,0.6)'; e.target.style.outline = 'none'; };
  const inputBlur  = (e) => { e.target.style.border = '1px solid rgba(255,255,255,0.08)'; };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm rounded-2xl overflow-hidden"
        style={{
          background: '#0f1021',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.9)',
        }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-white transition-colors z-10 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 text-lg"
        >
          ✕
        </button>

        {/* Header */}
        <div className="px-6 pt-8 pb-6 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'linear-gradient(135deg, #e51937, #c01530)',
              boxShadow: '0 8px 24px rgba(229,25,55,0.4)',
            }}
          >
            <span className="text-2xl">🎬</span>
          </div>
          <h2 className="text-white text-xl font-bold">
            {mode === 'login' ? 'Welcome Back!' : 'Create Account'}
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            {mode === 'login' ? 'Sign in to book your tickets' : 'Join to start booking movies'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex mx-6 mt-5 mb-4 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
          {['login', 'register'].map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setError(null); }}
              className="flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all"
              style={mode === m
                ? { background: 'linear-gradient(135deg, #e51937, #c01530)', color: '#fff', boxShadow: '0 4px 12px rgba(229,25,55,0.35)' }
                : { color: '#6b7280' }
              }
            >
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="px-6 pb-6">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl text-sm text-red-400"
              style={{ background: 'rgba(229,25,55,0.1)', border: '1px solid rgba(229,25,55,0.2)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'register' && (
              <input
                type="text"
                placeholder="Full Name *"
                required
                value={form.name}
                onChange={handle('name')}
                onFocus={inputFocus}
                onBlur={inputBlur}
                style={inputStyle}
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 transition-all"
              />
            )}

            <input
              type="email"
              placeholder="Email Address *"
              required
              value={form.email}
              onChange={handle('email')}
              onFocus={inputFocus}
              onBlur={inputBlur}
              style={inputStyle}
              className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 transition-all"
            />

            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                placeholder="Password *"
                required
                value={form.password}
                onChange={handle('password')}
                onFocus={inputFocus}
                onBlur={inputBlur}
                style={inputStyle}
                className="w-full px-4 py-3 pr-12 rounded-xl text-sm text-white placeholder-gray-600 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-sm"
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl font-bold text-white text-sm transition-all mt-1"
              style={{
                background: isLoading ? 'rgba(255,255,255,0.08)' : 'linear-gradient(135deg, #e51937, #c01530)',
                boxShadow: isLoading ? 'none' : '0 4px 16px rgba(229,25,55,0.4)',
              }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  {mode === 'login' ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-xs text-gray-600 mt-4">
            By continuing, you agree to our{' '}
            <span className="text-red-500 cursor-pointer hover:underline">Terms</span>
            {' '}&amp;{' '}
            <span className="text-red-500 cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
