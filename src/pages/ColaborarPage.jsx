import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert, Spinner } from 'react-bootstrap';
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

  // Opciones para el año de ingreso (últimos 10 años)
  const anosIngreso = [];
  const currentYear = new Date().getFullYear();
  for (let i = currentYear; i >= currentYear - 10; i--) {
    anosIngreso.push(i);
  }

  // Disponibilidades horarias
  const disponibilidades = [
    { value: 'mañana', label: 'Mañana', icon: 'fas fa-sun' },
    { value: 'tarde', label: 'Tarde', icon: 'fas fa-sun' },
    { value: 'noche', label: 'Noche', icon: 'fas fa-moon' }
  ];

  // Tecnologías disponibles
  const tecnologiasDisponibles = [
    { value: 'react', label: 'React' },
    { value: 'nodejs', label: 'Node.js' },
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'typescript', label: 'TypeScript' },
    { value: 'java', label: 'Java' },
    { value: 'php', label: 'PHP' },
    { value: 'csharp', label: 'C#' },
    { value: 'vue', label: 'Vue.js' },
    { value: 'angular', label: 'Angular' },
    { value: 'html', label: 'HTML/CSS' },
    { value: 'sql', label: 'SQL' },
    { value: 'mongodb', label: 'MongoDB' },
    { value: 'postgresql', label: 'PostgreSQL' },
    { value: 'git', label: 'Git' },
    { value: 'docker', label: 'Docker' },
    { value: 'aws', label: 'AWS' },
    { value: 'firebase', label: 'Firebase' },
    { value: 'flutter', label: 'Flutter' },
    { value: 'react-native', label: 'React Native' }
  ];

  const nivelesExperiencia = [
    { value: 'principiante', label: 'Principiante' },
    { value: 'intermedio', label: 'Intermedio' },
    { value: 'avanzado', label: 'Avanzado' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Limpiar errores cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
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
        // Remover tecnología y su nivel de experiencia
        const nuevasTecnologias = prev.tecnologias.filter(t => t !== techValue);
        const nuevosNiveles = { ...prev.nivelesExperiencia };
        delete nuevosNiveles[techValue];
        return {
          ...prev,
          tecnologias: nuevasTecnologias,
          nivelesExperiencia: nuevosNiveles
        };
      } else {
        // Agregar tecnología si no se ha alcanzado el máximo de 3
        if (prev.tecnologias.length < 3) {
          return {
            ...prev,
            tecnologias: [...prev.tecnologias, techValue]
          };
        }
      }
      return prev;
    });
  };

  const handleNivelExperienciaChange = (techValue, nivel) => {
    setFormData(prev => ({
      ...prev,
      nivelesExperiencia: {
        ...prev.nivelesExperiencia,
        [techValue]: nivel
      }
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    }

    if (!formData.anoIngreso) {
      newErrors.anoIngreso = 'El año de ingreso es requerido';
    }

    if (formData.disponibilidad.length === 0) {
      newErrors.disponibilidad = 'Selecciona al menos una disponibilidad horaria';
    }

    if (formData.tecnologias.length === 0) {
      newErrors.tecnologias = 'Selecciona al menos una tecnología';
    } else {
      // Validar que cada tecnología tenga su nivel de experiencia
      formData.tecnologias.forEach(tech => {
        if (!formData.nivelesExperiencia[tech]) {
          newErrors[`nivel_${tech}`] = 'Selecciona el nivel de experiencia para ' + 
            tecnologiasDisponibles.find(t => t.value === tech)?.label;
        }
      });
    }

    if (!formData.motivacion.trim()) {
      newErrors.motivacion = 'La motivación/intereses son requeridos';
    }

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
      // Formatear las tecnologías con sus niveles de experiencia
      const tecnologiasConNiveles = formData.tecnologias.map(tech => {
        const techLabel = tecnologiasDisponibles.find(t => t.value === tech)?.label || tech;
        const nivel = formData.nivelesExperiencia[tech] || 'No especificado';
        return `${techLabel} (${nivel})`;
      }).join(', ');

      // Formatear disponibilidades
      const disponibilidadesTexto = formData.disponibilidad
        .map(disp => disponibilidades.find(d => d.value === disp)?.label || disp)
        .join(', ');

      // Construir el mensaje completo
      const mensajeCompleto = `
INFORMACIÓN PERSONAL:
- Nombre: ${formData.nombre}
- Email: ${formData.email}
- Teléfono: ${formData.telefono}
- Año de ingreso: ${formData.anoIngreso}

DISPONIBILIDAD HORARIA:
${disponibilidadesTexto}

TECNOLOGÍAS E INTERESES:
${tecnologiasConNiveles}

MOTIVACIÓN E INTERESES:
${formData.motivacion}
      `.trim();

      const response = await fetch('https://formspree.io/f/xkgpnnzr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.nombre,
          email: formData.email,
          phone: formData.telefono,
          subject: `[CODES++] Solicitud de Colaboración - ${formData.nombre}`,
          message: mensajeCompleto,
          category: 'colaboracion',
          _replyto: formData.email,
          _subject: `[CODES++] Solicitud de Colaboración - ${formData.nombre}`
        })
      });

      if (response.ok) {
        setSubmitStatus({ 
          type: 'success', 
          message: '¡Gracias por tu interés! Tu solicitud se ha registrado correctamente. Te contactaremos pronto.' 
        });
        
        // Limpiar formulario
        setFormData({
          nombre: '',
          email: '',
          telefono: '',
          anoIngreso: '',
          disponibilidad: [],
          tecnologias: [],
          nivelesExperiencia: {},
          motivacion: ''
        });
      } else {
        throw new Error('Error al enviar el formulario');
      }
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
      <Container>
        {/* Hero Section */}
        <Row className="mb-5">
          <Col>
            <div className="colaborar-hero text-center">
              <h1 className="display-4 mb-3">
                <i className="fas fa-users-cog me-3"></i>
                Colabora en Proyectos CODES++
              </h1>
              <p className="lead">
                Únete a proyectos reales, gana experiencia y fortalece tu portafolio mientras colaboras con la comunidad estudiantil
              </p>
            </div>
          </Col>
        </Row>

        {/* Beneficios Section */}
        <Row className="mb-5">
          <Col md={4}>
            <Card className="benefit-card mb-3">
              <Card.Body className="text-center">
                <i className="fas fa-briefcase fa-3x mb-3 text-primary"></i>
                <h4>Portafolio Real</h4>
                <p>Proyectos reales que podrás agregar a tu portafolio profesional</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="benefit-card mb-3">
              <Card.Body className="text-center">
                <i className="fas fa-code fa-3x mb-3 text-primary"></i>
                <h4>Experiencia Práctica</h4>
                <p>Aplica lo que aprendes en la universidad en proyectos reales</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="benefit-card mb-3">
              <Card.Body className="text-center">
                <i className="fas fa-network-wired fa-3x mb-3 text-primary"></i>
                <h4>Networking</h4>
                <p>Conecta con otros estudiantes y profesionales del área</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Formulario */}
        <Row>
          <Col lg={10} className="mx-auto">
            <Card className="colaborar-form-card">
              <Card.Header className="text-center">
                <h3 className="mb-0">
                  <i className="fas fa-user-plus me-2"></i>
                  Formulario de Registro
                </h3>
                <p className="text-muted mb-0 mt-2">
                  Completa el siguiente formulario para comenzar a colaborar en proyectos
                </p>
              </Card.Header>
              <Card.Body>
                {submitStatus && (
                  <Alert variant={submitStatus.type === 'success' ? 'success' : 'danger'}>
                    {submitStatus.message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  {/* Información Personal */}
                  <div className="form-section">
                    <h5 className="section-title">
                      <i className="fas fa-user me-2"></i>
                      Información Personal
                    </h5>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Nombre completo *
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleInputChange}
                            placeholder="Tu nombre completo"
                            isInvalid={!!errors.nombre}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.nombre}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Email *
                          </Form.Label>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="tu@email.com"
                            isInvalid={!!errors.email}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.email}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Teléfono *
                          </Form.Label>
                          <Form.Control
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleInputChange}
                            placeholder="+54 9 2346 123456"
                            isInvalid={!!errors.telefono}
                            required
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.telefono}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>
                            Año de ingreso a la carrera *
                          </Form.Label>
                          <Form.Select
                            name="anoIngreso"
                            value={formData.anoIngreso}
                            onChange={handleInputChange}
                            isInvalid={!!errors.anoIngreso}
                            required
                          >
                            <option value="">Selecciona un año</option>
                            {anosIngreso.map(ano => (
                              <option key={ano} value={ano}>{ano}</option>
                            ))}
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.anoIngreso}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>

                  {/* Disponibilidad */}
                  <div className="form-section">
                    <h5 className="section-title">
                      <i className="fas fa-clock me-2"></i>
                      Disponibilidad Horaria *
                    </h5>
                    <Form.Text className="text-muted mb-3 d-block">
                      Selecciona todos los horarios en los que estás disponible (puedes seleccionar varios)
                    </Form.Text>
                    {errors.disponibilidad && (
                      <Alert variant="danger" className="mb-3">
                        {errors.disponibilidad}
                      </Alert>
                    )}
                    <Row>
                      {disponibilidades.map(disp => (
                        <Col md={4} key={disp.value}>
                          <Form.Check
                            type="checkbox"
                            id={`disp-${disp.value}`}
                            label={
                              <>
                                <i className={disp.icon}></i> {disp.label}
                              </>
                            }
                            checked={formData.disponibilidad.includes(disp.value)}
                            onChange={() => handleDisponibilidadChange(disp.value)}
                            className="mb-3 disponibilidad-check"
                          />
                        </Col>
                      ))}
                    </Row>
                  </div>

                  {/* Tecnologías */}
                  <div className="form-section">
                    <h5 className="section-title">
                      <i className="fas fa-laptop-code me-2"></i>
                      Tecnologías e Intereses *
                    </h5>
                    <Form.Text className="text-muted mb-3 d-block">
                      Selecciona hasta 3 tecnologías de tu interés. Para cada una deberás indicar tu nivel de experiencia.
                      {formData.tecnologias.length > 0 && ` (${formData.tecnologias.length}/3 seleccionadas)`}
                    </Form.Text>
                    {errors.tecnologias && (
                      <Alert variant="danger" className="mb-3">
                        {errors.tecnologias}
                      </Alert>
                    )}

                    <div className="tecnologias-grid mb-4">
                      {tecnologiasDisponibles.map(tech => (
                        <Form.Check
                          key={tech.value}
                          type="checkbox"
                          id={`tech-${tech.value}`}
                          label={tech.label}
                          checked={formData.tecnologias.includes(tech.value)}
                          onChange={() => handleTecnologiaChange(tech.value)}
                          disabled={!formData.tecnologias.includes(tech.value) && formData.tecnologias.length >= 3}
                          className="tech-checkbox mb-2"
                        />
                      ))}
                    </div>

                    {/* Niveles de experiencia para tecnologías seleccionadas */}
                    {formData.tecnologias.length > 0 && (
                      <div className="niveles-experiencia">
                        <h6 className="mb-3">
                          <i className="fas fa-signal me-2"></i>
                          Nivel de experiencia por tecnología:
                        </h6>
                        {formData.tecnologias.map(techValue => {
                          const tech = tecnologiasDisponibles.find(t => t.value === techValue);
                          return (
                            <Row key={techValue} className="mb-3">
                              <Col md={4}>
                                <Form.Label>
                                  <strong>{tech?.label}</strong>
                                </Form.Label>
                              </Col>
                              <Col md={8}>
                                <Form.Select
                                  value={formData.nivelesExperiencia[techValue] || ''}
                                  onChange={(e) => handleNivelExperienciaChange(techValue, e.target.value)}
                                  isInvalid={!!errors[`nivel_${techValue}`]}
                                  required
                                >
                                  <option value="">Selecciona nivel...</option>
                                  {nivelesExperiencia.map(nivel => (
                                    <option key={nivel.value} value={nivel.value}>
                                      {nivel.label}
                                    </option>
                                  ))}
                                </Form.Select>
                                {errors[`nivel_${techValue}`] && (
                                  <Form.Control.Feedback type="invalid" className="d-block">
                                    {errors[`nivel_${techValue}`]}
                                  </Form.Control.Feedback>
                                )}
                              </Col>
                            </Row>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Motivación */}
                  <div className="form-section">
                    <h5 className="section-title">
                      <i className="fas fa-comment-alt me-2"></i>
                      Motivación e Intereses *
                    </h5>
                                          <Form.Text className="text-muted mb-3 d-block">
                        Cuéntanos por qué quieres colaborar en proyectos y qué te interesa.
                      </Form.Text>
                    <Form.Group className="mb-3">
                      <Form.Control
                        as="textarea"
                        name="motivacion"
                        value={formData.motivacion}
                        onChange={handleInputChange}
                        placeholder="Ejemplo: Me interesa colaborar en proyectos web porque quiero aplicar lo que aprendo en la universidad. Me gustaría trabajar con React y Node.js para mejorar mis habilidades..."
                        rows={5}
                        isInvalid={!!errors.motivacion}
                        required
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.motivacion}
                      </Form.Control.Feedback>
                      <Form.Text className="text-muted mt-2">
                        {formData.motivacion.length} caracteres
                      </Form.Text>
                    </Form.Group>
                  </div>

                  {/* Submit Button */}
                  <div className="form-footer text-center mt-4">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={isSubmitting}
                      className="submit-btn"
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
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Información sobre Proyectos Voluntarios */}
        <Row className="mb-5 mt-5">
          <Col lg={8} className="mx-auto">
            <Card className="info-card mb-4">
              <Card.Body className="text-center">
                <div className="info-header justify-content-center mb-4">
                  <i className="fas fa-heart fa-3x me-3 text-primary"></i>
                  <div>
                    <h4 className="mb-2">Proyectos Voluntarios</h4>
                    <p className="mb-0 text-muted">
                      Contribuye de forma voluntaria a proyectos comunitarios y de código abierto
                    </p>
                  </div>
                </div>
                
                <div className="project-type-card volunteer mx-auto" style={{ maxWidth: '600px' }}>
                  <div className="type-icon mx-auto mb-3">
                    <i className="fas fa-heart"></i>
                  </div>
                  <p className="lead">
                    Proyectos comunitarios y de <strong>código abierto</strong> donde contribuyes 
                    de forma voluntaria. Ideal para ganar experiencia y construir tu portafolio 
                    mientras ayudas a la comunidad estudiantil.
                  </p>
                  <ul className="text-start">
                    <li>Proyectos internos de CODES++</li>
                    <li>Mejoras al sitio web de CODES++</li>
                    <li>Herramientas gratuitas para estudiantes</li>
                    <li>Proyectos open source comunitarios</li>
                    <li>Mejoras en herramientas educativas</li>
                  </ul>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ColaborarPage;

