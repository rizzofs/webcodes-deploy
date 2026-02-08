import React, { useState } from 'react';
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import './ContactForm.css';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: '',
    priority: 'normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const categories = [
    { value: 'general', label: 'Consulta General', icon: 'fas fa-question-circle' },
    { value: 'academic', label: 'Asuntos Académicos', icon: 'fas fa-graduation-cap' },
    { value: 'events', label: 'Eventos y Actividades', icon: 'fas fa-calendar-alt' },
    { value: 'technical', label: 'Soporte Técnico', icon: 'fas fa-tools' },
    { value: 'suggestion', label: 'Sugerencias', icon: 'fas fa-lightbulb' },
    { value: 'complaint', label: 'Reclamos', icon: 'fas fa-exclamation-triangle' }
  ];

  const priorities = [
    { value: 'low', label: 'Baja', color: 'success' },
    { value: 'normal', label: 'Normal', color: 'primary' },
    { value: 'high', label: 'Alta', color: 'warning' },
    { value: 'urgent', label: 'Urgente', color: 'danger' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
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

    if (!formData.email) {
      newErrors.email = 'El email es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!formData.subject.trim()) {
      newErrors.subject = 'El asunto es requerido';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'El mensaje es requerido';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'El mensaje debe tener al menos 10 caracteres';
    }

    if (!formData.category) {
      newErrors.category = 'Selecciona una categoría';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://formspree.io/f/xkgpnnzr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          category: formData.category,
          priority: formData.priority,
          _replyto: formData.email,
          _subject: `[CODES++] ${formData.subject} - ${formData.category}`
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          category: '',
          priority: 'normal'
        });
      } else {
        throw new Error('Error al enviar el formulario');
      }
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPriorityColor = (priority) => {
    const priorityObj = priorities.find(p => p.value === priority);
    return priorityObj ? priorityObj.color : 'primary';
  };

  return (
    <div className="contact-form-container">
      <div className="contact-header">
        <h3>
          <i className="fas fa-paper-plane me-2"></i>
          Envíanos un mensaje
        </h3>
        <p>¿Tienes alguna pregunta, sugerencia o necesitas ayuda? Estamos aquí para ayudarte.</p>
      </div>

      <Form onSubmit={handleSubmit} className="contact-form" action="https://formspree.io/f/xkgpnnzr" method="POST">
        {submitStatus === 'success' && (
          <Alert variant="success" className="contact-alert">
            <i className="fas fa-check-circle me-2"></i>
            ¡Mensaje enviado exitosamente! Te responderemos en las próximas 24 horas.
          </Alert>
        )}

        {submitStatus === 'error' && (
          <Alert variant="danger" className="contact-alert">
            <i className="fas fa-exclamation-circle me-2"></i>
            Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente.
          </Alert>
        )}

        <Row>
          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>
                <i className="fas fa-user me-1"></i>
                Nombre Completo *
              </Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Tu nombre completo"
            isInvalid={!!errors.name}
            className="form-input"
            required
          />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="form-group">
              <Form.Label>
                <i className="fas fa-envelope me-1"></i>
                Email *
              </Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="tu@email.com"
            isInvalid={!!errors.email}
            className="form-input"
            required
          />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={8}>
            <Form.Group className="form-group">
              <Form.Label>
                <i className="fas fa-tag me-1"></i>
                Asunto *
              </Form.Label>
              <Form.Control
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                placeholder="¿Sobre qué quieres contactarnos?"
                isInvalid={!!errors.subject}
                className="form-input"
                required
              />
              <Form.Control.Feedback type="invalid">
                {errors.subject}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="form-group">
              <Form.Label>
                <i className="fas fa-flag me-1"></i>
                Prioridad
              </Form.Label>
              <Form.Select
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                className="form-select"
              >
                {priorities.map(priority => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="form-group">
          <Form.Label>
            <i className="fas fa-folder me-1"></i>
            Categoría *
          </Form.Label>
          <Form.Select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            isInvalid={!!errors.category}
            className="form-select"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </Form.Select>
          {errors.category && (
            <Form.Control.Feedback type="invalid">
              {errors.category}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Form.Group className="form-group">
          <Form.Label>
            <i className="fas fa-comment me-1"></i>
            Mensaje *
          </Form.Label>
          <Form.Control
            as="textarea"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Escribe tu mensaje aquí..."
            rows={6}
            isInvalid={!!errors.message}
            className="form-textarea"
            required
          />
          <Form.Control.Feedback type="invalid">
            {errors.message}
          </Form.Control.Feedback>
          <div className="character-count">
            {formData.message.length}/500 caracteres
          </div>
        </Form.Group>

        <div className="form-footer">
          <div className="priority-indicator">
            <span className="priority-label">Prioridad:</span>
            <span className={`priority-badge priority-${getPriorityColor(formData.priority)}`}>
              {priorities.find(p => p.value === formData.priority)?.label}
            </span>
          </div>

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
                Enviar Mensaje
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default ContactForm;
