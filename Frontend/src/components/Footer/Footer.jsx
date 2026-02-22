import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

// SVG icons (no emoji, no external dependency)
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const SOCIAL_LINKS = [
  {
    icon: GithubIcon,
    label: 'GitHub',
    href: 'https://github.com/Divyanshutiwari102/',   
    color: '#6b7280',
    hoverColor: '#e2e8f0',
  },
  {
    icon: LinkedinIcon,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/divyanshu-tiwari-42b156289/', 
    color: '#6b7280',
    hoverColor: '#0a66c2',
  },
  {
    icon: TwitterIcon,
    label: 'Twitter',
    href: 'https://twitter.com/',
    color: '#6b7280',
    hoverColor: '#e2e8f0',
  },
  {
    icon: InstagramIcon,
    label: 'Instagram',
    href: 'https://instagram.com/',
    color: '#6b7280',
    hoverColor: '#e1306c',
  },
];

const QUICK_LINKS = [
  { label: 'Movies',  to: '/' },
  { label: 'Events',  to: '/' },
  { label: 'Plays',   to: '/' },
  { label: 'Sports',  to: '/' },
  { label: 'My Bookings', to: '/bookings' },
];

const GENRES = ['Action', 'Drama', 'Comedy', 'Sci-Fi', 'Horror', 'Animation'];

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer
      className="relative mt-20"
      style={{ background: '#080911', borderTop: '1px solid rgba(255,255,255,0.05)' }}
    >
      {/* Subtle top gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent 0%, rgba(229,25,55,0.3) 30%, rgba(229,25,55,0.3) 70%, transparent 100%)' }} />

      {/* Background glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(229,25,55,0.04) 0%, transparent 70%)' }} />
      </div>

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 pt-12 pb-6">

        {/* Main grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #e51937, #c01530)', boxShadow: '0 4px 16px rgba(229,25,55,0.35)' }}
              >
                <span className="text-white font-black text-sm">my</span>
              </div>
              <span className="text-white font-bold text-sm tracking-wide">Movie Booking System </span>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-5">
              Your one-stop destination for movies, events, plays, and live entertainment. Built with Spring Boot &amp; React.
            </p>

            {/* Social icons */}
            <div className="flex gap-2.5">
              {SOCIAL_LINKS.map(({ icon: Icon, label, href, hoverColor }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', color: '#6b7280' }}
                  onMouseEnter={e => { e.currentTarget.style.color = hoverColor; e.currentTarget.style.background = 'rgba(255,255,255,0.09)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5"
              style={{ letterSpacing: '0.12em' }}>
              Quick Links
            </h4>
            <ul className="space-y-3">
              {QUICK_LINKS.map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span
                      className="block w-1 h-1 rounded-full transition-all group-hover:w-2"
                      style={{ background: '#e51937' }}
                    />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genres */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5"
              style={{ letterSpacing: '0.12em' }}>
              Browse by Genre
            </h4>
            <ul className="space-y-3">
              {GENRES.map(g => (
                <li key={g}>
                  <button
                    onClick={() => navigate(`/?genre=${g}`)}
                    className="text-gray-500 hover:text-white text-sm transition-colors flex items-center gap-2 group"
                  >
                    <span
                      className="block w-1 h-1 rounded-full transition-all group-hover:w-2"
                      style={{ background: '#e51937' }}
                    />
                    {g}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Tech Stack / About */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-5"
              style={{ letterSpacing: '0.12em' }}>
              Tech Stack
            </h4>
            <ul className="space-y-2.5">
              {[
                { label: 'Spring Boot 3', detail: 'Backend REST API' },
                { label: 'MySQL',         detail: 'Database' },
                { label: 'JWT Auth',      detail: 'Security' },
                { label: 'React 18',      detail: 'Frontend' },
                { label: 'Tailwind CSS',  detail: 'Styling' },
                { label: 'Razorpay',      detail: 'Payments' },
              ].map(({ label, detail }) => (
                <li key={label} className="flex items-center justify-between">
                  <span className="text-gray-400 text-xs font-medium">{label}</span>
                  <span className="text-gray-600 text-xs">{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mb-6"
          style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)' }} />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-700 text-xs">
            &copy; {new Date().getFullYear()} Movie Booking System   <br></br> All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 text-xs hover:text-gray-500 cursor-pointer transition-colors">Privacy Policy</span>
            <span className="text-gray-800 text-xs">|</span>
            <span className="text-gray-700 text-xs hover:text-gray-500 cursor-pointer transition-colors">Terms of Service</span>
            <span className="text-gray-800 text-xs">|</span>
            <span className="text-gray-700 text-xs hover:text-gray-500 cursor-pointer transition-colors">Cookie Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
