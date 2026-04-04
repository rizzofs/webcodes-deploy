import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Badge, Spinner, Alert } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import './WorkshopManagement.css'; 

const WorkshopManagement = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadRegistrations();
  }, []);

  const loadRegistrations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workshop_registrations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRegistrations(data || []);
    } catch (err) {
      console.error('Error loading registrations:', err.message);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar esta inscripción?')) return;

    try {
      const { error } = await supabase
        .from('workshop_registrations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setRegistrations(prev => prev.filter(reg => reg.id !== id));
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const getTechLevelBadge = (level) => {
    const l = parseInt(level);
    if (l <= 2) return <Badge bg="info">Básico</Badge>;
    if (l <= 4) return <Badge bg="warning">Intermedio</Badge>;
    return <Badge bg="danger">Avanzado</Badge>;
  };

  if (loading) {
    return (
      <div className="workshop-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando inscriptos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="workshop-management">
      <div className="workshop-header">
        <div className="header-content">
          <h2>Inscriptos al Taller</h2>
          <p>Gestión de participantes para "Tu Código es tu CV"</p>
        </div>
        <Button onClick={loadRegistrations} className="refresh-btn">
          <i className="fas fa-sync-alt me-2"></i>
          Actualizar Lista
        </Button>
      </div>

      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

      <Row>
        <Col lg={12}>
          <Card className="workshop-table-card">
            <Card.Header>
              <h5 className="card-title">
                <i className="fas fa-users me-2 text-primary"></i>
                Lista de Inscriptos
                <Badge bg="primary" pill className="ms-3">
                  {registrations.length} Total
                </Badge>
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="workshop-table">
                  <thead>
                    <tr>
                      <th>Participante</th>
                      <th>Email</th>
                      <th>Sede</th>
                      <th>GitHub</th>
                      <th>Nivel Tech</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center py-5 text-muted">
                          <i className="fas fa-user-slash d-block mb-2 fs-2 opacity-50"></i>
                          No hay inscripciones registradas aún.
                        </td>
                      </tr>
                    ) : (
                      registrations.map((reg) => (
                        <tr key={reg.id}>
                          <td>
                            <div className="participant-info">
                              <span className="participant-name">{reg.full_name}</span>
                              <span className="registration-date">
                                <i className="far fa-calendar-alt me-1"></i>
                                {new Date(reg.created_at).toLocaleDateString('es-AR')}
                              </span>
                            </div>
                          </td>
                          <td>{reg.email}</td>
                          <td>
                            <Badge bg="secondary" className="opacity-75">{reg.campus}</Badge>
                          </td>
                          <td>
                            {reg.github_user ? (
                              <a 
                                href={`https://github.com/${reg.github_user.replace('@', '')}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-decoration-none d-flex align-items-center"
                              >
                                <i className="fab fa-github me-2 text-dark"></i>
                                {reg.github_user}
                              </a>
                            ) : (
                              <span className="text-muted small">No especificado</span>
                            )}
                          </td>
                          <td>{getTechLevelBadge(reg.tech_level)}</td>
                          <td className="text-center">
                            <Button
                              variant="link"
                              className="delete-btn"
                              onClick={() => handleDelete(reg.id)}
                              title="Eliminar inscripción"
                            >
                              <i className="fas fa-trash-alt"></i>
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default WorkshopManagement;
