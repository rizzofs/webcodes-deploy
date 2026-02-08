
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import activitiesService from '../services/activitiesService';
import './DashboardCRUD.css';

const ActivitiesManagement = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    image_url: '',
    registration_link: ''
  });

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await activitiesService.getAll();
      setActivities(data);
    } catch (err) {
      console.error('Error loading activities:', err);
      setError('Error al cargar actividades');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      date: '',
      location: '',
      image_url: '',
      registration_link: ''
    });
    setError('');
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      date: item.date ? new Date(item.date).toISOString().slice(0, 16) : '', // Format for datetime-local
      location: item.location || '',
      image_url: item.image_url || '',
      registration_link: item.registration_link || ''
    });
    setError('');
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSave = {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : null
      };

      if (editingItem) {
        await activitiesService.update(editingItem.id, dataToSave);
      } else {
        await activitiesService.create(dataToSave);
      }
      setShowModal(false);
      loadActivities();
    } catch (err) {
      console.error('Error saving activity:', err);
      setError('Error al guardar la actividad');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta actividad?')) {
      try {
        await activitiesService.delete(id);
        loadActivities();
      } catch (err) {
        console.error('Error deleting activity:', err);
        setError('Error al eliminar');
      }
    }
  };

  if (loading) {
    return (
      <div className="crud-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando actividades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="crud-management">
      <div className="crud-header">
        <div className="header-content">
          <h2>Gestión de Actividades</h2>
          <p>Organiza los próximos eventos y actividades</p>
        </div>
        <Button variant="primary" onClick={handleCreate} className="create-btn">
          <i className="fas fa-plus me-2"></i>
          Nueva Actividad
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col lg={8}>
          <Card className="table-card">
            <Card.Header>
              <h5 className="card-title">
                <i className="fas fa-calendar-alt me-2"></i>
                Listado
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="crud-table">
                  <thead>
                    <tr>
                      <th>Título / Lugar</th>
                      <th>Fecha</th>
                      <th>Inscripción</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="item-title">{item.title}</div>
                          <div className="item-subtitle">{item.location}</div>
                        </td>
                        <td>
                          {item.date ? new Date(item.date).toLocaleString() : 'Sin fecha'}
                        </td>
                        <td>
                           {item.registration_link ? (
                             <a href={item.registration_link} target="_blank" rel="noopener noreferrer">Link</a>
                           ) : '-'}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEdit(item)}
                              className="action-btn"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(item.id)}
                              className="action-btn"
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {activities.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          No hay actividades registradas.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="stats-card">
            <Card.Header>
              <h5 className="card-title">
                <i className="fas fa-chart-pie me-2"></i>
                Estadísticas
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{activities.length}</div>
                  <div className="stat-label">Total</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? 'Editar Actividad' : 'Nueva Actividad'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Título</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                 <Form.Group className="mb-3">
                  <Form.Label>Fecha y Hora</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Lugar</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>URL Imagen</Form.Label>
              <Form.Control
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Link de Inscripción</Form.Label>
              <Form.Control
                type="text"
                name="registration_link"
                value={formData.registration_link}
                onChange={handleInputChange}
                placeholder="https://..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
              />
            </Form.Group>

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" type="submit">Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default ActivitiesManagement;
