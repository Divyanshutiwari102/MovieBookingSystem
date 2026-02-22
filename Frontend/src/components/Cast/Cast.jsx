import React from 'react';

const Cast = ({ image, castName, role }) => (
  <div className="flex flex-col items-center gap-2 px-2 outline-none">
    <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center"
      style={{ background: '#1a1b2e', border: '2px solid rgba(255,255,255,0.08)' }}>
      {image
        ? <img src={`https://image.tmdb.org/t/p/w185${image}`} alt={castName} className="w-full h-full object-cover object-top"
            onError={e => { e.target.style.display = 'none'; }} />
        : <span className="text-gray-600 text-2xl font-bold">?</span>
      }
    </div>
    <div className="text-center">
      <p className="text-white text-xs font-semibold leading-tight">{castName}</p>
      <p className="text-gray-600 text-xs">{role}</p>
    </div>
  </div>
);

export default Cast;
