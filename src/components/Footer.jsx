import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer-modern">
      <div className="waves-container">
        <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
          </defs>
          <g className="parallax">
            <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(26, 26, 26, 0.7)" />
            <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(26, 26, 26, 0.5)" />
            <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(26, 26, 26, 0.3)" />
            <use xlinkHref="#gentle-wave" x="48" y="7" fill="#1a1a1a" />
          </g>
        </svg>
      </div>
      
      <Container className="footer-main">
        <Row className="align-items-center">
          <Col lg={6} md={6} className="mb-4 mb-lg-0">
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon">
                  <i className="bi bi-code-slash"></i>
                </div>
                <div className="logo-text">
                  <h3>CODES++</h3>
                  <span>Centro de Estudiantes</span>
                </div>
              </div>
              <p className="footer-description">
                Representamos, acompañamos y potenciamos a toda la comunidad 
                de la carrera de Sistemas de la Universidad Nacional de Luján.
              </p>
            </div>
          </Col>
          
          <Col lg={6} md={6} className="mb-4 mb-lg-0">
            <div className="footer-contact">
              <h5>Contacto</h5>
              <div className="contact-item">
                <i className="bi bi-envelope"></i>
                <span>codes.unlu@gmail.com</span>
              </div>
              <div className="contact-item">
                <i className="bi bi-geo-alt"></i>
                <span>Universidad Nacional de Luján</span>
              </div>
              <div className="contact-item">
                <i className="bi bi-calendar"></i>
                <span>Fundado en 2022</span>
              </div>
            </div>
          </Col>
        </Row>
        
        <hr className="footer-divider" />
        
        <Row className="align-items-center">
          <Col md={6}>
            <div className="footer-copyright">
              <p>&copy; {currentYear} CODES++. Todos los derechos reservados.</p>
              <p className="small">Hecho con ❤️ por estudiantes para estudiantes</p>
            </div>
          </Col>
          <Col md={6}>
            <div className="footer-legal">
              <a href="#privacidad">Política de Privacidad</a>
              <a href="#terminos">Términos de Uso</a>
              <a href="#cookies">Cookies</a>
            </div>
          </Col>
        </Row>
      </Container>
      
      <div className="footer-particles">
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
        <div className="particle"></div>
      </div>
    </footer>
  );
};

export default Footer;

