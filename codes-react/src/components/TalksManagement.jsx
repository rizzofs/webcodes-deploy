
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Modal, Form, Alert } from 'react-bootstrap';
import talksService from '../services/talksService';
import './DashboardCRUD.css';

const TalksManagement = () => {
  const [talks, setTalks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    speaker: '',
    description: '',
    date: '',
    video_url: '',
    image_url: ''
  });

  useEffect(() => {
    loadTalks();
  }, []);

  const loadTalks = async () => {
    try {
      setLoading(true);
      const data = await talksService.getAll();
      setTalks(data);
    } catch (err) {
      console.error('Error loading talks:', err);
      setError('Error al cargar charlas');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      speaker: '',
      description: '',
      date: '',
      video_url: '',
      image_url: ''
    });
    setError('');
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      speaker: item.speaker || '',
      description: item.description || '',
      date: item.date ? new Date(item.date).toISOString().slice(0, 16) : '',
      video_url: item.video_url || '',
      image_url: item.image_url || ''
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
        await talksService.update(editingItem.id, dataToSave);
      } else {
        await talksService.create(dataToSave);
      }
      setShowModal(false);
      loadTalks();
    } catch (err) {
      console.error('Error saving talk:', err);
      setError('Error al guardar la charla');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta charla?')) {
      try {
        await talksService.delete(id);
        loadTalks();
      } catch (err) {
        console.error('Error deleting talk:', err);
        setError('Error al eliminar');
      }
    }
  };

  if (loading) {
    return (
      <div className="crud-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando charlas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="crud-management">
      <div className="crud-header">
        <div className="header-content">
          <h2>Gestión de Charlas</h2>
          <p>Repositorio de charlas y conferencias grabadas</p>
        </div>
        <Button variant="primary" onClick={handleCreate} className="create-btn">
          <i className="fas fa-plus me-2"></i>
          Nueva Charla
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col lg={8}>
          <Card className="table-card">
            <Card.Header>
              <h5 className="card-title">
                <i className="fas fa-video me-2"></i>
                Listado
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="crud-table">
                  <thead>
                    <tr>
                      <th>Título / Orador</th>
                      <th>Fecha</th>
                      <th>URL Video</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {talks.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="item-title">{item.title}</div>
                          <div className="item-subtitle">{item.speaker}</div>
                        </td>
                        <td>
                          {item.date ? new Date(item.date).toLocaleDateString() : 'Sin fecha'}
                        </td>
                        <td>
                           {item.video_url ? (
                             <a href={item.video_url} target="_blank" rel="noopener noreferrer">Ver</a>
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
                    {talks.length === 0 && (
                      <tr>
                        <td colSpan="4" className="text-center py-4">
                          No hay charlas registradas.
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
                <i className="fas fa-chart-line me-2"></i>
                Estadísticas
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{talks.length}</div>
                  <div className="stat-label">Total</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? 'Editar Charla' : 'Nueva Charla'}</Modal.Title>
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

            <Form.Group className="mb-3">
              <Form.Label>Orador</Form.Label>
              <Form.Control
                type="text"
                name="speaker"
                value={formData.speaker}
                onChange={handleInputChange}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Fecha</Form.Label>
              <Form.Control
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL Video</Form.Label>
              <Form.Control
                type="text"
                name="video_url"
                value={formData.video_url}
                onChange={handleInputChange}
                placeholder="https://youtube.com/..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL Imagen (Carátula)</Form.Label>
              <Form.Control
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
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

export default TalksManagement;
