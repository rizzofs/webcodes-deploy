import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { useDiscordData } from '../hooks/useDiscordData';
import './DiscordLive.css';

const DiscordLive = () => {
  const { serverStats, channels, loading, error, refreshData } = useDiscordData();
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [recentMessages, setRecentMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // Simular mensajes recientes (en una implementación real, esto vendría de la API)
  const mockMessages = [
    {
      id: 1,
      author: 'Juan Pérez',
      content: '¿Alguien tiene el ejercicio 3 de la práctica?',
      timestamp: '2024-01-15T10:30:00Z',
      channel: 'introduccion-programacion'
    },
    {
      id: 2,
      author: 'María García',
      content: 'Sí, te lo paso por aquí',
      timestamp: '2024-01-15T10:32:00Z',
      channel: 'introduccion-programacion'
    },
    {
      id: 3,
      author: 'Carlos López',
      content: '¿Cuándo es el parcial de Matemática?',
      timestamp: '2024-01-15T09:15:00Z',
      channel: 'matematica-discreta'
    },
    {
      id: 4,
      author: 'Ana Martínez',
      content: 'El 25 de enero, según el calendario',
      timestamp: '2024-01-15T09:18:00Z',
      channel: 'matematica-discreta'
    }
  ];

  useEffect(() => {
    if (selectedChannel) {
      setMessagesLoading(true);
      // Simular carga de mensajes
      setTimeout(() => {
        const channelMessages = mockMessages.filter(msg => 
          msg.channel === selectedChannel.toLowerCase().replace(/\s+/g, '-')
        );
        setRecentMessages(channelMessages);
        setMessagesLoading(false);
      }, 1000);
    }
  }, [selectedChannel]);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getChannelIcon = (channelName) => {
    if (channelName.includes('programacion') || channelName.includes('programming')) {
      return 'fas fa-code';
    } else if (channelName.includes('matematica') || channelName.includes('math')) {
      return 'fas fa-calculator';
    } else if (channelName.includes('fisica') || channelName.includes('physics')) {
      return 'fas fa-atom';
    } else if (channelName.includes('quimica') || channelName.includes('chemistry')) {
      return 'fas fa-flask';
    } else {
      return 'fas fa-book';
    }
  };

  const getActivityStatus = (channelName) => {
    // Simular estado de actividad basado en el nombre del canal
    const activeChannels = ['introduccion-programacion', 'matematica-discreta'];
    const channelKey = channelName.toLowerCase().replace(/\s+/g, '-');
    return activeChannels.includes(channelKey);
  };

  if (loading) {
    return (
      <div className="discord-loading">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3">Conectando con Discord...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="discord-error">
        <i className="fab fa-discord me-2"></i>
        <strong>Error de conexión:</strong> {error}
        <Button 
          variant="outline-primary" 
          size="sm" 
          className="ms-3"
          onClick={refreshData}
        >
          <i className="fas fa-redo me-1"></i>
          Reintentar
        </Button>
      </Alert>
    );
  }

  return (
    <div className="discord-live">
      <Container fluid>
        {/* Header con estadísticas mejorado */}
        <Row className="mb-5">
          <Col>
            <Card className="discord-header-card">
              <Card.Body className="p-4">
                <div className="discord-header">
                  <div className="discord-server-info">
                    <div className="server-icon">
                      <i className="fab fa-discord"></i>
                    </div>
                    <div className="server-details">
                      <h2 className="server-name">
                        {serverStats?.serverName || 'CODES++ Discord'}
                      </h2>
                      <p className="server-description">
                        Servidor de estudio y colaboración académica
                      </p>
                      <div className="server-status">
                        <span className="status-indicator online"></span>
                        <span className="status-text">Servidor Activo</span>
                      </div>
                    </div>
                  </div>
                  <div className="discord-stats">
                    <div className="stat-item">
                      <div className="stat-icon">
                        <i className="fas fa-users"></i>
                      </div>
                      <div className="stat-content">
                        <span className="stat-number">{serverStats?.totalMembers || '150'}</span>
                        <span className="stat-label">Miembros</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-icon">
                        <i className="fas fa-comments"></i>
                      </div>
                      <div className="stat-content">
                        <span className="stat-number">{serverStats?.textChannels || '12'}</span>
                        <span className="stat-label">Canales</span>
                      </div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-icon">
                        <i className="fas fa-microphone"></i>
                      </div>
                      <div className="stat-content">
                        <span className="stat-number">{serverStats?.voiceChannels || '4'}</span>
                        <span className="stat-label">Voz</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* Lista de canales */}
          <Col md={4}>
            <Card className="channels-card">
              <Card.Header>
                <h5 className="card-title">
                  <i className="fas fa-hashtag me-2"></i>
                  Canales de Estudio
                </h5>
              </Card.Header>
              <Card.Body className="channels-list">
                {channels && channels.length > 0 ? (
                  channels.map((channel, index) => (
                    <div
                      key={index}
                      className={`channel-item ${selectedChannel === channel.name ? 'active' : ''}`}
                      onClick={() => setSelectedChannel(channel.name)}
                    >
                      <div className="channel-icon">
                        <i className={getChannelIcon(channel.name)}></i>
                      </div>
                      <div className="channel-info">
                        <div className="channel-name">{channel.name}</div>
                        <div className="channel-meta">
                          {getActivityStatus(channel.name) ? (
                            <Badge bg="success" className="activity-badge">
                              <i className="fas fa-circle me-1"></i>
                              Activo
                            </Badge>
                          ) : (
                            <Badge bg="secondary" className="activity-badge">
                              <i className="fas fa-circle me-1"></i>
                              Inactivo
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="no-channels">
                    <i className="fas fa-exclamation-circle"></i>
                    <p>No se pudieron cargar los canales</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          {/* Mensajes recientes */}
          <Col md={8}>
            <Card className="messages-card">
              <Card.Header>
                <h5 className="card-title">
                  <i className="fas fa-comments me-2"></i>
                  {selectedChannel ? `#${selectedChannel}` : 'Selecciona un canal'}
                </h5>
                {selectedChannel && (
                  <Button 
                    variant="outline-primary" 
                    size="sm"
                    onClick={() => window.open(`https://discord.com/channels/${process.env.REACT_APP_DISCORD_SERVER_ID}`, '_blank')}
                  >
                    <i className="fab fa-discord me-1"></i>
                    Abrir en Discord
                  </Button>
                )}
              </Card.Header>
              <Card.Body className="messages-list">
                {selectedChannel ? (
                  messagesLoading ? (
                    <div className="messages-loading">
                      <Spinner animation="border" size="sm" />
                      <span className="ms-2">Cargando mensajes...</span>
                    </div>
                  ) : recentMessages.length > 0 ? (
                    recentMessages.map((message) => (
                      <div key={message.id} className="message-item">
                        <div className="message-avatar">
                          <i className="fas fa-user"></i>
                        </div>
                        <div className="message-content">
                          <div className="message-header">
                            <span className="message-author">{message.author}</span>
                            <span className="message-time">{formatTime(message.timestamp)}</span>
                          </div>
                          <div className="message-text">{message.content}</div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="no-messages">
                      <i className="fas fa-comment-slash"></i>
                      <p>No hay mensajes recientes en este canal</p>
                    </div>
                  )
                ) : (
                  <div className="select-channel">
                    <i className="fas fa-mouse-pointer"></i>
                    <p>Selecciona un canal para ver los mensajes recientes</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Acciones rápidas */}
        <Row className="mt-4">
          <Col>
            <Card className="quick-actions-card">
              <Card.Body>
                <h5 className="card-title">
                  <i className="fas fa-bolt me-2"></i>
                  Acciones Rápidas
                </h5>
                <div className="quick-actions">
                  <Button 
                    variant="primary" 
                    className="action-btn"
                    onClick={() => window.open('https://discord.gg/rDtEx4dMvD', '_blank')}
                  >
                    <i className="fab fa-discord me-2"></i>
                    Unirse al Servidor
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    className="action-btn"
                    onClick={refreshData}
                  >
                    <i className="fas fa-sync-alt me-2"></i>
                    Actualizar Datos
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    className="action-btn"
                    onClick={() => window.open('/grupos', '_blank')}
                  >
                    <i className="fas fa-users me-2"></i>
                    Ver Grupos de Estudio
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DiscordLive;
