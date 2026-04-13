import React, { useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Colaboradores.css';

const Colaboradores = () => {
  const localImages = import.meta.glob('../assets/*.{png,jpg,jpeg,webp,gif,svg,avif}', {
    eager: true,
    import: 'default',
  });

  const localImageByFileName = Object.entries(localImages).reduce((acc, [path, url]) => {
    const fileName = path.split('/').pop();
    if (fileName) acc[fileName] = url;
    return acc;
  }, {});

  const [imageErrors, setImageErrors] = useState({});

  const resolveImageSrc = (imagePath) => {
    if (!imagePath) return null;

    const isAbsoluteOrExternal =
      imagePath.startsWith('/') ||
      imagePath.startsWith('http://') ||
      imagePath.startsWith('https://') ||
      imagePath.startsWith('data:') ||
      imagePath.startsWith('blob:');

    if (isAbsoluteOrExternal) return imagePath;

    const fileName = imagePath.split('/').pop();
    return localImageByFileName[fileName] || imagePath;
  };

  const handleImageError = (index) => {
    setImageErrors((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  const colaboradores = [
    {
      name: "Tatiana Galeano",
      role: "Gestión de Redes Sociales",
      description: "Crea contenido visual atractivo y mantiene nuestra comunidad conectada",
      icon: "bi-camera-fill",
      socialLinks: [
        {
          platform: "linkedin",
          url: "https://www.linkedin.com/in/tatiana-galeano",
          icon: "bi-linkedin"
        },
        {
          platform: "instagram", 
          url: "https://www.instagram.com/lourtati",
          icon: "bi-instagram"
        }
      ]
    },
    {
      name: "¿Te gustaría colaborar?",
      role: "Únete a nuestro equipo",
      description: "Buscamos personas apasionadas por ayudar a la comunidad estudiantil",
      icon: "bi-plus-circle",
      isComingSoon: true,
      ctaText: "Contactanos",
      ctaLink: "#contacto"
    }
  ];

  return (
    <section id="colaboradores" className="py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="section-title">🤝 Colaboradores</h2>
          <p className="section-subtitle">
            Agradecemos a quienes nos ayudan a hacer crecer nuestra comunidad.
          </p>
        </div>
        
        <Row className="justify-content-center">
          {colaboradores.map((colaborador, index) => (
            <Col md={4} sm={6} className="mb-4" key={index}>
              <div className={`collaborator-card ${colaborador.isComingSoon ? 'coming-soon' : 'social-media-role'}`}>
                <div className={`role-icon ${colaborador.image && !imageErrors[index] ? 'role-icon-static' : ''}`}>
                  {colaborador.image && !imageErrors[index] ? (
                    <img
                      src={resolveImageSrc(colaborador.image)}
                      alt={colaborador.name}
                      className="role-image"
                      loading="lazy"
                      onError={() => handleImageError(index)}
                    />
                  ) : (
                    <i className={`bi ${colaborador.icon || 'bi-image'}`}></i>
                  )}
                </div>
                <div className="collaborator-info">
                  <h4>{colaborador.name}</h4>
                  <p className="collaborator-role">{colaborador.role}</p>
                  <p className="collaborator-description">
                    {colaborador.description}
                  </p>
                  
                  {colaborador.socialLinks ? (
                    <div className="social-links">
                      {colaborador.socialLinks.map((social, socialIndex) => (
                        <a 
                          key={socialIndex}
                          href={social.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className={`social-link ${social.platform}`}
                          aria-label={social.platform}
                        >
                          <i className={social.icon}></i>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="cta-button">
                      <a href={colaborador.ctaLink} className="btn btn-outline-primary">
                        {colaborador.ctaText}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default Colaboradores;
