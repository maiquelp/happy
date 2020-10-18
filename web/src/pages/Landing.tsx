import React from 'react';
import { Link } from 'react-router-dom';

import '../styles/pages/landing.css';

import logoImg from '../images/logo.svg';
import { FiArrowRight } from 'react-icons/fi';

function Landing() {
  return (
    <div id="page-landing">
    <div className="content-wrapper">
      <img src={logoImg} alt="happy"/>
      <main>
        <h1>Spread happiness to the world</h1>
        <p>Visit orphanages and change the day for a lot of children.</p>
      </main>
      <div className="location">
        <strong>be</strong>
        <span>happy!</span>
      </div>
      <Link to="/app" className="enter-app">
        <FiArrowRight size={26} color="rgba(0, 0, 0, 0.6)" />  
      </Link>
    </div>
  </div>
  );
}

export default Landing;