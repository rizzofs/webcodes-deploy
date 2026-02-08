import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (loginError) {
      setLoginError('');
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoginError('');
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      console.log('Login successful:', result.user);
      navigate('/dashboard');
    } else {
      console.error('Login failed:', result.error);
      if (result.error.includes('Invalid login credentials')) {
        setLoginError('Email o contraseña incorrectos');
      } else {
        setLoginError(result.error);
      }
    }
  };

  return (
    <div className="login-page">
      <div className="login-background">
        <div className="login-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
      </div>
      
      <Container className="login-container">
        <Row className="justify-content-center align-items-center min-vh-100">
          <Col lg={5} md={7} sm={9} xs={11}>
            <Card className="login-card">
              <Card.Body className="p-5">
                <div className="login-header text-center mb-4">
                  <div className="login-logo">
                    <i className="fas fa-code"></i>
                  </div>
                  <h2 className="login-title">CODES++</h2>
                  <p className="login-subtitle">Panel de Administración</p>
                </div>

                <Form onSubmit={handleSubmit} className="login-form">
                  {loginError && (
                    <Alert variant="danger" className="login-alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {loginError}
                    </Alert>
                  )}

                  <Form.Group className="form-group mb-3">
                    <Form.Label>
                      <i className="fas fa-envelope me-2"></i>
                      Email
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="tu@email.com"
                      isInvalid={!!errors.email}
                      className="form-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="form-group mb-4">
                    <Form.Label>
                      <i className="fas fa-lock me-2"></i>
                      Contraseña
                    </Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Tu contraseña"
                      isInvalid={!!errors.password}
                      className="form-input"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    disabled={loading}
                    className="login-btn w-100"
                  >
                    {loading ? (
                      <>
                        <i className="fas fa-spinner fa-spin me-2"></i>
                        Iniciando sesión...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-sign-in-alt me-2"></i>
                        Iniciar Sesión
                      </>
                    )}
                  </Button>
                </Form>

                <div className="login-footer text-center mt-4">
                  <p className="login-help">
                    ¿Problemas para acceder? Contacta al administrador
                  </p>
                  
                  <div className="demo-accounts mt-3">
                    <h6>Cuentas de demostración:</h6>
                    <div className="demo-account">
                      <strong>Admin:</strong> admin@codes.unlu.edu.ar / admin123
                    </div>
                    <div className="demo-account">
                      <strong>Editor:</strong> editor@codes.unlu.edu.ar / editor123
                    </div>
                    <div className="demo-account">
                      <strong>Miembro:</strong> miembro@codes.unlu.edu.ar / miembro123
                    </div>
                    
                    <div className="demo-buttons mt-3">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => setFormData({ email: 'admin@codes.unlu.edu.ar', password: 'admin123' })}
                        className="me-2"
                      >
                        Llenar Admin
                      </Button>
                      <Button 
                        variant="outline-warning" 
                        size="sm" 
                        onClick={() => setFormData({ email: 'editor@codes.unlu.edu.ar', password: 'editor123' })}
                        className="me-2"
                      >
                        Llenar Editor
                      </Button>
                      <Button 
                        variant="outline-info" 
                        size="sm" 
                        onClick={() => setFormData({ email: 'miembro@codes.unlu.edu.ar', password: 'miembro123' })}
                      >
                        Llenar Miembro
                      </Button>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
