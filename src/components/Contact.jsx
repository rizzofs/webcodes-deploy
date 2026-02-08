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
              <p>sistemas@codesunlu.tech</p>
              <a href="mailto:sistemas@codesunlu.tech" className="contact-link">
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
        <Row className="mt-5">
          <Col lg={8} className="mx-auto">
            <div className="social-section">
              <div className="social-section-header">
                <span className="social-badge">Comunidad</span>
                <h4>Síguenos en nuestras redes</h4>
                <p>Conectá con nosotros y mantenete al día con todas las novedades</p>
              </div>
              <div className="social-icons-grid">
                <a href="https://www.instagram.com/codes_unlu/" target="_blank" rel="noopener noreferrer" className="social-card" aria-label="Instagram" data-network="instagram">
                  <div className="social-card-icon">
                    <i className="fab fa-instagram"></i>
                  </div>
                  <span className="social-card-label">Instagram</span>
                </a>
                <a href="https://www.facebook.com/profile.php?id=61585314745245" target="_blank" rel="noopener noreferrer" className="social-card" aria-label="Facebook" data-network="facebook">
                  <div className="social-card-icon">
                    <i className="fab fa-facebook-f"></i>
                  </div>
                  <span className="social-card-label">Facebook</span>
                </a>
                <a href="https://x.com/codes_unlu" target="_blank" rel="noopener noreferrer" className="social-card" aria-label="Twitter" data-network="twitter">
                  <div className="social-card-icon">
                    <i className="fab fa-twitter"></i>
                  </div>
                  <span className="social-card-label">X / Twitter</span>
                </a>
                <a href="https://www.linkedin.com/groups/10006340/" target="_blank" rel="noopener noreferrer" className="social-card" aria-label="LinkedIn" data-network="linkedin">
                  <div className="social-card-icon">
                    <i className="fab fa-linkedin-in"></i>
                  </div>
                  <span className="social-card-label">LinkedIn</span>
                </a>
                <a href="https://discord.gg/fKsVT9bzSQ" target="_blank" rel="noopener noreferrer" className="social-card" aria-label="Discord" data-network="discord">
                  <div className="social-card-icon">
                    <i className="fab fa-discord"></i>
                  </div>
                  <span className="social-card-label">Discord</span>
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