import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Badge, Modal, Form, Alert } from 'react-bootstrap';
import './BlogManagement.css';

const BlogManagement = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    tags: '',
    featured: false,
    status: 'draft'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    // Simular carga de posts
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockPosts = [
      {
        id: 1,
        title: 'Nuevo Plan de Estudios 2025',
        excerpt: 'Conocé todos los cambios y mejoras en el plan de estudios...',
        category: 'Académico',
        status: 'published',
        featured: true,
        author: 'Admin',
        createdAt: '2025-01-15',
        views: 245,
        tags: ['Plan de Estudios', 'Académico', '2025']
      },
      {
        id: 2,
        title: 'Hackathon Virtual 2025 - Resultados',
        excerpt: 'Los equipos ganadores del Hackathon Virtual 2025...',
        category: 'Eventos',
        status: 'published',
        featured: false,
        author: 'Editor',
        createdAt: '2025-01-10',
        views: 189,
        tags: ['Hackathon', 'Programación', 'Competencia']
      },
      {
        id: 3,
        title: 'Nuevos Recursos de Estudio Disponibles',
        excerpt: 'Hemos agregado nuevos materiales de estudio...',
        category: 'Recursos',
        status: 'draft',
        featured: false,
        author: 'Editor',
        createdAt: '2025-01-08',
        views: 0,
        tags: ['Recursos', 'Estudio', 'Biblioteca']
      }
    ];
    
    setPosts(mockPosts);
    setLoading(false);
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      category: '',
      tags: '',
      featured: false,
      status: 'draft'
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEditPost = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content || '',
      category: post.category,
      tags: post.tags.join(', '),
      featured: post.featured,
      status: post.status
    });
    setErrors({});
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = 'El extracto es requerido';
    }

    if (!formData.category) {
      newErrors.category = 'La categoría es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const postData = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      author: 'Usuario Actual',
      createdAt: editingPost ? editingPost.createdAt : new Date().toISOString().split('T')[0],
      views: editingPost ? editingPost.views : 0
    };

    if (editingPost) {
      // Actualizar post existente
      setPosts(prev => prev.map(post => 
        post.id === editingPost.id ? { ...post, ...postData } : post
      ));
    } else {
      // Crear nuevo post
      const newPost = {
        id: Date.now(),
        ...postData
      };
      setPosts(prev => [newPost, ...prev]);
    }

    setShowModal(false);
  };

  const handleDeletePost = (postId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este post?')) {
      setPosts(prev => prev.filter(post => post.id !== postId));
    }
  };

  const handleStatusChange = (postId, newStatus) => {
    setPosts(prev => prev.map(post => 
      post.id === postId ? { ...post, status: newStatus } : post
    ));
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { variant: 'success', text: 'Publicado' },
      draft: { variant: 'warning', text: 'Borrador' },
      archived: { variant: 'secondary', text: 'Archivado' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const getCategoryBadge = (category) => {
    const categoryColors = {
      'Académico': 'primary',
      'Eventos': 'info',
      'Recursos': 'success',
      'Comunidad': 'warning'
    };
    
    return <Badge bg={categoryColors[category] || 'secondary'}>{category}</Badge>;
  };

  if (loading) {
    return (
      <div className="blog-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="blog-management">
      <div className="blog-header">
        <div className="header-content">
          <h2>Gestión de Blog</h2>
          <p>Administra los posts y contenido del blog</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleCreatePost}
          className="create-btn"
        >
          <i className="fas fa-plus me-2"></i>
          Nuevo Post
        </Button>
      </div>

      <Row>
        <Col lg={8}>
          <Card className="posts-table-card">
            <Card.Header>
              <h5 className="card-title">
                <i className="fas fa-list me-2"></i>
                Lista de Posts
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="posts-table">
                  <thead>
                    <tr>
                      <th>Título</th>
                      <th>Categoría</th>
                      <th>Estado</th>
                      <th>Autor</th>
                      <th>Vistas</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map(post => (
                      <tr key={post.id}>
                        <td>
                          <div className="post-title">
                            {post.featured && <i className="fas fa-star featured-icon"></i>}
                            {post.title}
                          </div>
                          <div className="post-excerpt">{post.excerpt}</div>
                        </td>
                        <td>{getCategoryBadge(post.category)}</td>
                        <td>{getStatusBadge(post.status)}</td>
                        <td>{post.author}</td>
                        <td>{post.views}</td>
                        <td>
                          <div className="action-buttons">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEditPost(post)}
                              className="action-btn"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleStatusChange(post.id, 'published')}
                              className="action-btn"
                              disabled={post.status === 'published'}
                            >
                              <i className="fas fa-check"></i>
                            </Button>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => handleStatusChange(post.id, 'draft')}
                              className="action-btn"
                              disabled={post.status === 'draft'}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeletePost(post.id)}
                              className="action-btn"
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="blog-stats-card">
            <Card.Header>
              <h5 className="card-title">
                <i className="fas fa-chart-bar me-2"></i>
                Estadísticas
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{posts.length}</div>
                  <div className="stat-label">Total Posts</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{posts.filter(p => p.status === 'published').length}</div>
                  <div className="stat-label">Publicados</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{posts.filter(p => p.status === 'draft').length}</div>
                  <div className="stat-label">Borradores</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{posts.reduce((sum, p) => sum + p.views, 0)}</div>
                  <div className="stat-label">Vistas Totales</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para crear/editar post */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingPost ? 'Editar Post' : 'Nuevo Post'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row>
              <Col md={8}>
                <Form.Group className="mb-3">
                  <Form.Label>Título *</Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    isInvalid={!!errors.title}
                    placeholder="Título del post"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.title}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Categoría *</Form.Label>
                  <Form.Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    isInvalid={!!errors.category}
                  >
                    <option value="">Seleccionar</option>
                    <option value="Académico">Académico</option>
                    <option value="Eventos">Eventos</option>
                    <option value="Recursos">Recursos</option>
                    <option value="Comunidad">Comunidad</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    {errors.category}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Extracto *</Form.Label>
              <Form.Control
                as="textarea"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                isInvalid={!!errors.excerpt}
                rows={3}
                placeholder="Breve descripción del post"
              />
              <Form.Control.Feedback type="invalid">
                {errors.excerpt}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contenido</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={6}
                placeholder="Contenido completo del post"
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tags</Form.Label>
                  <Form.Control
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    placeholder="tag1, tag2, tag3"
                  />
                  <Form.Text className="text-muted">
                    Separar tags con comas
                  </Form.Text>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    <option value="draft">Borrador</option>
                    <option value="published">Publicado</option>
                    <option value="archived">Archivado</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleInputChange}
                label="Post destacado"
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editingPost ? 'Actualizar' : 'Crear'} Post
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default BlogManagement;
