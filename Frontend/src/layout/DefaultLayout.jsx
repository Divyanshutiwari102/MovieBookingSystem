import React, { useState } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Footer from '../components/Footer/Footer';
import SignInModal from '../components/Modal/SignInModal';



export const DefaultlayoutHoc = (WrappedComponent) => {
  function DefaultLayout(props) {
    const [showSignIn, setShowSignIn] = useState(false);
    return (
      <div style={{ minHeight: '100vh', background: '#0d0e1a' }}>
        <Navbar onSignInClick={() => setShowSignIn(true)} />
        <WrappedComponent {...props} onSignInClick={() => setShowSignIn(true)} />
        <Footer />
        <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
      </div>
    );
  }
  DefaultLayout.displayName = `DefaultLayout(${WrappedComponent.displayName || WrappedComponent.name})`;
  return DefaultLayout;
};

export const MovieLayoutHoc = (WrappedComponent) => {
  function MovieLayout(props) {
    const [showSignIn, setShowSignIn] = useState(false);
    return (
      <div style={{ minHeight: '100vh', background: '#0d0e1a' }}>
        <Navbar onSignInClick={() => setShowSignIn(true)} />
        <WrappedComponent {...props} onSignInClick={() => setShowSignIn(true)} />
        <SignInModal isOpen={showSignIn} onClose={() => setShowSignIn(false)} />
      </div>
    );
  }
  MovieLayout.displayName = `MovieLayout(${WrappedComponent.displayName || WrappedComponent.name})`;
  return MovieLayout;
};
