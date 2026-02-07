import React, { useState } from 'react';
import { Container, Row, Col, Card, Nav } from 'react-bootstrap';
import './EncuestasPage.css';

const EncuestasPage = () => {
  const [activeTab, setActiveTab] = useState('contracursadas');

  const encuestas = {
    contracursadas: {
      title: 'Solicitud de Contracursadas',
      description: 'Completa esta encuesta para solicitar una contracursada. Tu solicitud será evaluada por el Centro de Estudiantes.',
      icon: 'fas fa-calendar-check',
      url: 'https://forms.gle/B6KM8jQCsZiidKRC6',
      embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSewuFVBY6eS_rsLKz3t0mNgiX-_IuHcnNgzcmcsmr3kFNcUTg/viewform?embedded=true'
    },
    horarios: {
      title: 'Encuesta de Horarios y Comisiones',
      description: 'Ayúdanos a conocer tus necesidades de horarios y comisiones. Esta información nos permitirá gestionar mejores opciones para todos.',
      icon: 'fas fa-clock',
      url: 'https://forms.gle/JPTAwpVNWgqnePc78',
      embedUrl: 'https://docs.google.com/forms/d/e/1FAIpQLSei5jz6koP8Q77roZ-plJpgkK1sUkcIhSW2_wGZcI9vM3FWdQ/viewform?embedded=true'
    }
  };

  const currentEncuesta = encuestas[activeTab];

  return (
    <div className="encuestas-page">
      <Container>
        {/* Hero Section */}
        <Row className="mb-5">
          <Col>
            <div className="encuestas-hero text-center">
              <h1 className="display-4 mb-3">
                <i className="fas fa-poll-h me-3"></i>
                Encuestas CODES++
              </h1>
              <p className="lead">
                Tu opinión es importante. Completa nuestras encuestas para ayudarnos a mejorar la experiencia estudiantil.
              </p>
            </div>
          </Col>
        </Row>

        {/* Tabs Navigation */}
        <Row className="mb-4">
          <Col>
            <Card className="tabs-card">
              <Card.Body className="p-0">
                <Nav variant="pills" className="encuestas-tabs">
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === 'contracursadas'}
                      onClick={() => setActiveTab('contracursadas')}
                      className="tab-link"
                    >
                      <i className="fas fa-calendar-check me-2"></i>
                      Solicitud de Contracursadas
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === 'horarios'}
                      onClick={() => setActiveTab('horarios')}
                      className="tab-link"
                    >
                      <i className="fas fa-clock me-2"></i>
                      Horarios y Comisiones
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Encuesta Info */}
        <Row className="mb-4">
          <Col>
            <Card className="encuesta-info-card">
              <Card.Body>
                <div className="d-flex align-items-center mb-3">
                  <div className="encuesta-icon me-3">
                    <i className={currentEncuesta.icon}></i>
                  </div>
                  <div>
                    <h3 className="mb-1">{currentEncuesta.title}</h3>
                    <p className="text-muted mb-0">{currentEncuesta.description}</p>
                  </div>
                </div>
                <div className="encuesta-actions">
                  <a
                    href={currentEncuesta.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary"
                  >
                    <i className="fas fa-external-link-alt me-2"></i>
                    Abrir en nueva pestaña
                  </a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Embedded Form */}
        <Row>
          <Col>
            <Card className="form-embed-card">
              <Card.Body className="p-0">
                <div className="form-container">
                  <iframe
                    src={currentEncuesta.embedUrl}
                    width="100%"
                    height="1200"
                    frameBorder="0"
                    marginHeight="0"
                    marginWidth="0"
                    title={currentEncuesta.title}
                    className="google-form-iframe"
                  >
                    Cargando…
                  </iframe>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Info Section */}
        <Row className="mt-5 mb-5">
          <Col lg={8} className="mx-auto">
            <Card className="info-card">
              <Card.Body className="text-center">
                <i className="fas fa-info-circle fa-3x mb-3 text-primary"></i>
                <h4 className="mb-3">¿Por qué son importantes estas encuestas?</h4>
                <p className="mb-3">
                  Tus respuestas nos ayudan a entender mejor las necesidades de los estudiantes y a 
                  gestionar mejoras en la organización académica.
                </p>
                <ul className="text-start" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <li className="mb-2">
                    <strong>Contracursadas:</strong> Nos permite organizar y gestionar las solicitudes 
                    de manera eficiente con la facultad.
                  </li>
                  <li className="mb-2">
                    <strong>Horarios y Comisiones:</strong> Con tus datos podemos solicitar nuevos 
                    horarios o comisiones que se ajusten mejor a las necesidades estudiantiles.
                  </li>
                </ul>
                <div className="mt-4">
                  <p className="text-muted mb-0">
                    <i className="fas fa-lock me-2"></i>
                    Tus datos son confidenciales y solo serán utilizados para gestiones académicas.
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default EncuestasPage;
