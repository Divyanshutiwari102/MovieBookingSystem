import React from 'react';

const Loader = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] gap-5">
    <div className="relative w-16 h-16">
      <div className="absolute inset-0 border-4 rounded-full" style={{ borderColor: 'rgba(229,25,55,0.15)' }} />
      <div className="absolute inset-0 border-4 border-t-transparent border-r-transparent rounded-full animate-spin" style={{ borderColor: '#e51937', borderTopColor: 'transparent', borderRightColor: 'transparent' }} />
      <div className="absolute inset-3 rounded-full" style={{ background: 'linear-gradient(135deg, #e51937, #c01530)', boxShadow: '0 0 20px rgba(229,25,55,0.5)' }} />
    </div>
    <p className="text-gray-500 text-sm animate-pulse">Loading...</p>
  </div>
);

export default Loader;
