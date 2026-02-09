import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import talksService from '../services/talksService';
import './CharlasPage.css';

const CharlasPage = () => {
  const [loading, setLoading] = useState(true);
  const [charlasPasadas, setCharlasPasadas] = useState([]);
  const [proximasCharlas, setProximasCharlas] = useState([]);

  useEffect(() => {
    const fetchTalks = async () => {
      try {
        const data = await talksService.getAll();
        
        const now = new Date();
        const pasadas = [];
        const proximas = [];
        
        // Manual talks injection
        const manualTalks = [
          {
            id: 'manual-1',
            title: 'IA: Pasado, Presente y Futuro',
            speaker: 'Jorge Sagula & Jose Luis', 
            date: '2025-10-15T18:00:00Z', 
            description: 'Charla sobre la evolución de la Inteligencia Artificial y su impacto.',
            video_url: 'https://www.youtube.com/watch?v=UrtPaE4EBPM',
          },
          {
            id: 'manual-2',
            title: 'Charla Abierta',
            speaker: 'Invitado Especial',
            date: '2025-11-20T18:00:00Z',
            description: 'Charla organizada por el Centro de Estudiantes.',
            video_url: 'https://www.youtube.com/watch?v=UC1ToqwavNA',
          }
        ];

        const allTalks = [...data, ...manualTalks];
        
        allTalks.forEach(charla => {
          if (new Date(charla.date) < now) {
            pasadas.push(charla);
          } else {
            proximas.push(charla);
          }
        });

        setCharlasPasadas(pasadas);
        setProximasCharlas(proximas);
      } catch (error) {
        console.error('Error fetching talks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTalks();
  }, []);

  // Hardcoded for now until we move this to DB too
  const speakers2026 = [
    {
      id: 1,
      name: 'Nehuen Prados',
      description: 'Trabajo en transformación digital desde hace más de una década, liderando proyectos donde la teoría y la práctica se encuentran en el terreno real. Exigente con los resultados y la calidad. Docente universitario con enfoque pragmático: la innovación debe estar al servicio de la solución.',
      avatar: '👨‍💻'
    },
    {
      id: 2,
      name: 'Patricia Jebsen',
      description: 'Miembro de junta directiva y asesora de negocios en empresas de tecnología, e-commerce y retail. Consultora especializada en estrategias de e-commerce y omnicanal. Creadora de contenido y conferencista sobre desarrollo profesional y liderazgo.',
      avatar: '👩‍💻'
    },
    {
      id: 3,
      name: 'Gladys Kaplan',
      description: 'Profesora e Investigadora en Ingeniería en Informática y Licenciatura en Sistemas de Información. Investiga en Ingeniería de Software, particularmente en Ingeniería de Requisitos. Master en Informática y Doctorado de UNLP. Integra el Registro de expertos de Coneau desde 2010.',
      avatar: '👩‍🏫'
    }
  ];
  
  // Helper to extract video ID from various youtube URL formats
  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="charlas-page">
      <Container>
        {/* Hero Section */}
        <Row className="mb-5">
          <Col>
            <div className="charlas-hero text-center">
              <h1 className="display-4 mb-3">
                <i className="fas fa-video me-3"></i>
                Charlas CODES++
              </h1>
              <p className="lead">
                Descubre las charlas y conferencias organizadas por el Centro de Estudiantes. 
                Aprende de expertos en tecnología, programación e innovación.
              </p>
            </div>
          </Col>
        </Row>

        {/* Charlas Pasadas Section */}
        {charlasPasadas.length > 0 && (
          <>
            <Row className="mb-5">
              <Col>
                <div className="section-header text-center mb-4">
                  <h2>
                    <i className="fas fa-play-circle me-2"></i>
                    Charlas Pasadas
                  </h2>
                  <p className="text-muted">Revive las charlas que ya se realizaron</p>
                </div>
              </Col>
            </Row>
    
            <Row className="mb-5">
              {charlasPasadas.map((charla) => {
                const videoId = getYoutubeId(charla.video_url);
                return (
                  <Col lg={6} md={12} key={charla.id} className="mb-4">
                    <Card className="charla-card h-100">
                      <Card.Body>
                        {/* Video Embed */}
                         {videoId && (
                            <div className="video-container mb-3">
                              <iframe
                                src={`https://www.youtube.com/embed/${videoId}`}
                                title={charla.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="youtube-iframe"
                              ></iframe>
                            </div>
                         )}
    
                        {/* Charla Info */}
                        <div className="charla-info">
                          <h3 className="charla-title">{charla.title}</h3>
                          <div className="charla-meta mb-3">
                            <span className="speaker">
                              <i className="fas fa-user me-2"></i>
                              {charla.speaker}
                            </span>
                            <span className="date">
                              <i className="fas fa-calendar me-2"></i>
                              {new Date(charla.date).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="charla-description">{charla.description}</p>
                          {charla.video_url && (
                            <a
                              href={charla.video_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-outline-primary"
                            >
                              <i className="fab fa-youtube me-2"></i>
                              Ver en YouTube
                            </a>
                          )}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </>
        )}

        {/* Próximas Charlas Section */}
        <Row className="mb-5">
          <Col>
            <div className="section-header text-center mb-4">
              <h2>
                <i className="fas fa-calendar-plus me-2"></i>
                Próximas Charlas
              </h2>
              <p className="text-muted">Mantente al tanto de las charlas programadas</p>
            </div>
          </Col>
        </Row>

        <Row className="mb-5">
          {proximasCharlas.length > 0 ? (
            proximasCharlas.map((charla) => (
              <Col lg={6} md={12} key={charla.id} className="mb-4">
                <Card className="upcoming-charla-card">
                  <Card.Body>
                    <div className="upcoming-badge">
                      <i className="fas fa-clock me-2"></i>
                      Próximamente
                    </div>
                    <h3 className="charla-title">{charla.title}</h3>
                    <div className="charla-meta mb-3">
                      <span className="speaker">
                        <i className="fas fa-user me-2"></i>
                        {charla.speaker}
                      </span>
                      <span className="date">
                        <i className="fas fa-calendar me-2"></i>
                        {new Date(charla.date).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="charla-description">{charla.description}</p>
                    {charla.registration_link && (
                      <a
                        href={charla.registration_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary"
                      >
                        <i className="fab fa-youtube me-2"></i>
                        {charla.isLive ? 'Ver en vivo por YouTube' : 'Registrarse'}
                      </a>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <Card className="no-charlas-card">
                <Card.Body className="text-center py-5">
                  <i className="fas fa-calendar-times fa-3x mb-3 text-muted"></i>
                  <h4>No hay charlas programadas por el momento</h4>
                  <p className="text-muted mb-0">
                    Mantente atento a nuestras redes sociales para conocer las próximas charlas.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          )}
        </Row>

        {/* Lo que se viene en 2026 Section */}
        <Row className="mb-5">
          <Col>
            <div className="section-header text-center mb-4">
              <h2>
                <i className="fas fa-star me-2"></i>
                Lo que se viene en 2026
              </h2>
              <p className="text-muted">Disertantes en conversaciones para el próximo año</p>
            </div>
          </Col>
        </Row>

        <Row className="mb-5">
          {speakers2026.map((speaker) => (
            <Col lg={4} md={6} key={speaker.id} className="mb-4">
              <Card className="speaker-card">
                <Card.Body className="text-center">
                  <div className="speaker-avatar mb-3">
                    <span className="avatar-emoji">{speaker.avatar}</span>
                  </div>
                  <h4 className="speaker-name">{speaker.name}</h4>
                  <p className="speaker-description">{speaker.description}</p>
                  <div className="coming-soon-badge">
                    <i className="fas fa-handshake me-2"></i>
                    En conversaciones
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Info Section */}
        <Row className="mb-5">
          <Col lg={8} className="mx-auto">
            <Card className="info-card">
              <Card.Body className="text-center">
                <i className="fas fa-info-circle fa-3x mb-3 text-primary"></i>
                <h4 className="mb-3">¿Quieres proponer una charla?</h4>
                <p className="mb-3">
                  Si tienes una idea para una charla o conoces a alguien que podría compartir 
                  conocimientos valiosos con la comunidad, ¡contáctanos!
                </p>
                <a href="mailto:sistemas@codesunlu.tech" className="btn btn-outline-primary">
                  <i className="fas fa-envelope me-2"></i>
                  Contactar
                </a>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CharlasPage;
