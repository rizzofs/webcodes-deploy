import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ContactForm from './ContactForm';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contacto" className="py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="section-title">📞 Contacto</h2>
          <p className="section-subtitle">
            ¿Tienes alguna pregunta, sugerencia o necesitas ayuda? 
            Estamos aquí para ayudarte y escuchar tus ideas.
          </p>
        </div>

        <Row className="justify-content-center">
          <Col lg={10}>
            <ContactForm />
          </Col>
        </Row>

        {/* Información de Contacto Adicional */}
        <Row className="mt-5">
          <Col md={4} className="text-center mb-4">
            <div className="contact-info-card">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h5>Email</h5>
              <p>codes.unlu@gmail.com</p>
              <a href="mailto:codes.unlu@gmail.com" className="contact-link">
                Enviar email
              </a>
            </div>
          </Col>

          <Col md={4} className="text-center mb-4">
            <div className="contact-info-card">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h5>Ubicación</h5>
              <p>Universidad Nacional de Luján</p>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="contact-link">
                Ver en mapa
              </a>
            </div>
          </Col>

          <Col md={4} className="text-center mb-4">
            <div className="contact-info-card">
              <div className="contact-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h5>Horarios</h5>
              <p>Lunes a Viernes</p>
              <p className="contact-time">9:00 - 18:00</p>
            </div>
          </Col>
        </Row>

        {/* Redes Sociales */}
        <Row className="mt-4">
          <Col className="text-center">
            <div className="social-links">
              <h5 className="mb-3">Síguenos en nuestras redes</h5>
              <div className="social-icons">
                <a href="#" className="social-link" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="social-link" aria-label="Facebook">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="social-link" aria-label="Discord">
                  <i className="fab fa-discord"></i>
                </a>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Contact;