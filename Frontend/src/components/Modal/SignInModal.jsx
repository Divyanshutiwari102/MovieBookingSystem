import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';


const GetStartedView = ({ onEmailClick, onClose }) => (
  <div
    className="w-full max-w-md rounded-2xl relative mx-4 overflow-hidden animate-scale-in"
    style={{ background: 'linear-gradient(160deg, #14152b 0%, #0d0e1a 100%)', border: '1px solid rgba(255,255,255,0.08)' }}
  >
    {}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px"
      style={{ background: 'linear-gradient(to right, transparent, #e51937, transparent)' }} />

    <button onClick={onClose}
      className="absolute right-5 top-5 text-gray-500 hover:text-white transition-colors text-lg z-10 w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">
      ✕
    </button>

    <div className="px-8 py-10">
      {}
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 mx-auto"
        style={{ background: 'linear-gradient(135deg, #e51937, #c01530)', boxShadow: '0 8px 24px rgba(229,25,55,0.4)' }}>
        <span className="text-white font-black text-xl">my</span>
      </div>

      <h2 className="text-2xl font-black text-white text-center mb-1">Welcome Back</h2>
      <p className="text-gray-500 text-sm text-center mb-10">Sign in to book tickets and more</p>

      {}
      <button onClick={onEmailClick}
        className="btn-red w-full text-white py-4 px-4 rounded-2xl text-sm font-bold tracking-wide">
        Continue with Email
      </button>

      <p className="text-center text-xs text-gray-600 mt-6">
        By continuing, you agree to our{' '}
        <span className="text-red-400 cursor-pointer hover:underline">Terms</span>
        {' '}&amp;{' '}
        <span className="text-red-400 cursor-pointer hover:underline">Privacy Policy</span>
      </p>
    </div>
  </div>
);

const EmailView = ({ onClose, onBack }) => {
  const { login, register, loading, error, setError } = useAuth();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: '', email: '', password: '', phoneNumber: '' });

  useEffect(() => { if (setError) setError(null); }, [mode, setError]);

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    const result = mode === 'login'
      ? await login(form.email, form.password)
      : await register(form.name, form.email, form.password, form.phoneNumber);
    if (result?.ok) onClose();
  };

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 14,
    padding: '14px 18px',
    fontSize: 14,
    color: '#e2e8f0',
    outline: 'none',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  };

  return (
    <div
      className="w-full max-w-md rounded-2xl relative mx-4 overflow-hidden animate-scale-in"
      style={{ background: 'linear-gradient(160deg, #14152b 0%, #0d0e1a 100%)', border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px"
        style={{ background: 'linear-gradient(to right, transparent, #e51937, transparent)' }} />

      <button onClick={onClose}
        className="absolute right-5 top-5 text-gray-500 hover:text-white transition-colors text-lg w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10">
        ✕
      </button>

      <div className="px-8 py-10">
        <button onClick={onBack} className="text-red-400 text-sm mb-6 hover:text-red-300 transition-colors flex items-center gap-1.5 font-medium">
          ← Back
        </button>

        {}
        <div className="flex gap-1 p-1 rounded-2xl mb-7" style={{ background: 'rgba(255,255,255,0.04)' }}>
          {['login', 'register'].map(m => (
            <button key={m} onClick={() => setMode(m)}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all"
              style={mode === m
                ? { background: '#e51937', color: '#fff', boxShadow: '0 4px 12px rgba(229,25,55,0.4)' }
                : { color: '#4b5563' }
              }>
              {m === 'login' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {}
        {error && (
          <div className="rounded-xl px-4 py-3 mb-5 text-sm text-red-300 animate-fade-in"
            style={{ background: 'rgba(229,25,55,0.12)', border: '1px solid rgba(229,25,55,0.25)' }}>
            {error}
          </div>
        )}

        <form onSubmit={submit} className="space-y-3">
          {mode === 'register' && (
            <>
              <input type="text" placeholder="Full Name *" required value={form.name} onChange={set('name')}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(229,25,55,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
              <input type="tel" placeholder="Phone Number" value={form.phoneNumber} onChange={set('phoneNumber')}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(229,25,55,0.6)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
              />
            </>
          )}

          <input type="email" placeholder="Email Address *" required value={form.email} onChange={set('email')}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'rgba(229,25,55,0.6)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />
          <input type="password" placeholder="Password *" required value={form.password} onChange={set('password')}
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = 'rgba(229,25,55,0.6)'}
            onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
          />

          <div className="pt-1">
            <button type="submit" disabled={loading}
              className="w-full btn-red disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2">
              {loading
                ? <><svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg> Please wait...</>
                : mode === 'login' ? 'Sign In' : 'Create Account'
              }
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-gray-600 mt-5">
          By continuing, you agree to our{' '}
          <span className="text-red-400 cursor-pointer hover:underline">Terms</span>
          {' '}&amp;{' '}
          <span className="text-red-400 cursor-pointer hover:underline">Privacy Policy</span>
        </p>
      </div>
    </div>
  );
};

const SignInModal = ({ isOpen, onClose }) => {
  const [view, setView] = useState('start');
  useEffect(() => { if (!isOpen) setView('start'); }, [isOpen]);
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/70" style={{ backdropFilter: 'blur(8px)' }} onClick={onClose} />
      <div className="relative z-10 w-full flex justify-center px-4">
        {view === 'start'
          ? <GetStartedView onEmailClick={() => setView('email')} onClose={onClose} />
          : <EmailView onClose={onClose} onBack={() => setView('start')} />
        }
      </div>
    </div>
  );
};

export default SignInModal;
