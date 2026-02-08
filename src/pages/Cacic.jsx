import React, { useState } from 'react';
import { Container, Row, Col, Button, Card, Badge, Modal, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Cacic = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const cacicPhotos = [
    '20251006_125956.jpg',
    '20251006_154406.jpg',
    '20251007_091412.jpg',
    '20251008_195547.jpg',
    '20251010_062441.jpg',
    'cacic2025viernes (24 of 105).jpg',
    'CF338C43-D87B-4C8D-A24C-0122AE119376.jpg',
    'IMG_20251006_103334937_HDR.jpg',
    'IMG_20251006_154428446_HDR.jpg',
    'IMG_20251007_155325622_HDR.jpg',
    'IMG_20251007_155452756_HDR.jpg',
    'IMG_20251007_155548102_HDR.jpg',
    'IMG_20251007_155946039_HDR.jpg',
    'IMG_20251007_213929597_HDR_AE.jpg',
    'IMG_20251008_124909799_HDR.jpg',
    'IMG_20251008_155208193_HDR_AE.jpg',
    'IMG_20251008_160058937_HDR_AE.jpg',
    'IMG_20251008_160710503_HDR_AE.jpg',
    'IMG_20251008_162316169_HDR.jpg',
    'IMG_20251008_174637631_HDR.jpg',
    'IMG_20251008_174816377_HDR.jpg',
    'IMG_20251008_181454183_HDR.jpg',
    'IMG_20251008_193126978_HDR_AE.jpg',
    'IMG_20251008_193602600_AE.jpg',
    'IMG_20251009_012410185_AE.jpg',
    'IMG_20251010_111345327_HDR_AE.jpg',
    'IMG_6767.jpg'
  ];

  const handleImageClick = (imageName) => {
    setSelectedImage(imageName);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImage(null);
  };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&display=swap" rel="stylesheet" />
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&display=swap');
          
          .cacic-title {
            font-family: 'Orbitron', 'Rajdhani', sans-serif;
            font-weight: 900;
            letter-spacing: 2px;
            text-transform: uppercase;
            font-size: 4rem;
            color: #ffffff;
            text-shadow: 0 0 20px rgba(57, 192, 195, 0.8), 0 0 40px rgba(57, 192, 195, 0.6), 0 0 60px rgba(57, 192, 195, 0.4);
            position: relative;
          }
          
          .cacic-title::after {
            content: '';
            position: absolute;
            bottom: -10px;
            left: 50%;
            transform: translateX(-50%);
            width: 60%;
            height: 3px;
            background: linear-gradient(90deg, transparent, #39c0c3, transparent);
            box-shadow: 0 0 10px rgba(57, 192, 195, 0.8);
          }
          
          .photo-gallery {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 1.5rem;
            padding: 2rem 0;
          }
          
          .photo-carousel {
            display: none;
          }
          
          @media (max-width: 768px) {
            .photo-gallery {
              display: none;
            }
            
            .photo-carousel {
              display: block;
              padding: 2rem 0;
            }
            
            .photo-carousel .carousel-item img {
              width: 100%;
              height: auto;
              max-height: 70vh;
              object-fit: contain;
              border-radius: 12px;
              cursor: pointer;
            }
            
            .photo-carousel .carousel-control-prev,
            .photo-carousel .carousel-control-next {
              width: 50px;
              height: 50px;
              top: 50%;
              transform: translateY(-50%);
              background: rgba(57, 192, 195, 0.3);
              border-radius: 50%;
              backdrop-filter: blur(10px);
            }
            
            .photo-carousel .carousel-control-prev-icon,
            .photo-carousel .carousel-control-next-icon {
              filter: brightness(0) invert(1);
            }
            
            .photo-carousel .carousel-indicators {
              margin-bottom: 1rem;
            }
            
            .photo-carousel .carousel-indicators button {
              background-color: #39c0c3;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              margin: 0 5px;
            }
          }
          
          .photo-item {
            position: relative;
            overflow: hidden;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            aspect-ratio: 1;
            background: linear-gradient(135deg, #39c0c3 0%, #2a8a8d 100%);
          }
          
          .photo-item:hover {
            transform: translateY(-8px);
            box-shadow: 0 12px 40px rgba(0,0,0,0.3);
          }
          
          .photo-item img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }
          
          .photo-item:hover img {
            transform: scale(1.1);
          }
          
          .photo-overlay {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
            padding: 1rem;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          
          .photo-item:hover .photo-overlay {
            opacity: 1;
          }
          
          .photo-number {
            color: white;
            font-weight: 600;
          }
          
          .modal-image {
            width: 100%;
            height: auto;
            border-radius: 8px;
          }
          
          .cacic-header {
            background: linear-gradient(135deg, #39c0c3 0%, #2a8a8d 100%);
            border-radius: 16px;
            padding: 3rem;
            margin-bottom: 3rem;
            color: white;
            text-align: center;
          }
          
          .cacic-stats {
            display: flex;
            gap: 2rem;
            margin-top: 1.5rem;
            justify-content: center;
          }
          
          .stat-item {
            text-align: center;
          }
          
          .stat-number {
            font-size: 2.5rem;
            font-weight: bold;
            display: block;
          }
          
          .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
          }
          
          .back-button {
            position: relative;
            overflow: hidden;
          }
          
          .back-button:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(57, 192, 195, 0.6) !important;
          }
          
          .back-button::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            transition: left 0.5s;
          }
          
          .back-button:hover::before {
            left: 100%;
          }
        `}
      </style>

      <div className="py-5" style={{ marginTop: '80px', minHeight: '100vh', background: '#0f0f0f' }}>
        <Container>
          <Row className="mb-4">
            <Col>
              <div className="cacic-header">
                <h1 className="cacic-title mb-4">CACIC 2025</h1>
                <p className="lead">
                  Congreso Argentino de Ciencias de la Computación
                </p>
                <Badge bg="warning" text="dark" className="mb-4">Octubre 2025</Badge>
                
                <div className="cacic-stats">
                  <div className="stat-item">
                    <span className="stat-number">{cacicPhotos.length}+</span>
                    <span className="stat-label">Fotos</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">5</span>
                    <span className="stat-label">Días</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Éxito</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          <Row className="mb-4">
            <Col lg={12}>
              <Card className="mb-4" style={{ background: '#1a1a1a', border: '1px solid #333' }}>
                <Card.Body style={{ padding: '2rem', color: '#ffffff' }}>
                  <h2 className="mb-3" style={{ color: '#39c0c3' }}>
                    <i className="bi bi-trophy-fill me-2"></i>
                    ¿Qué es CACIC?
                  </h2>
                  <p className="mb-3" style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#e0e0e0' }}>
                    El Congreso Argentino de Ciencias de la Computación (CACIC) es el evento más importante 
                    del país en el área de Ciencias de la Computación. Reúne a investigadores, docentes, 
                    estudiantes y profesionales del sector para compartir avances científicos y tecnológicos.
                  </p>
                  <h3 className="mb-3" style={{ color: '#2a8a8d' }}>
                    <i className="bi bi-mortarboard-fill me-2"></i>
                    Participación de CODES++
                  </h3>
                  <p className="mb-3" style={{ fontSize: '1.1rem', lineHeight: '1.8', color: '#e0e0e0' }}>
                    En 2025, CODES++ gestionó el viaje para estudiantes destacados que asistieron al congreso con becas. 
                    Los participantes tuvieron la oportunidad de:
                  </p>
                  <Row>
                    <Col md={6}>
                      <ul className="list-unstyled">
                        <li className="mb-2" style={{ color: '#e0e0e0' }}>
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          Asistir a talleres especializados
                        </li>
                        <li className="mb-2" style={{ color: '#e0e0e0' }}>
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          Presentar trabajos y proyectos
                        </li>
                      </ul>
                    </Col>
                    <Col md={6}>
                      <ul className="list-unstyled">
                        <li className="mb-2" style={{ color: '#e0e0e0' }}>
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          Networking con profesionales
                        </li>
                        <li className="mb-2" style={{ color: '#e0e0e0' }}>
                          <i className="bi bi-check-circle-fill text-success me-2"></i>
                          Acceso a investigación de vanguardia
                        </li>
                      </ul>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <div className="text-center mb-4">
                <h2 className="display-5 mb-3" style={{ color: '#39c0c3' }}>
                  <i className="bi bi-images me-2"></i>
                  Galería de CACIC 2025
                </h2>
                <p className="lead" style={{ color: '#888' }}>
                  Un vistazo a nuestra experiencia en el congreso
                </p>
              </div>
              
              {/* Grid para Desktop */}
              <div className="photo-gallery">
                {cacicPhotos.map((photo, index) => (
                  <div key={index} className="photo-item" onClick={() => handleImageClick(photo)}>
                    <img 
                      src={`/assets/images/cacic2025/${photo}`} 
                      alt={`CACIC 2025 - Foto ${index + 1}`}
                      loading="lazy"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400?text=CACIC+2025';
                      }}
                    />
                    <div className="photo-overlay">
                      <div className="photo-number">
                        <i className="bi bi-zoom-in me-2"></i>
                        Ver foto {index + 1}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Carrusel para Móvil */}
              <div className="photo-carousel">
                <Carousel>
                  {cacicPhotos.map((photo, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100"
                        src={`/assets/images/cacic2025/${photo}`}
                        alt={`CACIC 2025 - Foto ${index + 1}`}
                        onClick={() => handleImageClick(photo)}
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400?text=CACIC+2025';
                        }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              </div>
            </Col>
          </Row>

          <Row className="mt-5 mb-4">
            <Col className="text-center">
              <Link to="/" className="back-button" style={{ 
                background: 'linear-gradient(135deg, #39c0c3 0%, #2a8a8d 100%)',
                border: 'none',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '50px',
                fontWeight: '600',
                fontSize: '1rem',
                boxShadow: '0 4px 15px rgba(57, 192, 195, 0.4)',
                transition: 'all 0.3s ease',
                display: 'inline-block',
                textDecoration: 'none'
              }}>
                <i className="bi bi-arrow-left me-2"></i>
                Volver al Inicio
              </Link>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Modal para ampliar imágenes */}
      <Modal show={showModal} onHide={handleCloseModal} size="xl" centered>
        <Modal.Header closeButton style={{ background: '#1a1a1a', borderColor: '#333' }}>
          <Modal.Title>CACIC 2025</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: '#0f0f0f', padding: 0 }}>
          {selectedImage && (
            <img 
              src={`/assets/images/cacic2025/${selectedImage}`} 
              alt="CACIC 2025 - Vista ampliada"
              className="modal-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/1200x800?text=CACIC+2025';
              }}
            />
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Cacic;

