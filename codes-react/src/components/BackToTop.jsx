import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import './BackToTop.css';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Button
      id="backToTop"
      className={`position-fixed ${isVisible ? 'show' : ''}`}
      onClick={scrollToTop}
      title="Volver arriba"
      aria-label="Volver al inicio de la página"
    >
      <i className="fas fa-chevron-up"></i>
    </Button>
  );
};

export default BackToTop;

