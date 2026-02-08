import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Badge, Modal, Form, Alert } from 'react-bootstrap';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member',
    status: 'active'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    // Simular carga de usuarios
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUsers = [
      {
        id: 1,
        name: 'Administrador CODES++',
        email: 'admin@codes.unlu.edu.ar',
        role: 'admin',
        status: 'active',
        lastLogin: '2025-01-15',
        createdAt: '2022-01-01',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 2,
        name: 'Editor de Contenido',
        email: 'editor@codes.unlu.edu.ar',
        role: 'editor',
        status: 'active',
        lastLogin: '2025-01-14',
        createdAt: '2022-06-15',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 3,
        name: 'Miembro CODES++',
        email: 'miembro@codes.unlu.edu.ar',
        role: 'member',
        status: 'active',
        lastLogin: '2025-01-13',
        createdAt: '2023-03-10',
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
      },
      {
        id: 4,
        name: 'Juan Pérez',
        email: 'juan.perez@unlu.edu.ar',
        role: 'member',
        status: 'inactive',
        lastLogin: '2024-12-20',
        createdAt: '2023-09-01',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
      }
    ];
    
    setUsers(mockUsers);
    setLoading(false);
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'member',
      status: 'active'
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setErrors({});
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const userData = {
      ...formData,
      lastLogin: editingUser ? editingUser.lastLogin : 'Nunca',
      createdAt: editingUser ? editingUser.createdAt : new Date().toISOString().split('T')[0],
      avatar: editingUser ? editingUser.avatar : 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    };

    if (editingUser) {
      // Actualizar usuario existente
      setUsers(prev => prev.map(user => 
        user.id === editingUser.id ? { ...user, ...userData } : user
      ));
    } else {
      // Crear nuevo usuario
      const newUser = {
        id: Date.now(),
        ...userData
      };
      setUsers(prev => [newUser, ...prev]);
    }

    setShowModal(false);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      setUsers(prev => prev.filter(user => user.id !== userId));
    }
  };

  const handleStatusChange = (userId, newStatus) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status: newStatus } : user
    ));
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { variant: 'danger', text: 'Administrador' },
      editor: { variant: 'warning', text: 'Editor' },
      member: { variant: 'info', text: 'Miembro' }
    };
    
    const config = roleConfig[role] || { variant: 'secondary', text: role };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { variant: 'success', text: 'Activo' },
      inactive: { variant: 'secondary', text: 'Inactivo' },
      suspended: { variant: 'danger', text: 'Suspendido' }
    };
    
    const config = statusConfig[status] || { variant: 'secondary', text: status };
    return <Badge bg={config.variant}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <div className="user-loading">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <p>Cargando usuarios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="user-management">
      <div className="user-header">
        <div className="header-content">
          <h2>Gestión de Usuarios</h2>
          <p>Administra los miembros del centro de estudiantes</p>
        </div>
        <Button 
          variant="primary" 
          onClick={handleCreateUser}
          className="create-btn"
        >
          <i className="fas fa-user-plus me-2"></i>
          Nuevo Usuario
        </Button>
      </div>

      <Row>
        <Col lg={8}>
          <Card className="users-table-card">
            <Card.Header>
              <h5 className="card-title">
                <i className="fas fa-users me-2"></i>
                Lista de Usuarios
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="users-table">
                  <thead>
                    <tr>
                      <th>Usuario</th>
                      <th>Rol</th>
                      <th>Estado</th>
                      <th>Último Login</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user.id}>
                        <td>
                          <div className="user-info">
                            <img 
                              src={user.avatar} 
                              alt={user.name}
                              className="user-avatar"
                            />
                            <div className="user-details">
                              <div className="user-name">{user.name}</div>
                              <div className="user-email">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>{getRoleBadge(user.role)}</td>
                        <td>{getStatusBadge(user.status)}</td>
                        <td>{user.lastLogin}</td>
                        <td>
                          <div className="action-buttons">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              className="action-btn"
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() => handleStatusChange(user.id, 'active')}
                              className="action-btn"
                              disabled={user.status === 'active'}
                            >
                              <i className="fas fa-check"></i>
                            </Button>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => handleStatusChange(user.id, 'inactive')}
                              className="action-btn"
                              disabled={user.status === 'inactive'}
                            >
                              <i className="fas fa-pause"></i>
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
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
          <Card className="user-stats-card">
            <Card.Header>
              <h5 className="card-title">
                <i className="fas fa-chart-pie me-2"></i>
                Estadísticas
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="stats-grid">
                <div className="stat-item">
                  <div className="stat-number">{users.length}</div>
                  <div className="stat-label">Total Usuarios</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{users.filter(u => u.status === 'active').length}</div>
                  <div className="stat-label">Activos</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{users.filter(u => u.role === 'admin').length}</div>
                  <div className="stat-label">Administradores</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{users.filter(u => u.role === 'editor').length}</div>
                  <div className="stat-label">Editores</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{users.filter(u => u.role === 'member').length}</div>
                  <div className="stat-label">Miembros</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">{users.filter(u => u.status === 'inactive').length}</div>
                  <div className="stat-label">Inactivos</div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal para crear/editar usuario */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                isInvalid={!!errors.name}
                placeholder="Nombre del usuario"
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                isInvalid={!!errors.email}
                placeholder="usuario@email.com"
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Rol</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                  >
                    <option value="member">Miembro</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Administrador</option>
                  </Form.Select>
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
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                    <option value="suspended">Suspendido</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {editingUser ? 'Actualizar' : 'Crear'} Usuario
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
