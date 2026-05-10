import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CommunityModal.css';

const CommunityModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si ya vio el modal en esta sesión o si ya aceptó
    const hasSeenModal = localStorage.getItem('communityModalSeen');
    if (!hasSeenModal) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500); // Aparece 1.5 segundos después de entrar
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('communityModalSeen', 'true');
  };

  const handleAccept = () => {
    handleClose();
    navigate('/comunidad');
  };

  if (!isOpen) return null;

  return (
    <div className="community-modal-overlay">
      <div className="community-modal">
        <button className="modal-close" onClick={handleClose}>&times;</button>
        
        <h2>Nueva Comunidad LSI</h2>
        <p style={{ textAlign: 'center', color: '#888', marginBottom: '25px' }}>
          Estamos renovando nuestros grupos para que sean un espacio seguro y exclusivo para estudiantes.
        </p>

        <div className="rules-list">
          <div className="rule-item">
            <span className="rule-icon">🎓</span>
            <div className="rule-text">
              <strong>Solo Estudiantes UNLu</strong>
              <p>Es obligatorio cargar tu certificado de alumno regular para ser admitido.</p>
            </div>
          </div>

          <div className="rule-item">
            <span className="rule-icon">🛡️</span>
            <div className="rule-text">
              <strong>Espacio Seguro</strong>
              <p>Prohibido el acoso, stalking o cualquier comportamiento que incomode a otros miembros.</p>
            </div>
          </div>

          <div className="rule-item">
            <span className="rule-icon">🚫</span>
            <div className="rule-text">
              <strong>Contenido Permitido</strong>
              <p>Prohibido compartir contenido inadecuado, ilegal o spam de cualquier tipo.</p>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-accept" onClick={handleAccept}>
            Entendido, ¡quiero unirme!
          </button>
          <button className="btn-later" onClick={handleClose}>
            Quizás más tarde
          </button>
        </div>
      </div>
    </div>
  );
};

export default CommunityModal;
