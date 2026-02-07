import React from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Groups.css';

const Groups = () => {
  return (
    <div className="groups-page">
      <Container className="groups-container">
        {/* Header Section */}
        <div className="groups-header">
          <Link to="/" className="back-btn">
            <i className="fas fa-arrow-left"></i>
            Volver al Inicio
          </Link>
          <h1 className="groups-title">Grupos de Estudio</h1>
        </div>

        {/* Under Construction Message */}
        <div className="construction-container">
          <div className="construction-content">
            <div className="construction-icon">
              <i className="fas fa-hammer"></i>
            </div>
            <h2 className="construction-title">🚧 En Construcción 🚧</h2>
            <p className="construction-message">
              Estamos trabajando en los grupos de estudio para brindarte la mejor experiencia. 
              ¡Pronto estarán disponibles!
            </p>
            <div className="construction-features">
              <div className="feature-item">
                <i className="fas fa-users"></i>
                <span>Grupos por materia</span>
              </div>
              <div className="feature-item">
                <i className="fab fa-discord"></i>
                <span>Integración con Discord</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-comments"></i>
                <span>Chat en tiempo real</span>
              </div>
              <div className="feature-item">
                <i className="fas fa-share-alt"></i>
                <span>Compartir recursos</span>
              </div>
            </div>
            <div className="construction-cta">
              <p className="construction-subtitle">
                Mientras tanto, puedes unirte a nuestro servidor de Discord:
              </p>
              <a 
                href="https://discord.gg/codesunlu" 
                target="_blank"
                rel="noopener noreferrer"
                className="discord-link-btn"
              >
                <i className="fab fa-discord"></i>
                Unirse a Discord
              </a>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Groups;