import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IMG_W500 } from '../../services/api';

const Poster = ({ id, title, original_title, posterUrl, poster_path }) => {
  const [imgErr, setImgErr] = useState(false);
  const name = title || original_title || '';

  let src = '';
  if (!imgErr) {
    if (posterUrl) src = posterUrl.startsWith('http') ? posterUrl : `${IMG_W500}${posterUrl}`;
    else if (poster_path) src = `${IMG_W500}${poster_path}`;
  }
  if (!src) src = `https://placehold.co/200x300/14152b/e51937?text=${encodeURIComponent(name || '?')}`;

  return (
    <Link to={`/movie/${id}`} className="block px-1 md:px-1.5 outline-none">
      <div className="movie-card cursor-pointer rounded-xl overflow-hidden relative" style={{ background: '#14152b' }}>
        <div className="relative overflow-hidden" style={{ paddingBottom: '150%' }}>
          <img
            src={src}
            alt={name}
            onError={() => setImgErr(true)}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {}
          <div
            className="card-overlay absolute inset-0 flex flex-col justify-end p-3 opacity-0 transition-opacity duration-300"
            style={{ background: 'linear-gradient(to top, rgba(229,25,55,0.9) 0%, transparent 60%)' }}
          >
            <span className="text-white text-xs font-bold uppercase tracking-wide">Book Now →</span>
          </div>
        </div>
        <div className="p-2 pb-3">
          <h4 className="text-white text-xs font-semibold line-clamp-2 leading-tight">{name}</h4>
        </div>
      </div>
    </Link>
  );
};

export default Poster;
