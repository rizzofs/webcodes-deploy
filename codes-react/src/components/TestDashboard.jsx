import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const TestDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="text-center">
            <Card.Header>
              <h2>🎉 ¡Login Exitoso!</h2>
            </Card.Header>
            <Card.Body>
              <h4>Bienvenido, {user?.name}</h4>
              <p>Email: {user?.email}</p>
              <p>Rol: {user?.role}</p>
              <p>Avatar: {user?.avatar ? '✅' : '❌'}</p>
              
              <div className="mt-4">
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/dashboard')}
                  className="me-2"
                >
                  Ir al Dashboard Completo
                </Button>
                <Button 
                  variant="outline-danger" 
                  onClick={handleLogout}
                >
                  Cerrar Sesión
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TestDashboard;
