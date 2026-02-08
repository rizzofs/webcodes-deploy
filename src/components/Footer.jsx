import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="footer-modern">
      <div className="footer-wave">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"></path>
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

