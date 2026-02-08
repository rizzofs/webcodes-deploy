import React, { useState, useEffect } from 'react';
import { Row, Col, Card, ProgressBar, Badge, Button } from 'react-bootstrap';
import './DashboardStats.css';

const DashboardStats = () => {
  const [stats, setStats] = useState({
    totalPosts: 0,
    publishedPosts: 0,
    draftPosts: 0,
    totalUsers: 0,
    activeUsers: 0,
    totalViews: 0,
    monthlyViews: 0,
    discordMembers: 0,
    discordChannels: 0,
    engagement: 0
  });

  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7d');

  useEffect(() => {
    // Simular carga de estadísticas
    const loadStats = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStats({
        totalPosts: 24,
        publishedPosts: 18,
        draftPosts: 6,
        totalUsers: 156,
        activeUsers: 89,
        totalViews: 12450,
        monthlyViews: 3240,
        discordMembers: 150,
        discordChannels: 12,
        engagement: 82
      });
      
      setLoading(false);
    };

    loadStats();
  }, [timeRange]);

  const statCards = [
    {
      title: 'Total de Posts',
      value: stats.totalPosts,
      icon: 'fas fa-newspaper',
      color: 'primary',
      change: '+12%',
      changeType: 'positive',
      trend: 'up',
      description: 'Contenido publicado',
      link: '#blog'
    },
    {
      title: 'Posts Publicados',
      value: stats.publishedPosts,
      icon: 'fas fa-check-circle',
      color: 'success',
      change: '+8%',
      changeType: 'positive',
      trend: 'up',
      description: 'Disponibles públicamente',
      link: '#blog'
    },
    {
      title: 'Borradores',
      value: stats.draftPosts,
      icon: 'fas fa-edit',
      color: 'warning',
      change: '+3%',
      changeType: 'positive',
      trend: 'up',
      description: 'En desarrollo',
      link: '#blog'
    },
    {
      title: 'Usuarios Activos',
      value: stats.activeUsers,
      icon: 'fas fa-users',
      color: 'info',
      change: '+15%',
      changeType: 'positive',
      trend: 'up',
      description: 'Últimos 30 días',
      link: '#members'
    },
    {
      title: 'Vistas Totales',
      value: stats.totalViews.toLocaleString(),
      icon: 'fas fa-eye',
      color: 'secondary',
      change: '+22%',
      changeType: 'positive',
      trend: 'up',
      description: 'Desde el inicio',
      link: '#analytics'
    },
    {
      title: 'Discord Members',
      value: stats.discordMembers,
      icon: 'fab fa-discord',
      color: 'discord',
      change: '+5%',
      changeType: 'positive',
      trend: 'up',
      description: 'Servidor activo',
      link: '#discord'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      action: 'Nuevo post publicado',
      description: 'Plan de Estudios 2025',
      user: 'Admin',
      time: 'Hace 2 horas',
      type: 'success',
      icon: 'fas fa-plus-circle'
    },
    {
      id: 2,
      action: 'Usuario registrado',
      description: 'nuevo.miembro@unlu.edu.ar',
      user: 'Sistema',
      time: 'Hace 4 horas',
      type: 'info',
      icon: 'fas fa-user-plus'
    },
    {
      id: 3,
      action: 'Post actualizado',
      description: 'Hackathon Virtual 2025',
      user: 'Editor',
      time: 'Hace 6 horas',
      type: 'warning',
      icon: 'fas fa-edit'
    },
    {
      id: 4,
      action: 'Comentario moderado',
      description: 'En post de Recursos',
      user: 'Admin',
      time: 'Hace 8 horas',
      type: 'primary',
      icon: 'fas fa-shield-alt'
    },
    {
      id: 5,
      action: 'Nuevo miembro Discord',
      description: 'Se unió al servidor',
      user: 'Discord Bot',
      time: 'Hace 12 horas',
      type: 'discord',
      icon: 'fab fa-discord'
    }
  ];

  const quickActions = [
    {
      title: 'Crear Post',
      icon: 'fas fa-plus',
      color: 'primary',
      action: () => console.log('Crear post')
    },
    {
      title: 'Ver Discord',
      icon: 'fab fa-discord',
      color: 'discord',
      action: () => console.log('Ver Discord')
    },
    {
      title: 'Gestionar Usuarios',
      icon: 'fas fa-users-cog',
      color: 'info',
      action: () => console.log('Gestionar usuarios')
    },
    {
      title: 'Configuración',
      icon: 'fas fa-cog',
      color: 'secondary',
      action: () => console.log('Configuración')
    }
  ];

  if (loading) {
    return (
      <div className="stats-loading">
        <div className="loading-container">
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
          </div>
          <h4>Cargando estadísticas...</h4>
          <p>Obteniendo datos actualizados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-stats">
      {/* Header con controles */}
      <div className="stats-header">
        <div className="stats-title-section">
          <h2 className="stats-main-title">Panel de Control</h2>
          <p className="stats-subtitle">Resumen de actividad y métricas clave</p>
        </div>
        <div className="stats-controls">
          <div className="time-range-selector">
            <Button 
              variant={timeRange === '7d' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setTimeRange('7d')}
            >
              7 días
            </Button>
            <Button 
              variant={timeRange === '30d' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setTimeRange('30d')}
            >
              30 días
            </Button>
            <Button 
              variant={timeRange === '90d' ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => setTimeRange('90d')}
            >
              90 días
            </Button>
          </div>
        </div>
      </div>

      {/* Tarjetas de estadísticas */}
      <Row className="mb-5">
        {statCards.map((card, index) => (
          <Col lg={4} md={6} key={index} className="mb-4">
            <a href={card.link} className="stat-card-link">
              <Card className={`stat-card stat-${card.color} h-100`}>
                <Card.Body className="p-4">
                  <div className="stat-header">
                    <div className="stat-icon">
                      <i className={card.icon}></i>
                    </div>
                    <div className={`stat-change stat-change-${card.changeType}`}>
                      <i className={`fas fa-arrow-${card.trend}`}></i>
                      {card.change}
                    </div>
                  </div>
                  <div className="stat-content">
                    <h3 className="stat-value">{card.value}</h3>
                    <p className="stat-title">{card.title}</p>
                    <p className="stat-description">{card.description}</p>
                  </div>
                  <div className="stat-footer">
                    <Badge bg="light" text="dark" className="stat-badge">
                      {timeRange === '7d' ? 'Última semana' : timeRange === '30d' ? 'Último mes' : 'Últimos 3 meses'}
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </a>
          </Col>
        ))}
      </Row>

      <Row>
        {/* Actividad Reciente */}
        <Col lg={8} className="mb-4">
          <Card className="activity-card h-100">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h5 className="card-title mb-0">
                <i className="fas fa-history me-2"></i>
                Actividad Reciente
              </h5>
              <Button variant="outline-primary" size="sm">
                Ver todo
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="activity-list">
                {recentActivity.map(activity => (
                  <div key={activity.id} className="activity-item">
                    <div className={`activity-icon activity-${activity.type}`}>
                      <i className={activity.icon}></i>
                    </div>
                    <div className="activity-content">
                      <div className="activity-action">{activity.action}</div>
                      <div className="activity-description">{activity.description}</div>
                      <div className="activity-meta">
                        <span className="activity-user">
                          <i className="fas fa-user me-1"></i>
                          {activity.user}
                        </span>
                        <span className="activity-time">
                          <i className="fas fa-clock me-1"></i>
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Columna derecha */}
        <Col lg={4} className="mb-4">
          {/* Progreso del Mes */}
          <Card className="progress-card mb-4">
            <Card.Header>
              <h5 className="card-title mb-0">
                <i className="fas fa-chart-pie me-2"></i>
                Progreso del Mes
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="progress-item">
                <div className="progress-label">
                  <span>Posts Publicados</span>
                  <span>75%</span>
                </div>
                <ProgressBar now={75} variant="success" className="progress-bar-custom" />
              </div>
              
              <div className="progress-item">
                <div className="progress-label">
                  <span>Usuarios Activos</span>
                  <span>57%</span>
                </div>
                <ProgressBar now={57} variant="info" className="progress-bar-custom" />
              </div>
              
              <div className="progress-item">
                <div className="progress-label">
                  <span>Engagement</span>
                  <span>82%</span>
                </div>
                <ProgressBar now={82} variant="warning" className="progress-bar-custom" />
              </div>
            </Card.Body>
          </Card>

          {/* Acciones Rápidas */}
          <Card className="quick-actions-card">
            <Card.Header>
              <h5 className="card-title mb-0">
                <i className="fas fa-bolt me-2"></i>
                Acciones Rápidas
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="quick-actions-grid">
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant={`outline-${action.color}`}
                    className={`quick-action-btn action-${action.color}`}
                    onClick={action.action}
                  >
                    <i className={`${action.icon} me-2`}></i>
                    {action.title}
                  </Button>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardStats;