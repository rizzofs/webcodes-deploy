import React, { useState, useEffect } from 'react';
import './Logo.css';

const Logo = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show logo with delay for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`logo-container ${isVisible ? 'visible' : ''}`}>
      <button 
        className="logo-button"
        onClick={scrollToTop}
        aria-label="Ir al inicio - CODES++"
        title="Ir al inicio"
      >
        <div className="logo-image">
          <img 
            src="/assets/images/Logo.svg" 
            alt="Logo de CODES++ - Centro de Estudiantes de Sistemas"
            className="logo-svg"
          />
        </div>
        <div className="logo-text">
          <span className="logo-title">CODES++</span>
          <span className="logo-subtitle">Centro de Estudiantes</span>
        </div>
        <div className="logo-glow"></div>
      </button>
    </div>
  );
};

export default Logo;
