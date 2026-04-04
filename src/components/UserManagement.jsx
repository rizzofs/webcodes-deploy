import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Table, Badge, Modal, Form, Alert, Spinner } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'member'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('full_name', { ascending: true });

      if (error) throw error;
      
      const mappedUsers = data.map(u => ({
        id: u.id,
        name: u.full_name || u.email?.split('@')[0] || 'Usuario',
        email: u.email || 'Sin email',
        role: u.role || 'member',
        createdAt: u.created_at ? new Date(u.created_at).toISOString().split('T')[0] : 'Desconocido',
        avatar: u.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.full_name || u.email || 'U')}&background=random`
      }));

      setUsers(mappedUsers);
    } catch (err) {
      console.error('Error loading users:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'member'
    });
    setErrors({});
    setShowModal(true);
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role
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

    try {
      setLoading(true);
      const profileData = {
        full_name: formData.name,
        email: formData.email,
        role: formData.role,
        avatar_url: editingUser ? editingUser.avatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`
      };

      if (editingUser) {
        // Actualizar usuario existente
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', editingUser.id);

        if (error) throw error;
      } else {
        // Para crear un usuario nuevo, técnicamente se requiere Auth. 
        // Pero si solo estamos creando el perfil (asumiendo que el ID se genera o se vincula):
        alert('La creación de usuarios debe realizarse a través del sistema de registro/auth para vincular el ID.');
        setLoading(false);
        return;
      }

      await loadUsers();
      setShowModal(false);
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario? (Esto no eliminará su cuenta de Auth, solo su perfil)')) {
      try {
        const { error } = await supabase
          .from('profiles')
          .delete()
          .eq('id', userId);
        
        if (error) throw error;
        await loadUsers();
      } catch (err) {
        alert('Error al eliminar: ' + err.message);
      }
    }
  };

  // No se implementa cambio de estado directo ya que no hay columna 'status' en la DB
  const handleStatusChange = () => {
    alert('Esta funcionalidad requiere una columna de estado en la base de datos.');
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

  if (loading && users.length === 0) {
    return (
      <div className="user-loading">
        <div className="loading-spinner">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Cargando usuarios reales...</p>
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
                      <th>Fecha Registro</th>
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
                        <td>{user.createdAt}</td>
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
              <Col md={12}>
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
