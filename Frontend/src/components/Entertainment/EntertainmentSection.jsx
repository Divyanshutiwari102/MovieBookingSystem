import React from 'react';
import Slider from 'react-slick';

const CATEGORIES = [
  { label: 'Comedy Shows', emoji: '🎭', color: '#f59e0b', bg: 'from-amber-900/40 to-amber-800/20', count: '190+', img: 'https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-MTkwKyBFdmVudHM%3D,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/comedy-shows-collection-202211140440.png' },
  { label: 'Music Shows',  emoji: '🎵', color: '#8b5cf6', bg: 'from-violet-900/40 to-violet-800/20', count: '120+', img: 'https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-MTIwKyBFdmVudHM%3D,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/music-shows-collection-202211140440.png' },
  { label: 'Kids Zone',    emoji: '🧸', color: '#ec4899', bg: 'from-pink-900/40 to-pink-800/20',   count: '10+',  img: 'https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-MTArIEV2ZW50cw%3D%3D,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/kids-zone-collection-202211140440.png' },
  { label: 'Workshops',    emoji: '🛠️', color: '#22c55e', bg: 'from-green-900/40 to-green-800/20', count: '110+', img: 'https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-MTEwKyBFdmVudHM%3D,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/workshop-and-more-web-collection-202211140440.png' },
  { label: 'Theatre',      emoji: '🎪', color: '#f97316', bg: 'from-orange-900/40 to-orange-800/20', count: '125+', img: 'https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-MTI1KyBFdmVudHM%3D,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/theatre-shows-collection-202211140440.png' },
  { label: 'Upskill',      emoji: '📚', color: '#06b6d4', bg: 'from-cyan-900/40 to-cyan-800/20',   count: '10+',  img: 'https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-MTArIEV2ZW50cw%3D%3D,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/upskill-collection-202211140440.png' },
  { label: 'Games',        emoji: '🎮', color: '#e51937', bg: 'from-red-900/40 to-red-800/20',     count: '10+',  img: 'https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-MTAgRXZlbnRz,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/interactive-games-collection-202211140440.png' },
  { label: 'Arts & Crafts',emoji: '🎨', color: '#a855f7', bg: 'from-purple-900/40 to-purple-800/20',count: '10+', img: 'https://assets-in.bmscdn.com/discovery-catalog/collections/tr:w-800,h-800:l-text,ie-MTArIEV2ZW50cw%3D%3D,co-FFFFFF,ff-Roboto,fs-64,lx-48,ly-320,tg-b,pa-8_0_0_0,l-end:w-300/arts-crafts-collection-202211140440.png' },
];

const settings = {
  arrows: true, infinite: false, slidesToShow: 5, slidesToScroll: 4, speed: 500,
  responsive: [
    { breakpoint: 1280, settings: { slidesToShow: 4, slidesToScroll: 3 } },
    { breakpoint: 1024, settings: { slidesToShow: 3, slidesToScroll: 3 } },
    { breakpoint: 640,  settings: { slidesToShow: 2, slidesToScroll: 2 } },
  ],
};

const EntertainmentSection = () => (
  <div className="px-4 md:px-10 my-12 animate-fade-up">
    <div className="flex items-end justify-between mb-5">
      <h2 className="text-white text-xl font-bold">The Best of Entertainment</h2>
      <button className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors">See all</button>
    </div>
    <Slider {...settings}>
      {CATEGORIES.map((c, i) => (
        <div key={i} className="px-1 outline-none">
          <div
            className="rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl relative group"
            style={{ background: '#14152b', border: '1px solid rgba(255,255,255,0.05)' }}
          >
            <img src={c.img} alt={c.label} className="w-full block transition-transform duration-500 group-hover:scale-105"
              onError={e => { e.target.src = `https://placehold.co/200x200/${c.color.replace('#','')}/fff?text=${encodeURIComponent(c.emoji)}`; }} />
          </div>
        </div>
      ))}
    </Slider>
  </div>
);

export default EntertainmentSection;
