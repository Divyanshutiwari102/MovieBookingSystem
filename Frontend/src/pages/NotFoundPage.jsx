import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const ref = useRef();
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    c.width = window.innerWidth; c.height = window.innerHeight;
    const stars = Array.from({ length: 120 }, () => ({ x: Math.random() * c.width, y: Math.random() * c.height, r: Math.random() * 2 + 0.3, o: Math.random() * 0.8 + 0.2 }));
    ctx.clearRect(0, 0, c.width, c.height);
    stars.forEach(s => { ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 2 * Math.PI); ctx.fillStyle = `rgba(255,255,255,${s.o})`; ctx.fill(); });
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #1a1040 0%, #0d0818 55%, #060410 100%)' }}>
      <canvas ref={ref} className="absolute inset-0 pointer-events-none" />
      <div className="absolute top-16 left-16 w-24 h-24 rounded-full opacity-50 animate-float"
        style={{ background: 'radial-gradient(circle at 35%, #7c3aed, #4c1d95)', boxShadow: '0 0 40px rgba(124,58,237,0.3)' }} />
      <div className="absolute bottom-24 right-16 w-32 h-32 rounded-full opacity-40 animate-float" style={{ animationDelay: '2s', background: 'radial-gradient(circle at 40% 30%, #d97706, #92400e)' }} />
      <div className="absolute top-1/3 right-1/4 w-10 h-10 rounded-full opacity-30" style={{ background: '#06b6d4' }} />

      <div className="relative z-10 text-center px-4 animate-fade-up">
        <div className="text-8xl mb-4 animate-float">🧑‍🚀</div>
        <h1 className="text-[9rem] font-black text-white leading-none"
          style={{ textShadow: '0 0 80px rgba(229,25,55,0.6), 0 0 120px rgba(139,92,246,0.3)', letterSpacing: '-6px' }}>
          404
        </h1>
        <p className="text-gray-400 text-xl mt-2 mb-10">You're lost in space, astronaut...</p>
        <button onClick={() => navigate('/')}
          className="btn-red text-white font-bold px-12 py-4 rounded-2xl uppercase tracking-widest text-sm">
          🚀 Return to Earth
        </button>
      </div>

      <span className="absolute top-24 right-32 text-4xl animate-float" style={{ animationDelay: '1s' }}>🚀</span>
      <span className="absolute bottom-36 left-28 text-3xl animate-float" style={{ animationDelay: '3s' }}>🛸</span>
      <span className="absolute top-1/2 left-12 text-2xl animate-pulse">⭐</span>
    </div>
  );
};

export default NotFoundPage;
