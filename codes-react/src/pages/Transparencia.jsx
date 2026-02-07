import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Tab, Nav, ProgressBar, Alert } from 'react-bootstrap';
import './Transparencia.css';

const Transparencia = () => {
  const [activeTab, setActiveTab] = useState('ingresos');

  // Datos de ingresos (ejemplo)
  const ingresos = {
    total: 125000,
    mensual: 15625,
    categorias: [
      { nombre: 'Cuotas de Socios', monto: 75000, porcentaje: 60, color: '#39c0c3' },
      { nombre: 'Eventos y Actividades', monto: 25000, porcentaje: 20, color: '#2a8a8d' },
      { nombre: 'Donaciones', monto: 15000, porcentaje: 12, color: '#17a2b8' },
      { nombre: 'Patrocinios', monto: 10000, porcentaje: 8, color: '#6f42c1' }
    ]
  };

  // Datos de gastos (ejemplo)
  const gastos = {
    total: 110000,
    mensual: 13750,
    categorias: [
      { nombre: 'Eventos y Actividades', monto: 45000, porcentaje: 41, color: '#39c0c3' },
      { nombre: 'Infraestructura Digital', monto: 25000, porcentaje: 23, color: '#2a8a8d' },
      { nombre: 'Materiales y Recursos', monto: 20000, porcentaje: 18, color: '#17a2b8' },
      { nombre: 'Administración', monto: 15000, porcentaje: 14, color: '#6f42c1' },
      { nombre: 'Reserva de Emergencia', monto: 5000, porcentaje: 4, color: '#28a745' }
    ]
  };

  // Proyectos financiados
  const proyectos = [
    {
      id: 1,
      nombre: 'Sistema de Gestión Académica',
      descripcion: 'Plataforma web para gestión de materias, horarios y recursos',
      monto: 35000,
      estado: 'Completado',
      fecha: '2024-01-15',
      beneficiarios: 1200,
      categoria: 'Infraestructura Digital'
    },
    {
      id: 2,
      nombre: 'Jornadas de Orientación Vocacional',
      descripcion: 'Eventos para ayudar a estudiantes a elegir carrera',
      monto: 15000,
      estado: 'En Progreso',
      fecha: '2024-03-01',
      beneficiarios: 500,
      categoria: 'Eventos y Actividades'
    },
    {
      id: 3,
      nombre: 'Biblioteca Digital',
      descripcion: 'Recursos digitales y materiales de estudio',
      monto: 20000,
      estado: 'Planificado',
      fecha: '2024-06-01',
      beneficiarios: 800,
      categoria: 'Materiales y Recursos'
    }
  ];

  // Datos de sorteos y concursos
  const sorteos = {
    totalRecaudado: 45000,
    totalGastado: 42000,
    balance: 3000,
    eventos: [
      {
        id: 1,
        nombre: 'Sorteo Cacic 2024 - Primera Edición',
        descripcion: 'Sorteo de tablets y accesorios tecnológicos para estudiantes',
        fechaInicio: '2024-01-15',
        fechaFin: '2024-02-15',
        recaudado: 25000,
        gastado: 23000,
        participantes: 450,
        premios: [
          { nombre: 'Tablet Samsung Galaxy Tab A8', valor: 15000, ganador: 'María González' },
          { nombre: 'Auriculares Sony WH-1000XM4', valor: 5000, ganador: 'Carlos López' },
          { nombre: 'Teclado Mecánico Logitech', valor: 3000, ganador: 'Ana Martínez' }
        ],
        estado: 'Finalizado',
        categoria: 'Tecnología'
      },
      {
        id: 2,
        nombre: 'Concurso de Programación CODES++',
        descripcion: 'Competencia de programación con premios en efectivo y cursos',
        fechaInicio: '2024-03-01',
        fechaFin: '2024-03-31',
        recaudado: 20000,
        gastado: 19000,
        participantes: 120,
        premios: [
          { nombre: 'Primer Premio - $10,000', valor: 10000, ganador: 'Diego Rodríguez' },
          { nombre: 'Segundo Premio - $5,000', valor: 5000, ganador: 'Laura Fernández' },
          { nombre: 'Tercer Premio - $4,000', valor: 4000, ganador: 'Pablo Sánchez' }
        ],
        estado: 'Finalizado',
        categoria: 'Educación'
      }
    ]
  };

  // Reportes financieros
  const reportes = [
    {
      periodo: 'Enero 2024',
      ingresos: 15625,
      gastos: 13750,
      balance: 1875,
      archivo: '/reportes/enero-2024.pdf'
    },
    {
      periodo: 'Febrero 2024',
      ingresos: 16200,
      gastos: 14200,
      balance: 2000,
      archivo: '/reportes/febrero-2024.pdf'
    },
    {
      periodo: 'Marzo 2024',
      ingresos: 15800,
      gastos: 13500,
      balance: 2300,
      archivo: '/reportes/marzo-2024.pdf'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Completado': return '#28a745';
      case 'En Progreso': return '#ffc107';
      case 'Planificado': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  return (
    <div className="transparencia-page">
      <div className="transparencia-hero">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h1 className="transparencia-title">
                <i className="fas fa-chart-line"></i>
                Transparencia Financiera
              </h1>
              <p className="transparencia-subtitle">
                Conoce cómo CODES utiliza los recursos para beneficiar a la comunidad estudiantil
              </p>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="transparencia-content">
        {/* Resumen Financiero */}
        <Row className="mb-5">
          <Col lg={4} className="mb-4">
            <Card className="summary-card ingresos-card">
              <Card.Body className="text-center">
                <i className="fas fa-arrow-up summary-icon"></i>
                <h3 className="summary-title">Ingresos Totales</h3>
                <p className="summary-amount">{formatCurrency(ingresos.total)}</p>
                <p className="summary-subtitle">Año 2024</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} className="mb-4">
            <Card className="summary-card gastos-card">
              <Card.Body className="text-center">
                <i className="fas fa-arrow-down summary-icon"></i>
                <h3 className="summary-title">Gastos Totales</h3>
                <p className="summary-amount">{formatCurrency(gastos.total)}</p>
                <p className="summary-subtitle">Año 2024</p>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4} className="mb-4">
            <Card className="summary-card balance-card">
              <Card.Body className="text-center">
                <i className="fas fa-balance-scale summary-icon"></i>
                <h3 className="summary-title">Balance</h3>
                <p className="summary-amount">{formatCurrency(ingresos.total - gastos.total)}</p>
                <p className="summary-subtitle">Ahorro para futuros proyectos</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Navegación por Pestañas */}
        <Row className="mb-4">
          <Col>
            <Nav variant="pills" className="transparencia-nav">
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'ingresos'} 
                  onClick={() => setActiveTab('ingresos')}
                >
                  <i className="fas fa-arrow-up"></i> Ingresos
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'gastos'} 
                  onClick={() => setActiveTab('gastos')}
                >
                  <i className="fas fa-arrow-down"></i> Gastos
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'proyectos'} 
                  onClick={() => setActiveTab('proyectos')}
                >
                  <i className="fas fa-project-diagram"></i> Proyectos
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'sorteos'} 
                  onClick={() => setActiveTab('sorteos')}
                >
                  <i className="fas fa-gift"></i> Sorteos
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link 
                  active={activeTab === 'reportes'} 
                  onClick={() => setActiveTab('reportes')}
                >
                  <i className="fas fa-file-alt"></i> Reportes
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
        </Row>

        {/* Contenido de las Pestañas */}
        <Tab.Content>
          {/* Pestaña Ingresos */}
          <Tab.Pane eventKey="ingresos" active={activeTab === 'ingresos'}>
            <Row>
              <Col lg={8}>
                <Card className="chart-card">
                  <Card.Header>
                    <h4><i className="fas fa-chart-pie"></i> Distribución de Ingresos</h4>
                  </Card.Header>
                  <Card.Body>
                    {ingresos.categorias.map((categoria, index) => (
                      <div key={index} className="category-item">
                        <div className="category-header">
                          <span className="category-name">{categoria.nombre}</span>
                          <span className="category-amount">{formatCurrency(categoria.monto)}</span>
                        </div>
                        <ProgressBar 
                          now={categoria.porcentaje} 
                          style={{ backgroundColor: categoria.color }}
                          className="category-progress"
                        />
                        <div className="category-percentage">{categoria.porcentaje}%</div>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card className="info-card">
                  <Card.Header>
                    <h5><i className="fas fa-info-circle"></i> Información</h5>
                  </Card.Header>
                  <Card.Body>
                    <p>Los ingresos de CODES provienen principalmente de:</p>
                    <ul className="info-list">
                      <li>Cuotas de socios mensuales</li>
                      <li>Eventos y actividades</li>
                      <li>Donaciones de la comunidad</li>
                      <li>Patrocinios de empresas</li>
                    </ul>
                    <Alert variant="info" className="mt-3">
                      <i className="fas fa-lightbulb"></i>
                      <strong>¿Sabías que?</strong> El 100% de los ingresos se destina a proyectos estudiantiles.
                    </Alert>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Pestaña Gastos */}
          <Tab.Pane eventKey="gastos" active={activeTab === 'gastos'}>
            <Row>
              <Col lg={8}>
                <Card className="chart-card">
                  <Card.Header>
                    <h4><i className="fas fa-chart-pie"></i> Distribución de Gastos</h4>
                  </Card.Header>
                  <Card.Body>
                    {gastos.categorias.map((categoria, index) => (
                      <div key={index} className="category-item">
                        <div className="category-header">
                          <span className="category-name">{categoria.nombre}</span>
                          <span className="category-amount">{formatCurrency(categoria.monto)}</span>
                        </div>
                        <ProgressBar 
                          now={categoria.porcentaje} 
                          style={{ backgroundColor: categoria.color }}
                          className="category-progress"
                        />
                        <div className="category-percentage">{categoria.porcentaje}%</div>
                      </div>
                    ))}
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card className="info-card">
                  <Card.Header>
                    <h5><i className="fas fa-info-circle"></i> Información</h5>
                  </Card.Header>
                  <Card.Body>
                    <p>Los gastos de CODES se distribuyen en:</p>
                    <ul className="info-list">
                      <li>Eventos y actividades estudiantiles</li>
                      <li>Infraestructura digital y tecnología</li>
                      <li>Materiales y recursos educativos</li>
                      <li>Gastos administrativos mínimos</li>
                      <li>Reserva para emergencias</li>
                    </ul>
                    <Alert variant="success" className="mt-3">
                      <i className="fas fa-check-circle"></i>
                      <strong>Transparencia Total:</strong> Todos los gastos están documentados y auditados.
                    </Alert>
                    <Alert variant="primary" className="mt-3">
                      <i className="fas fa-network-wired"></i>
                      <strong>Red de Colaboración:</strong>
                      <p className="mb-2 mt-2" style={{ fontSize: '0.9rem' }}>
                        Destinamos fondos para costear licencias de software profesional (JetBrains All Products Pack, Figma Pro, etc.) a estudiantes con proyectos destacados.
                      </p>
                      <p className="mb-0" style={{ fontSize: '0.9rem' }}>
                        <strong>¿Cómo funciona?</strong> Si tu proyecto es seleccionado, te costeamos la licencia por un año. Si tu proyecto prospera, podrás ayudar a otro estudiante, creando así una red de colaboración mutua donde todos nos apoyamos.
                      </p>
                    </Alert>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Pestaña Proyectos */}
          <Tab.Pane eventKey="proyectos" active={activeTab === 'proyectos'}>
            <Row>
              {proyectos.map((proyecto) => (
                <Col lg={4} key={proyecto.id} className="mb-4">
                  <Card className="project-card">
                    <Card.Header>
                      <div className="project-header">
                        <h5 className="project-title">{proyecto.nombre}</h5>
                        <span 
                          className="project-status"
                          style={{ backgroundColor: getEstadoColor(proyecto.estado) }}
                        >
                          {proyecto.estado}
                        </span>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <p className="project-description">{proyecto.descripcion}</p>
                      <div className="project-details">
                        <div className="project-detail">
                          <i className="fas fa-dollar-sign"></i>
                          <span>{formatCurrency(proyecto.monto)}</span>
                        </div>
                        <div className="project-detail">
                          <i className="fas fa-users"></i>
                          <span>{proyecto.beneficiarios} beneficiarios</span>
                        </div>
                        <div className="project-detail">
                          <i className="fas fa-tag"></i>
                          <span>{proyecto.categoria}</span>
                        </div>
                        <div className="project-detail">
                          <i className="fas fa-calendar"></i>
                          <span>{proyecto.fecha}</span>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tab.Pane>

          {/* Pestaña Sorteos */}
          <Tab.Pane eventKey="sorteos" active={activeTab === 'sorteos'}>
            <Row>
              <Col lg={8}>
                <Card className="sorteos-summary-card">
                  <Card.Header>
                    <h4><i className="fas fa-gift"></i> Resumen de Sorteos y Concursos</h4>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-4">
                      <Col md={4}>
                        <div className="sorteo-stat">
                          <i className="fas fa-arrow-up sorteos-icon ingresos"></i>
                          <h5>Total Recaudado</h5>
                          <p className="sorteo-amount">{formatCurrency(sorteos.totalRecaudado)}</p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="sorteo-stat">
                          <i className="fas fa-arrow-down sorteos-icon gastos"></i>
                          <h5>Total Gastado</h5>
                          <p className="sorteo-amount">{formatCurrency(sorteos.totalGastado)}</p>
                        </div>
                      </Col>
                      <Col md={4}>
                        <div className="sorteo-stat">
                          <i className="fas fa-balance-scale sorteos-icon balance"></i>
                          <h5>Balance</h5>
                          <p className="sorteo-amount">{formatCurrency(sorteos.balance)}</p>
                        </div>
                      </Col>
                    </Row>
                    
                    <div className="sorteos-events">
                      {sorteos.eventos.map((evento) => (
                        <Card key={evento.id} className="sorteo-event-card">
                          <Card.Header>
                            <div className="sorteo-event-header">
                              <div className="sorteo-event-info">
                                <h5 className="sorteo-event-title">{evento.nombre}</h5>
                                <p className="sorteo-event-description">{evento.descripcion}</p>
                                <div className="sorteo-event-meta">
                                  <span className="sorteo-meta-item">
                                    <i className="fas fa-calendar"></i>
                                    {evento.fechaInicio} - {evento.fechaFin}
                                  </span>
                                  <span className="sorteo-meta-item">
                                    <i className="fas fa-users"></i>
                                    {evento.participantes} participantes
                                  </span>
                                  <span className="sorteo-meta-item">
                                    <i className="fas fa-tag"></i>
                                    {evento.categoria}
                                  </span>
                                  <span className={`sorteo-status ${evento.estado.toLowerCase().replace(' ', '-')}`}>
                                    {evento.estado}
                                  </span>
                                </div>
                              </div>
                              <div className="sorteo-event-financial">
                                <div className="sorteo-financial-item">
                                  <span className="sorteo-financial-label">Recaudado:</span>
                                  <span className="sorteo-financial-value ingresos">{formatCurrency(evento.recaudado)}</span>
                                </div>
                                <div className="sorteo-financial-item">
                                  <span className="sorteo-financial-label">Gastado:</span>
                                  <span className="sorteo-financial-value gastos">{formatCurrency(evento.gastado)}</span>
                                </div>
                                <div className="sorteo-financial-item">
                                  <span className="sorteo-financial-label">Balance:</span>
                                  <span className="sorteo-financial-value balance">{formatCurrency(evento.recaudado - evento.gastado)}</span>
                                </div>
                              </div>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <h6 className="premios-title">
                              <i className="fas fa-trophy"></i> Premios Entregados
                            </h6>
                            <div className="premios-list">
                              {evento.premios.map((premio, index) => (
                                <div key={index} className="premio-item">
                                  <div className="premio-info">
                                    <span className="premio-nombre">{premio.nombre}</span>
                                    <span className="premio-valor">{formatCurrency(premio.valor)}</span>
                                  </div>
                                  <div className="premio-ganador">
                                    <i className="fas fa-user"></i>
                                    <span>Ganador: {premio.ganador}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              <Col lg={4}>
                <Card className="sorteos-info-card">
                  <Card.Header>
                    <h5><i className="fas fa-info-circle"></i> Información sobre Sorteos</h5>
                  </Card.Header>
                  <Card.Body>
                    <p>Los sorteos y concursos de CODES son una forma de:</p>
                    <ul className="sorteos-info-list">
                      <li>Incentivar la participación estudiantil</li>
                      <li>Premiar el esfuerzo académico</li>
                      <li>Fortalecer la comunidad estudiantil</li>
                      <li>Generar fondos para proyectos</li>
                    </ul>
                    <Alert variant="success" className="mt-3">
                      <i className="fas fa-check-circle"></i>
                      <strong>Transparencia Total:</strong> Todos los sorteos son auditados y los ganadores son seleccionados de forma transparente.
                    </Alert>
                    <Alert variant="info" className="mt-3">
                      <i className="fas fa-lightbulb"></i>
                      <strong>¿Sabías que?</strong> El 100% de los fondos recaudados se destina a premios y organización de eventos.
                    </Alert>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>

          {/* Pestaña Reportes */}
          <Tab.Pane eventKey="reportes" active={activeTab === 'reportes'}>
            <Row>
              <Col>
                <Card className="reports-card">
                  <Card.Header>
                    <h4><i className="fas fa-file-alt"></i> Reportes Financieros Mensuales</h4>
                  </Card.Header>
                  <Card.Body>
                    <div className="reports-list">
                      {reportes.map((reporte, index) => (
                        <div key={index} className="report-item">
                          <div className="report-info">
                            <h6 className="report-period">{reporte.periodo}</h6>
                            <div className="report-stats">
                              <span className="report-stat ingresos">
                                <i className="fas fa-arrow-up"></i>
                                Ingresos: {formatCurrency(reporte.ingresos)}
                              </span>
                              <span className="report-stat gastos">
                                <i className="fas fa-arrow-down"></i>
                                Gastos: {formatCurrency(reporte.gastos)}
                              </span>
                              <span className="report-stat balance">
                                <i className="fas fa-balance-scale"></i>
                                Balance: {formatCurrency(reporte.balance)}
                              </span>
                            </div>
                          </div>
                          <div className="report-actions">
                            <Button variant="outline-primary" size="sm">
                              <i className="fas fa-download"></i> Descargar PDF
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab.Pane>
        </Tab.Content>

        {/* Compromiso de Transparencia */}
        <Row className="mt-5">
          <Col>
            <Card className="commitment-card">
              <Card.Body className="text-center">
                <i className="fas fa-handshake commitment-icon"></i>
                <h4 className="commitment-title">Nuestro Compromiso</h4>
                <p className="commitment-text">
                  CODES se compromete a mantener la máxima transparencia en el uso de los recursos. 
                  Todos los fondos se utilizan exclusivamente para beneficiar a la comunidad estudiantil 
                  y cada peso gastado está documentado y auditado.
                </p>
                <div className="commitment-features">
                  <div className="commitment-feature">
                    <i className="fas fa-check-circle"></i>
                    <span>Auditorías regulares</span>
                  </div>
                  <div className="commitment-feature">
                    <i className="fas fa-check-circle"></i>
                    <span>Reportes mensuales</span>
                  </div>
                  <div className="commitment-feature">
                    <i className="fas fa-check-circle"></i>
                    <span>Documentación completa</span>
                  </div>
                  <div className="commitment-feature">
                    <i className="fas fa-check-circle"></i>
                    <span>Acceso público a la información</span>
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

export default Transparencia;
