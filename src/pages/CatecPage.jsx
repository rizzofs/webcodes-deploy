import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import catecService from '../services/catecService';
import './CatecPage.css';

const CatecPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    legajo: '',
    area: '',
    tecnologias: [],
    portfolioUrl: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const particlesRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300);

    if (particlesRef.current) {
      const container = particlesRef.current;
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'catec-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 20 + 's';
        particle.style.animationDuration = (15 + Math.random() * 10) + 's';
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        container.appendChild(particle);
      }
    }
  }, []);

  const areas = [
    {
      value: 'frontend',
      label: 'Frontend',
      icon: 'fas fa-palette',
      desc: 'Interfaces de usuario y experiencias web'
    },
    {
      value: 'backend',
      label: 'Backend',
      icon: 'fas fa-server',
      desc: 'Servicios, APIs y bases de datos'
    },
    {
      value: 'data_analytics',
      label: 'Data Analytics',
      icon: 'fas fa-chart-bar',
      desc: 'Análisis de datos y visualización'
    },
    {
      value: 'qa',
      label: 'Q/A',
      icon: 'fas fa-bug',
      desc: 'Testing y aseguramiento de calidad'
    }
  ];

  const tecnologiasPorArea = {
    frontend: [
      { value: 'React', icon: 'fab fa-react' },
      { value: 'Tailwind CSS', icon: 'fas fa-wind' },
      { value: 'TypeScript', icon: 'fas fa-code' },
      { value: 'Next.js', icon: 'fab fa-react' }
    ],
    backend: [
      { value: 'Node.js', icon: 'fab fa-node-js' },
      { value: 'Express', icon: 'fab fa-node-js' },
      { value: 'Supabase (PostgreSQL)', icon: 'fas fa-database' },
      { value: 'C#', icon: 'fas fa-hashtag' },
      { value: 'Java', icon: 'fab fa-java' }
    ],
    data_analytics: [
      { value: 'Python (Pandas/NumPy)', icon: 'fab fa-python' },
      { value: 'SQL', icon: 'fas fa-database' },
      { value: 'Power BI', icon: 'fas fa-chart-pie' },
      { value: 'Excel Avanzado', icon: 'fas fa-file-excel' }
    ],
    qa: [
      { value: 'Jest', icon: 'fas fa-vial' },
      { value: 'Cypress', icon: 'fas fa-cogs' },
      { value: 'Selenium', icon: 'fas fa-robot' },
      { value: 'Pruebas Manuales', icon: 'fas fa-clipboard-check' }
    ]
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAreaChange = (areaValue) => {
    setFormData(prev => ({
      ...prev,
      area: areaValue,
      tecnologias: [] // Reset tecnologías al cambiar de área
    }));
    if (errors.area) {
      setErrors(prev => ({ ...prev, area: '' }));
    }
  };

  const handleTecnologiaChange = (techValue) => {
    setFormData(prev => {
      if (prev.tecnologias.includes(techValue)) {
        return { ...prev, tecnologias: prev.tecnologias.filter(t => t !== techValue) };
      } else {
        return { ...prev, tecnologias: [...prev.tecnologias, techValue] };
      }
    });
    if (errors.tecnologias) {
      setErrors(prev => ({ ...prev, tecnologias: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    if (!formData.legajo.trim()) newErrors.legajo = 'El legajo es requerido';
    if (!formData.area) newErrors.area = 'Selecciona un área de interés';
    if (formData.tecnologias.length === 0) newErrors.tecnologias = 'Selecciona al menos una tecnología';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmitStatus({ type: 'error', message: 'Por favor corrige los errores en el formulario' });
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus(null);
    try {
      await catecService.submitApplication(formData);

      setSubmitStatus({
        type: 'success',
        message: '¡Postulación enviada! Te hemos enviado un email de confirmación. Te contactaremos cuando surjan proyectos acordes a tu perfil.'
      });
      setFormData({
        nombre: '', email: '', legajo: '', area: '',
        tecnologias: [], portfolioUrl: ''
      });
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Hubo un error al enviar tu postulación. Por favor, intenta nuevamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const techsDisponibles = formData.area ? tecnologiasPorArea[formData.area] : [];

  return (
    <div className="catec-page">
      {/* Elementos decorativos de fondo */}
      <div className="catec-particles" ref={particlesRef}></div>
      <div className="catec-geometric-shapes">
        <div className="catec-shape catec-shape-1"></div>
        <div className="catec-shape catec-shape-2"></div>
        <div className="catec-shape catec-shape-3"></div>
      </div>
      <div className="catec-gradient-overlay"></div>

      {/* Hero Section */}
      <section className="catec-hero-section">
        <Container>
          <div className={`catec-hero-content ${isVisible ? 'visible' : ''}`}>
            <div className="catec-badge">
              <span><i className="fas fa-building me-2"></i>Vinculación Tecnológica</span>
            </div>
            <h1 className="catec-hero-title">
              Proyectos CATEC
            </h1>
            <p className="catec-hero-subtitle">
              Accedé a proyectos reales para empresas a través del Centro de Asistencia 
              Tecnológica y Empresarial. Trabajos remunerados que fortalecen tu experiencia profesional.
            </p>
          </div>
        </Container>
      </section>

      {/* Beneficios Section */}
      <section className="catec-benefits-section">
        <Container>
          <Row className="g-4">
            {[
              { icon: 'fas fa-dollar-sign', title: 'Remunerado', desc: 'Proyectos pagos para empresas reales a través del CATEC', delay: '0.1s' },
              { icon: 'fas fa-building', title: 'Clientes Reales', desc: 'Trabajá con empresas que necesitan soluciones tecnológicas', delay: '0.2s' },
              { icon: 'fas fa-certificate', title: 'Certificación', desc: 'Obtené certificaciones y referencias profesionales', delay: '0.3s' },
              { icon: 'fas fa-users-cog', title: 'Equipo', desc: 'Formá parte de equipos multidisciplinarios de trabajo', delay: '0.4s' }
            ].map((benefit, idx) => (
              <Col lg={3} md={6} sm={6} xs={12} key={idx}>
                <div className="catec-benefit-card" style={{ animationDelay: benefit.delay }}>
                  <div className="benefit-icon-wrapper">
                    <i className={benefit.icon}></i>
                  </div>
                  <h4>{benefit.title}</h4>
                  <p>{benefit.desc}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Formulario Section */}
      <section className="catec-form-section">
        <Container>
          <div className="catec-form-wrapper">
            {/* Header del formulario */}
            <div className="catec-form-header">
              <div className="form-header-icon">
                <i className="fas fa-file-signature"></i>
              </div>
              <h2>Postulación CATEC</h2>
              <p>Completá el formulario para sumarte a la base de vinculación tecnológica</p>
            </div>

            <div className="catec-form-body">
              {submitStatus && (
                <Alert
                  variant={submitStatus.type === 'success' ? 'success' : 'danger'}
                  className="catec-alert"
                  dismissible
                  onClose={() => setSubmitStatus(null)}
                >
                  <i className={`fas ${submitStatus.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`}></i>
                  {submitStatus.message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                {/* Información Personal */}
                <div className="catec-form-block">
                  <div className="form-block-title">
                    <span className="form-block-number">1</span>
                    <div>
                      <h5>Información Personal</h5>
                      <p>Datos de contacto e identificación</p>
                    </div>
                  </div>

                  <Row className="g-3">
                    <Col md={6}>
                      <div className={`catec-input-group ${errors.nombre ? 'has-error' : ''}`}>
                        <label><i className="fas fa-user me-2"></i>Nombre completo</label>
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          placeholder="Tu nombre completo"
                          className={errors.nombre ? 'is-invalid' : ''}
                        />
                        {errors.nombre && <span className="catec-error">{errors.nombre}</span>}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className={`catec-input-group ${errors.email ? 'has-error' : ''}`}>
                        <label><i className="fas fa-envelope me-2"></i>Email (institucional preferentemente)</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="tu@unlu.edu.ar"
                          className={errors.email ? 'is-invalid' : ''}
                        />
                        {errors.email && <span className="catec-error">{errors.email}</span>}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className={`catec-input-group ${errors.legajo ? 'has-error' : ''}`}>
                        <label><i className="fas fa-id-card me-2"></i>Legajo</label>
                        <input
                          type="text"
                          name="legajo"
                          value={formData.legajo}
                          onChange={handleInputChange}
                          placeholder="Ej: 123456"
                          className={errors.legajo ? 'is-invalid' : ''}
                        />
                        {errors.legajo && <span className="catec-error">{errors.legajo}</span>}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="catec-input-group">
                        <label><i className="fas fa-link me-2"></i>Portfolio o GitHub (opcional)</label>
                        <input
                          type="url"
                          name="portfolioUrl"
                          value={formData.portfolioUrl}
                          onChange={handleInputChange}
                          placeholder="https://github.com/tu-usuario"
                        />
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Área de Interés */}
                <div className="catec-form-block">
                  <div className="form-block-title">
                    <span className="form-block-number">2</span>
                    <div>
                      <h5>Área de Interés</h5>
                      <p>Seleccioná el área en la que te gustaría trabajar</p>
                    </div>
                  </div>
                  {errors.area && (
                    <div className="catec-inline-error mb-3">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {errors.area}
                    </div>
                  )}
                  <div className="catec-area-grid">
                    {areas.map(area => (
                      <div
                        key={area.value}
                        className={`catec-area-card ${formData.area === area.value ? 'selected' : ''}`}
                        onClick={() => handleAreaChange(area.value)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && handleAreaChange(area.value)}
                      >
                        <i className={`${area.icon} area-icon`}></i>
                        <strong>{area.label}</strong>
                        <small>{area.desc}</small>
                        {formData.area === area.value && (
                          <div className="area-check">
                            <i className="fas fa-check"></i>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tecnologías */}
                <div className="catec-form-block">
                  <div className="form-block-title">
                    <span className="form-block-number">3</span>
                    <div>
                      <h5>Tecnologías que Dominás</h5>
                      <p>
                        {formData.area
                          ? 'Seleccioná las tecnologías con las que tenés experiencia'
                          : 'Primero seleccioná un área para ver las tecnologías disponibles'}
                        {formData.tecnologias.length > 0 && (
                          <span className="catec-counter"> ({formData.tecnologias.length} seleccionadas)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  {errors.tecnologias && (
                    <div className="catec-inline-error mb-3">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {errors.tecnologias}
                    </div>
                  )}

                  {techsDisponibles.length > 0 ? (
                    <div className="catec-tech-grid">
                      {techsDisponibles.map(tech => {
                        const isSelected = formData.tecnologias.includes(tech.value);
                        return (
                          <div
                            key={tech.value}
                            className={`catec-tech-chip ${isSelected ? 'selected' : ''}`}
                            onClick={() => handleTecnologiaChange(tech.value)}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => e.key === 'Enter' && handleTecnologiaChange(tech.value)}
                          >
                            <i className={tech.icon}></i>
                            <span>{tech.value}</span>
                            {isSelected && <i className="fas fa-check catec-chip-check"></i>}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '1.5rem 0' }}>
                      <i className="fas fa-arrow-up me-2"></i>
                      Seleccioná un área arriba para ver las tecnologías
                    </div>
                  )}
                </div>

                {/* Resumen y Submit */}
                <div className="catec-form-block">
                  <div className="form-block-title">
                    <span className="form-block-number">4</span>
                    <div>
                      <h5>Confirmar Postulación</h5>
                      <p>Revisá tus datos y enviá tu postulación</p>
                    </div>
                  </div>

                  <div className="catec-submit-area">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="catec-submit-btn"
                    >
                      {isSubmitting ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Enviando...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-paper-plane me-2"></i>
                          Enviar Postulación
                        </>
                      )}
                    </Button>
                    <p className="submit-hint">
                      <i className="fas fa-lock me-1"></i>
                      Tu información es confidencial. Recibirás un email de confirmación.
                    </p>
                  </div>
                </div>
              </Form>
            </div>
          </div>
        </Container>
      </section>

      {/* Info CATEC */}
      <section className="catec-info-section">
        <Container>
          <div className="catec-info-card">
            <div className="info-icon-float">
              <i className="fas fa-building"></i>
            </div>
            <h3>¿Qué es el CATEC?</h3>
            <p className="info-desc">
              El <strong>Centro de Asistencia Tecnológica y Empresarial</strong> vincula a estudiantes 
              con empresas que necesitan soluciones tecnológicas. Los proyectos son <strong>remunerados</strong> y 
              supervisados por docentes de la universidad.
            </p>
            <div className="info-items">
              {[
                'Desarrollo de software para empresas reales',
                'Proyectos remunerados y con seguimiento académico',
                'Formación de equipos según habilidades',
                'Certificación de experiencia profesional',
                'Vinculación directa con el sector productivo'
              ].map((item, idx) => (
                <div className="info-item" key={idx}>
                  <i className="fas fa-check-circle"></i>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default CatecPage;
