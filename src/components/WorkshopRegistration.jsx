import { useState } from 'react';
import { Form, Container, Row, Col, Spinner } from 'react-bootstrap';
import { supabase } from '../supabaseClient';
import './WorkshopRegistration.css';

export default function WorkshopRegistration() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    campus: 'Luján',
    github_user: '',
    career_level: 'Ingresante',
    tech_level: 'Básico',
    motivation: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('workshop_registrations')
      .insert([formData]);

    setLoading(false);

    if (error) {
      if (error.code === '23505' || error.message.includes('duplicate')) {
        alert('Ya te has inscripto con este email.');
      } else {
        alert('Error al inscribirse: ' + error.message);
      }
    } else {
      setSuccess(true);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  if (success) {
    return (
      <section className="workshop-section py-5">
        <Container>
          <div className="workshop-hero">
            <span className="workshop-badge">Inscripción confirmada</span>
          </div>
          <div className="workshop-success-card">
            <div className="success-icon">
              <i className="fas fa-check"></i>
            </div>
            <h2>¡Estás dentro, {formData.full_name.split(' ')[0]}!</h2>
            <p className="success-message">
              Tu lugar en el taller <strong>"Tu Código es tu CV"</strong> está reservado.
              Te notificaremos por email los próximos pasos y el acceso al repositorio.
            </p>
            <div className="success-actions">
              <a
                href="https://discord.gg/8GAv7zsqWm"
                target="_blank"
                rel="noopener noreferrer"
                className="success-btn success-btn-primary"
              >
                <i className="fab fa-discord"></i>
                Unirme al Discord de CODES
              </a>
              <a
                href="https://github.com/CODES-UNLU"
                target="_blank"
                rel="noopener noreferrer"
                className="success-btn success-btn-outline"
              >
                <i className="fab fa-github"></i>
                Ver organización en GitHub
              </a>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section className="workshop-section py-5">
      <Container>
        {/* Hero */}
        <div className="workshop-hero">
          <span className="workshop-badge">Taller gratuito</span>
          <h2 className="section-title">Tu Código es tu CV</h2>
          <p className="section-subtitle">
            Aprendé a usar <strong>Git</strong> y <strong>GitHub</strong> desde cero y construí tu propio
            portafolio profesional publicado en una <strong>GitHub Page</strong> dentro del
            repositorio de <strong>CODES UNLu</strong>.
          </p>
        </div>

        {/* Feature Cards */}
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="workshop-features">
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fab fa-git-alt"></i>
                </div>
                <h5>Git desde cero</h5>
                <p>
                  Aprende commits, branches, merge y el flujo de trabajo profesional que usan las empresas.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fab fa-github"></i>
                </div>
                <h5>GitHub colaborativo</h5>
                <p>
                  Pull requests, issues, reviews de código y trabajo en equipo dentro de una organización real.
                </p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-globe"></i>
                </div>
                <h5>Tu portafolio online</h5>
                <p>
                  Publicá tu página personal con GitHub Pages en el repositorio de CODES UNLu, visible para todos.
                </p>
              </div>
            </div>
          </Col>
        </Row>

        {/* Qué vas a aprender */}
        <Row className="justify-content-center">
          <Col lg={10}>
            <div className="workshop-info-section">
              <div className="info-header">
                <span className="workshop-badge">Contenido del taller</span>
                <h4>Lo que vas a aprender</h4>
                <p>Un recorrido práctico desde la terminal hasta tu sitio publicado</p>
              </div>
              <ul className="workshop-checklist">
                <li>
                  <div className="checklist-icon"><i className="fas fa-terminal"></i></div>
                  <div className="checklist-text">
                    <strong>Terminal y línea de comandos</strong>
                    <span>Los comandos básicos para moverte con confianza</span>
                  </div>
                </li>
                <li>
                  <div className="checklist-icon"><i className="fas fa-code-branch"></i></div>
                  <div className="checklist-text">
                    <strong>Control de versiones con Git</strong>
                    <span>init, add, commit, branch, merge y más</span>
                  </div>
                </li>
                <li>
                  <div className="checklist-icon"><i className="fas fa-users"></i></div>
                  <div className="checklist-text">
                    <strong>Colaboración en GitHub</strong>
                    <span>Fork, clone, pull request y code review</span>
                  </div>
                </li>
                <li>
                  <div className="checklist-icon"><i className="fas fa-laptop-code"></i></div>
                  <div className="checklist-text">
                    <strong>Creación del portafolio</strong>
                    <span>HTML, CSS y tu información profesional</span>
                  </div>
                </li>
                <li>
                  <div className="checklist-icon"><i className="fas fa-rocket"></i></div>
                  <div className="checklist-text">
                    <strong>Deploy con GitHub Pages</strong>
                    <span>Tu sitio en vivo dentro del repo de CODES UNLu</span>
                  </div>
                </li>
                <li>
                  <div className="checklist-icon"><i className="fas fa-certificate"></i></div>
                  <div className="checklist-text">
                    <strong>Certificado de participación</strong>
                    <span>Validado por CODES, Centro de Estudiantes de Sistemas</span>
                  </div>
                </li>
              </ul>
            </div>
          </Col>
        </Row>

        {/* Formulario de inscripción */}
        <Row className="justify-content-center mt-4">
          <Col lg={8}>
            <div className="workshop-form-container">
              <div className="workshop-form-header">
                <h3>Inscribite al taller</h3>
                <p>Completá tus datos para reservar tu lugar. Es totalmente gratuito.</p>
              </div>

              <Form className="workshop-form" onSubmit={handleSubmit}>
                <div className="form-group">
                  <Form.Label className="form-label">
                    <span className="label-icon"><i className="fas fa-user"></i></span>
                    Nombre Completo
                  </Form.Label>
                  <Form.Control
                    required
                    name="full_name"
                    onChange={handleChange}
                    placeholder="Tal como aparecerá en tu certificado"
                  />
                </div>

                <div className="form-group">
                  <Form.Label className="form-label">
                    <span className="label-icon"><i className="fas fa-envelope"></i></span>
                    Email
                  </Form.Label>
                  <Form.Control
                    required
                    type="email"
                    name="email"
                    onChange={handleChange}
                    placeholder="tu@email.com"
                  />
                </div>

                <Row>
                  <Col md={6}>
                    <div className="form-group">
                      <Form.Label className="form-label">
                        <span className="label-icon"><i className="fas fa-map-marker-alt"></i></span>
                        Sede / Centro Regional
                      </Form.Label>
                      <Form.Select name="campus" onChange={handleChange}>
                        <option>Luján</option>
                        <option>Chivilcoy</option>
                        <option>San Miguel</option>
                        <option>Mercedes</option>
                        <option>Otro</option>
                      </Form.Select>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="form-group">
                      <Form.Label className="form-label">
                        <span className="label-icon"><i className="fab fa-github"></i></span>
                        Usuario GitHub
                        <small style={{ fontWeight: 400, opacity: 0.6, marginLeft: '0.25rem' }}>(opcional)</small>
                      </Form.Label>
                      <Form.Control
                        name="github_user"
                        onChange={handleChange}
                        placeholder="@tu-usuario"
                      />
                    </div>
                  </Col>
                </Row>

                <div className="form-group">
                  <Form.Label className="form-label">
                    <span className="label-icon"><i className="fas fa-signal"></i></span>
                    Nivel actual con la Terminal / Git
                  </Form.Label>
                  <div className="workshop-range-container">
                    <Form.Range min="1" max="5" name="tech_level" onChange={handleChange} />
                    <div className="range-labels">
                      <span>Nunca usé la terminal</span>
                      <span>Manejo Git con soltura</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="workshop-submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <Spinner size="sm" animation="border" />
                  ) : (
                    <>
                      <i className="fas fa-paper-plane" style={{ marginRight: '0.5rem' }}></i>
                      Confirmar Inscripción
                    </>
                  )}
                </button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
}