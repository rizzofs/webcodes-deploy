import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize hero animations
    const hero = document.querySelector('.hero');
    if (!hero) return;

    // Show content with delay
    setTimeout(() => setIsVisible(true), 500);

    // Create dynamic particles
    const particlesContainer = hero.querySelector('.hero-particles');
    if (particlesContainer) {
      createDynamicParticles(particlesContainer);
    }

    // Add scroll-based parallax effect
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      setScrollY(scrolled);
      const rate = scrolled * -0.3;
      hero.style.transform = `translateY(${rate}px)`;
    };

    // Add mouse movement effect
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      
      const x = (clientX / innerWidth - 0.5) * 30;
      const y = (clientY / innerHeight - 0.5) * 30;
      
      setMousePosition({ x, y });
    };

    window.addEventListener('scroll', handleScroll);
    hero.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      hero.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const createDynamicParticles = (container) => {
    const particleCount = 30;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // Random positioning and timing
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDelay = Math.random() * 20 + 's';
      particle.style.animationDuration = (15 + Math.random() * 10) + 's';
      
      // Random size
      const size = Math.random() * 4 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      
      container.appendChild(particle);
    }
  };

  // Handle button clicks
  const handleGroupsClick = () => {
    navigate('/grupos');
  };

  const handleEventsClick = () => {
    const eventosSection = document.getElementById('eventos');
    if (eventosSection) {
      const headerOffset = 80;
      const elementPosition = eventosSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Handle scroll down arrow
  const handleScrollDown = () => {
    const aboutSection = document.getElementById('nosotros');
    if (aboutSection) {
      const headerOffset = 80;
      const elementPosition = aboutSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-particles"></div>
      <div className="hero-floating" style={{
        transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
      }}></div>
      <div className="hero-geometric-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
        <div className="shape shape-4"></div>
      </div>
      <div className="hero-gradient-overlay"></div>
      <div className="hero-wave"></div>
      <div className="hero-diagonal-lines"></div>
      <div className="hero-corner-accent top-left"></div>
      <div className="hero-corner-accent top-right"></div>
      <div className="hero-corner-accent bottom-left"></div>
      <div className="hero-corner-accent bottom-right"></div>
      <div className="container">
        <div className={`hero-content ${isVisible ? 'visible' : ''}`}>
          <div className="hero-badge">
            <span>Centro de Estudiantes</span>
          </div>
          <h1 className="hero-title">
            <span className="title-line">CODES++</span>
          </h1>
          <p className="subtitle">Centro Organizado de Estudiantes de Sistemas</p>
          <p className="description">
            Representamos y potenciamos a la comunidad estudiantil de la carrera de Sistemas 
            de la Universidad Nacional de Luján, brindando recursos, actividades y apoyo 
            académico para tu desarrollo profesional.
          </p>
          <div className="hero-actions">
            <button 
              className="btn btn-primary btn-lg hero-btn"
              onClick={handleGroupsClick}
            >
              <i className="fas fa-users me-2"></i>
              Conocé Nuestros Grupos
            </button>
            <button 
              className="btn btn-outline-light btn-lg hero-btn"
              onClick={handleEventsClick}
            >
              <i className="fas fa-calendar me-2"></i>
              Próximos Eventos
            </button>
          </div>
        </div>
      </div>
      <div className="hero-scroll-indicator">
        <div 
          className="scroll-arrow"
          onClick={handleScrollDown}
          style={{ cursor: 'pointer' }}
        >
          <i className="fas fa-chevron-down"></i>
        </div>
      </div>
    </section>
  );
};

export default Hero;

