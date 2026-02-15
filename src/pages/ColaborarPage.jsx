import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import collaboratorsService from '../services/collaboratorsService';
import './ColaborarPage.css';

const ColaborarPage = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    anoIngreso: '',
    disponibilidad: [],
    tecnologias: [],
    nivelesExperiencia: {},
    motivacion: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const particlesRef = useRef(null);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 300);

    // Crear partículas dinámicas
    if (particlesRef.current) {
      const container = particlesRef.current;
      for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'colab-particle';
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

  // Opciones para el año de ingreso (últimos 10 años)
  const anosIngreso = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 10; i--) {
    anosIngreso.push(i);
  }

  const disponibilidades = [
    { value: 'mañana', label: 'Mañana', icon: 'fas fa-sun', desc: '8:00 - 12:00' },
    { value: 'tarde', label: 'Tarde', icon: 'fas fa-cloud-sun', desc: '12:00 - 18:00' },
    { value: 'noche', label: 'Noche', icon: 'fas fa-moon', desc: '18:00 - 22:00' }
  ];

  const tecnologiasDisponibles = [
    { value: 'react', label: 'React', icon: 'fab fa-react' },
    { value: 'nodejs', label: 'Node.js', icon: 'fab fa-node-js' },
    { value: 'python', label: 'Python', icon: 'fab fa-python' },
    { value: 'javascript', label: 'JavaScript', icon: 'fab fa-js-square' },
    { value: 'typescript', label: 'TypeScript', icon: 'fas fa-code' },
    { value: 'java', label: 'Java', icon: 'fab fa-java' },
    { value: 'php', label: 'PHP', icon: 'fab fa-php' },
    { value: 'csharp', label: 'C#', icon: 'fas fa-hashtag' },
    { value: 'vue', label: 'Vue.js', icon: 'fab fa-vuejs' },
    { value: 'angular', label: 'Angular', icon: 'fab fa-angular' },
    { value: 'html', label: 'HTML/CSS', icon: 'fab fa-html5' },
    { value: 'sql', label: 'SQL', icon: 'fas fa-database' },
    { value: 'mongodb', label: 'MongoDB', icon: 'fas fa-leaf' },
    { value: 'postgresql', label: 'PostgreSQL', icon: 'fas fa-database' },
    { value: 'git', label: 'Git', icon: 'fab fa-git-alt' },
    { value: 'docker', label: 'Docker', icon: 'fab fa-docker' },
    { value: 'aws', label: 'AWS', icon: 'fab fa-aws' },
    { value: 'firebase', label: 'Firebase', icon: 'fas fa-fire' },
    { value: 'flutter', label: 'Flutter', icon: 'fas fa-mobile-alt' },
    { value: 'react-native', label: 'React Native', icon: 'fab fa-react' }
  ];

  const nivelesExperiencia = [
    { value: 'principiante', label: 'Principiante', icon: 'fas fa-seedling' },
    { value: 'intermedio', label: 'Intermedio', icon: 'fas fa-chart-line' },
    { value: 'avanzado', label: 'Avanzado', icon: 'fas fa-rocket' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDisponibilidadChange = (value) => {
    setFormData(prev => {
      const disponibilidad = prev.disponibilidad.includes(value)
        ? prev.disponibilidad.filter(d => d !== value)
        : [...prev.disponibilidad, value];
      return { ...prev, disponibilidad };
    });
  };

  const handleTecnologiaChange = (techValue) => {
    setFormData(prev => {
      if (prev.tecnologias.includes(techValue)) {
        const nuevasTecnologias = prev.tecnologias.filter(t => t !== techValue);
        const nuevosNiveles = { ...prev.nivelesExperiencia };
        delete nuevosNiveles[techValue];
        return { ...prev, tecnologias: nuevasTecnologias, nivelesExperiencia: nuevosNiveles };
      } else {
        if (prev.tecnologias.length < 3) {
          return { ...prev, tecnologias: [...prev.tecnologias, techValue] };
        }
      }
      return prev;
    });
  };

  const handleNivelExperienciaChange = (techValue, nivel) => {
    setFormData(prev => ({
      ...prev,
      nivelesExperiencia: { ...prev.nivelesExperiencia, [techValue]: nivel }
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.email) newErrors.email = 'El email es requerido';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'El email no es válido';
    if (!formData.telefono.trim()) newErrors.telefono = 'El teléfono es requerido';
    if (!formData.anoIngreso) newErrors.anoIngreso = 'El año de ingreso es requerido';
    if (formData.disponibilidad.length === 0) newErrors.disponibilidad = 'Selecciona al menos una disponibilidad horaria';
    if (formData.tecnologias.length === 0) {
      newErrors.tecnologias = 'Selecciona al menos una tecnología';
    } else {
      formData.tecnologias.forEach(tech => {
        if (!formData.nivelesExperiencia[tech]) {
          newErrors[`nivel_${tech}`] = 'Selecciona el nivel de experiencia para ' +
            tecnologiasDisponibles.find(t => t.value === tech)?.label;
        }
      });
    }
    if (!formData.motivacion.trim()) newErrors.motivacion = 'La motivación/intereses son requeridos';
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
      await collaboratorsService.submitApplication(formData);

      setSubmitStatus({
        type: 'success',
        message: '¡Gracias por tu interés! Tu solicitud se ha registrado correctamente. Te contactaremos pronto.'
      });
      setFormData({
        nombre: '', email: '', telefono: '', anoIngreso: '',
        disponibilidad: [], tecnologias: [], nivelesExperiencia: {}, motivacion: ''
      });
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setSubmitStatus({
        type: 'error',
        message: 'Hubo un error al enviar tu solicitud. Por favor, intenta nuevamente.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="colaborar-page">
      {/* Elementos decorativos de fondo */}
      <div className="colab-particles" ref={particlesRef}></div>
      <div className="colab-geometric-shapes">
        <div className="colab-shape colab-shape-1"></div>
        <div className="colab-shape colab-shape-2"></div>
        <div className="colab-shape colab-shape-3"></div>
      </div>
      <div className="colab-gradient-overlay"></div>

      {/* Hero Section */}
      <section className="colab-hero-section">
        <Container>
          <div className={`colab-hero-content ${isVisible ? 'visible' : ''}`}>
            <div className="colab-badge">
              <span><i className="fas fa-hands-helping me-2"></i>Comunidad CODES++</span>
            </div>
            <h1 className="colab-hero-title">
              Colabora en Proyectos
            </h1>
            <p className="colab-hero-subtitle">
              Únete a proyectos reales, gana experiencia y fortalece tu portafolio 
              mientras colaboras con la comunidad estudiantil
            </p>
          </div>
        </Container>
      </section>

      {/* Beneficios Section */}
      <section className="colab-benefits-section">
        <Container>
          <Row className="g-4">
            {[
              { icon: 'fas fa-briefcase', title: 'Portafolio Real', desc: 'Proyectos reales que podrás agregar a tu portafolio profesional', delay: '0.1s' },
              { icon: 'fas fa-code', title: 'Experiencia Práctica', desc: 'Aplica lo que aprendes en la universidad en proyectos reales', delay: '0.2s' },
              { icon: 'fas fa-network-wired', title: 'Networking', desc: 'Conecta con otros estudiantes y profesionales del área', delay: '0.3s' },
              { icon: 'fas fa-graduation-cap', title: 'Crecimiento', desc: 'Aprende nuevas tecnologías y metodologías de trabajo en equipo', delay: '0.4s' }
            ].map((benefit, idx) => (
              <Col lg={3} md={6} sm={6} xs={12} key={idx}>
                <div className="colab-benefit-card" style={{ animationDelay: benefit.delay }}>
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
      <section className="colab-form-section">
        <Container>
          <div className="colab-form-wrapper">
            {/* Header del formulario */}
            <div className="colab-form-header">
              <div className="form-header-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <h2>Formulario de Registro</h2>
              <p>Completa el siguiente formulario para comenzar a colaborar en proyectos</p>
            </div>

            <div className="colab-form-body">
              {submitStatus && (
                <Alert
                  variant={submitStatus.type === 'success' ? 'success' : 'danger'}
                  className="colab-alert"
                  dismissible
                  onClose={() => setSubmitStatus(null)}
                >
                  <i className={`fas ${submitStatus.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} me-2`}></i>
                  {submitStatus.message}
                </Alert>
              )}

              <Form onSubmit={handleSubmit} noValidate>
                {/* Información Personal */}
                <div className="colab-form-block">
                  <div className="form-block-title">
                    <span className="form-block-number">1</span>
                    <div>
                      <h5>Información Personal</h5>
                      <p>Datos básicos de contacto</p>
                    </div>
                  </div>

                  <Row className="g-3">
                    <Col md={6}>
                      <div className={`colab-input-group ${errors.nombre ? 'has-error' : ''}`}>
                        <label><i className="fas fa-user me-2"></i>Nombre completo</label>
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleInputChange}
                          placeholder="Tu nombre completo"
                          className={errors.nombre ? 'is-invalid' : ''}
                        />
                        {errors.nombre && <span className="colab-error">{errors.nombre}</span>}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className={`colab-input-group ${errors.email ? 'has-error' : ''}`}>
                        <label><i className="fas fa-envelope me-2"></i>Email</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="tu@email.com"
                          className={errors.email ? 'is-invalid' : ''}
                        />
                        {errors.email && <span className="colab-error">{errors.email}</span>}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className={`colab-input-group ${errors.telefono ? 'has-error' : ''}`}>
                        <label><i className="fas fa-phone me-2"></i>Teléfono</label>
                        <input
                          type="tel"
                          name="telefono"
                          value={formData.telefono}
                          onChange={handleInputChange}
                          placeholder="+54 9 2346 123456"
                          className={errors.telefono ? 'is-invalid' : ''}
                        />
                        {errors.telefono && <span className="colab-error">{errors.telefono}</span>}
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className={`colab-input-group ${errors.anoIngreso ? 'has-error' : ''}`}>
                        <label><i className="fas fa-calendar-alt me-2"></i>Año de ingreso a la carrera</label>
                        <select
                          name="anoIngreso"
                          value={formData.anoIngreso}
                          onChange={handleInputChange}
                          className={errors.anoIngreso ? 'is-invalid' : ''}
                        >
                          <option value="">Selecciona un año</option>
                          {anosIngreso.map(ano => (
                            <option key={ano} value={ano}>{ano}</option>
                          ))}
                        </select>
                        {errors.anoIngreso && <span className="colab-error">{errors.anoIngreso}</span>}
                      </div>
                    </Col>
                  </Row>
                </div>

                {/* Disponibilidad */}
                <div className="colab-form-block">
                  <div className="form-block-title">
                    <span className="form-block-number">2</span>
                    <div>
                      <h5>Disponibilidad Horaria</h5>
                      <p>Selecciona los horarios en los que estás disponible</p>
                    </div>
                  </div>
                  {errors.disponibilidad && (
                    <div className="colab-inline-error mb-3">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {errors.disponibilidad}
                    </div>
                  )}
                  <Row className="g-3">
                    {disponibilidades.map(disp => (
                      <Col md={4} sm={4} xs={12} key={disp.value}>
                        <div
                          className={`colab-time-card ${formData.disponibilidad.includes(disp.value) ? 'selected' : ''}`}
                          onClick={() => handleDisponibilidadChange(disp.value)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => e.key === 'Enter' && handleDisponibilidadChange(disp.value)}
                        >
                          <i className={disp.icon}></i>
                          <strong>{disp.label}</strong>
                          <small>{disp.desc}</small>
                          {formData.disponibilidad.includes(disp.value) && (
                            <div className="time-check">
                              <i className="fas fa-check"></i>
                            </div>
                          )}
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>

                {/* Tecnologías */}
                <div className="colab-form-block">
                  <div className="form-block-title">
                    <span className="form-block-number">3</span>
                    <div>
                      <h5>Tecnologías e Intereses</h5>
                      <p>Selecciona hasta 3 tecnologías de tu interés
                        {formData.tecnologias.length > 0 && (
                          <span className="colab-counter"> ({formData.tecnologias.length}/3)</span>
                        )}
                      </p>
                    </div>
                  </div>
                  {errors.tecnologias && (
                    <div className="colab-inline-error mb-3">
                      <i className="fas fa-exclamation-triangle me-2"></i>
                      {errors.tecnologias}
                    </div>
                  )}

                  <div className="colab-tech-grid">
                    {tecnologiasDisponibles.map(tech => {
                      const isSelected = formData.tecnologias.includes(tech.value);
                      const isDisabled = !isSelected && formData.tecnologias.length >= 3;
                      return (
                        <div
                          key={tech.value}
                          className={`colab-tech-chip ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                          onClick={() => !isDisabled && handleTecnologiaChange(tech.value)}
                          role="button"
                          tabIndex={isDisabled ? -1 : 0}
                          onKeyDown={(e) => e.key === 'Enter' && !isDisabled && handleTecnologiaChange(tech.value)}
                        >
                          <i className={tech.icon}></i>
                          <span>{tech.label}</span>
                          {isSelected && <i className="fas fa-check colab-chip-check"></i>}
                        </div>
                      );
                    })}
                  </div>

                  {/* Niveles de experiencia */}
                  {formData.tecnologias.length > 0 && (
                    <div className="colab-levels-section">
                      <h6><i className="fas fa-signal me-2"></i>Nivel de experiencia</h6>
                      {formData.tecnologias.map(techValue => {
                        const tech = tecnologiasDisponibles.find(t => t.value === techValue);
                        return (
                          <div key={techValue} className="colab-level-row">
                            <div className="level-tech-name">
                              <i className={tech?.icon + ' me-2'}></i>
                              <strong>{tech?.label}</strong>
                            </div>
                            <div className="level-options">
                              {nivelesExperiencia.map(nivel => (
                                <button
                                  key={nivel.value}
                                  type="button"
                                  className={`level-btn ${formData.nivelesExperiencia[techValue] === nivel.value ? 'active' : ''}`}
                                  onClick={() => handleNivelExperienciaChange(techValue, nivel.value)}
                                >
                                  <i className={nivel.icon + ' me-1'}></i>
                                  {nivel.label}
                                </button>
                              ))}
                            </div>
                            {errors[`nivel_${techValue}`] && (
                              <span className="colab-error d-block mt-1">{errors[`nivel_${techValue}`]}</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Motivación */}
                <div className="colab-form-block">
                  <div className="form-block-title">
                    <span className="form-block-number">4</span>
                    <div>
                      <h5>Motivación e Intereses</h5>
                      <p>Cuéntanos por qué quieres colaborar y qué te interesa</p>
                    </div>
                  </div>
                  <div className={`colab-input-group ${errors.motivacion ? 'has-error' : ''}`}>
                    <textarea
                      name="motivacion"
                      value={formData.motivacion}
                      onChange={handleInputChange}
                      placeholder="Ejemplo: Me interesa colaborar en proyectos web porque quiero aplicar lo que aprendo en la universidad. Me gustaría trabajar con React y Node.js para mejorar mis habilidades..."
                      rows={5}
                      className={errors.motivacion ? 'is-invalid' : ''}
                    />
                    {errors.motivacion && <span className="colab-error">{errors.motivacion}</span>}
                    <div className="char-counter">
                      {formData.motivacion.length} caracteres
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="colab-submit-area">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="colab-submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane me-2"></i>
                        Enviar Solicitud
                      </>
                    )}
                  </Button>
                  <p className="submit-hint">
                    <i className="fas fa-lock me-1"></i>
                    Tu información es confidencial y solo será utilizada para contactarte
                  </p>
                </div>
              </Form>
            </div>
          </div>
        </Container>
      </section>

      {/* Proyectos Voluntarios */}
      <section className="colab-volunteer-section">
        <Container>
          <div className="colab-volunteer-card">
            <div className="volunteer-icon-float">
              <i className="fas fa-heart"></i>
            </div>
            <h3>Proyectos Voluntarios</h3>
            <p className="volunteer-desc">
              Contribuye de forma voluntaria a proyectos comunitarios y de <strong>código abierto</strong>. 
              Ideal para ganar experiencia y construir tu portafolio mientras ayudas a la comunidad estudiantil.
            </p>
            <div className="volunteer-items">
              {[
                'Proyectos internos de CODES++',
                'Mejoras al sitio web de CODES++',
                'Herramientas gratuitas para estudiantes',
                'Proyectos open source comunitarios',
                'Mejoras en herramientas educativas'
              ].map((item, idx) => (
                <div className="volunteer-item" key={idx}>
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

export default ColaborarPage;

