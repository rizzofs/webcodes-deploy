
import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Badge, Modal, Form, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import newsService from '../services/newsService';
import './DashboardCRUD.css';

const NewsManagement = () => {
  const { user } = useAuth();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    image_url: '',
    category: 'Noticia',
    published: false
  });

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = async () => {
    try {
      setLoading(true);
      const data = await newsService.getAll(false); // Obtener todas, incluso no publicadas
      setNews(data);
    } catch (err) {
      if (err.name === 'AbortError' || err.message?.includes('AbortError')) return;
      console.error('Error loading news:', err);
      setError('Error al cargar las noticias');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      image_url: '',
      published: false,
      category: 'Noticia'
    });
    setError('');
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt || '',
      content: item.content || '',
      image_url: item.image_url || '',
      published: item.published,
      category: item.category || 'Noticia' // Default category
    });
    setError('');
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Auto-generate slug from title if creating new
    if (name === 'title' && !editingItem) {
      const slug = value.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = (e) => {
    // Break out of React event loop
    if (e && e.preventDefault) e.preventDefault();
    
    setTimeout(async () => {
        try {
          if (editingItem) {
            await newsService.update(editingItem.id, {
              ...formData,
              // author_id no debería cambiar
            });
          } else {
            console.log('Sending data:', formData);
            await newsService.create({
              ...formData,
              author_id: user.id
            });
          }
          setShowModal(false);
          loadNews();
        } catch (err) {
          console.error('Error saving news:', err);
          // Show full error details
          setError(`Error: ${err.message || JSON.stringify(err)}`);
        }
    }, 100);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta noticia?')) {
      try {
        await newsService.delete(id);
        loadNews();
      } catch (err) {
        console.error('Error deleting news:', err);
        setError('Error al eliminar');
      }
    }
  };

  const getStatusBadge = (published) => {
    return published 
      ? <Badge bg="success">Publicado</Badge> 
      : <Badge bg="warning" text="dark">Borrador</Badge>;
  };

  if (loading) {
    return (
      <div className="crud-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando noticias...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="crud-management">
      <div className="crud-header">
        <div className="header-content">
          <h2>Gestión de Noticias</h2>
          <p>Administra las novedades y artículos del sitio</p>
        </div>
        <Button variant="primary" onClick={handleCreate} className="create-btn">
          <i className="fas fa-plus me-2"></i>
          Nueva Noticia
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Row>
        <Col lg={8}>
          <Card className="table-card">
            <Card.Header>
              <h5 className="card-title">
                <i className="fas fa-list me-2"></i>
                Listado
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="crud-table">
                  <thead>
                    <tr>
                      <th>Título / Slug</th>
                      <th>Estado</th>
                      <th>Autor</th>
                      <th>Fecha</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {news.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="item-title">{item.title}</div>
                          <div className="item-subtitle">{item.slug}</div>
                        </td>
                        <td>{getStatusBadge(item.published)}</td>
                        <td>
                           {item.author?.full_name || 'Desconocido'}
                        </td>
                        <td>{new Date(item.created_at).toLocaleDateString()}</td>
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
                    {news.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center py-4">
                          No hay noticias registradas.
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
                <i className="fas fa-chart-bar me-2"></i>
                Estadísticas
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{news.length}</div>
                  <div className="stat-label">Total</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{news.filter(n => n.published).length}</div>
                  <div className="stat-label">Publicadas</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingItem ? 'Editar Noticia' : 'Nueva Noticia'}</Modal.Title>
        </Modal.Header>
        <Form>
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
              <Form.Label>Slug (URL amigable)</Form.Label>
              <Form.Control
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleInputChange}
                required
              />
              <Form.Text className="text-muted">
                Identificador único para la URL.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Extracto</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
              >
                <option value="Noticia">Noticia</option>
                <option value="Charla">Charla</option>
                <option value="Evento">Evento</option>
                <option value="Aviso">Aviso</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>URL Imagen</Form.Label>
              <Form.Control
                type="text"
                name="image_url"
                value={formData.image_url}
                onChange={handleInputChange}
                placeholder="https://..."
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contenido (HTML/Markdown)</Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                name="content"
                value={formData.content}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Form.Check 
              type="checkbox"
              label="Publicar inmediatamente"
              name="published"
              checked={formData.published}
              onChange={handleInputChange}
              className="mb-3"
            />

          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
            <Button variant="primary" type="button" onClick={handleSubmit}>Guardar</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default NewsManagement;
