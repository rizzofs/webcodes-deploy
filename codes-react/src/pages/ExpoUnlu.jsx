import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const ExpoUnlu = () => {
  return (
    <div className="py-5" style={{ marginTop: '80px' }}>
      <Container>
        <Row className="mb-4">
          <Col>
            <Link to="/" className="btn btn-outline-primary mb-3">
              <i className="bi bi-arrow-left me-2"></i>
              Volver al Inicio
            </Link>
            <h1 className="display-4 mb-3">Expo UNLu</h1>
            <p className="lead">
              Exposición de proyectos estudiantiles y presentaciones de trabajos finales.
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={8}>
            <Card className="text-center">
              <Card.Body className="p-5">
                <h2 className="mb-4">¡Próximamente!</h2>
                <p className="mb-4">
                  Estamos organizando la próxima edición de Expo UNLu. 
                  Pronto tendrás más información sobre fechas, horarios y cómo participar.
                </p>
                <Button variant="primary" size="lg" disabled>
                  Próximamente
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ExpoUnlu;

