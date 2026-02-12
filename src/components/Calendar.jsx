import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form, Alert } from 'react-bootstrap';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    type: 'academic'
  });

  // Eventos del Calendario Académico UNLu 2026 para Sistemas de Información
  const sampleEvents = [
    {
      id: 1,
      title: 'Inscripción Exámenes Finales (Feb)',
      description: 'Inscripción a exámenes complementarios 2025 (Febrero 2026). Finaliza el 26/02/26.',
      date: '2026-02-02',
      time: '08:00',
      type: 'inscription',
      color: '#61dafb'
    },
    {
      id: 2,
      title: 'Turno de Exámenes (Feb)',
      description: 'Turno de exámenes complementarios 2025. Se extiende hasta el 28/02/26.',
      date: '2026-02-09',
      time: '08:00',
      type: 'academic',
      color: '#ff6b6b'
    },
    {
      id: 3,
      title: 'Inscripción Cursadas 1º Cuatrimestre',
      description: 'Inscripción en asignaturas para estudiantes regulares y aspirantes 2026. Finaliza el 05/03/26.',
      date: '2026-02-26',
      time: '08:00',
      type: 'inscription',
      color: '#61dafb'
    },
    {
      id: 4,
      title: 'Inicio 1er Cuatrimestre 2026',
      description: 'Comienzo de clases del primer cuatrimestre. Finaliza el 27/06/26.',
      date: '2026-03-09',
      time: '08:00',
      type: 'event',
      color: '#2a8a8d'
    },
    {
      id: 5,
      title: 'Inscripción Exámenes (Mayo)',
      description: 'Inscripción al turno extraordinario de exámenes de Mayo. Finaliza el 14/05/26.',
      date: '2026-05-04',
      time: '08:00',
      type: 'inscription',
      color: '#61dafb'
    },
    {
      id: 6,
      title: 'Turno de Exámenes (Mayo)',
      description: 'Turno extraordinario de exámenes de Mayo. Finaliza el 16/05/26.',
      date: '2026-05-11',
      time: '08:00',
      type: 'academic',
      color: '#ff6b6b'
    },
    {
      id: 7,
      title: 'Inscripción Exámenes (Jul/Ago)',
      description: 'Inscripción a exámenes finales de Julio-Agosto. Finaliza el 06/08/26.',
      date: '2026-06-29',
      time: '08:00',
      type: 'inscription',
      color: '#61dafb'
    },
    {
      id: 8,
      title: 'Turno de Exámenes (Julio)',
      description: 'Primer llamado del turno de exámenes Julio-Agosto. (Del 06/07 al 18/07 y del 03/08 al 08/08).',
      date: '2026-07-06',
      time: '08:00',
      type: 'academic',
      color: '#ff6b6b'
    },
    {
      id: 9,
      title: 'Receso Invernal',
      description: 'Receso Institucional de Invierno (Académico y Administrativo). Retoma el 31/07/26.',
      date: '2026-07-20',
      time: '00:00',
      type: 'holiday',
      color: '#4ecdc4'
    },
    {
      id: 10,
      title: 'Inscripción Cursadas 2º Cuatrimestre',
      description: 'Inscripción en asignaturas para el 2° Cuatrimestre. Finaliza el 10/08/26.',
      date: '2026-08-03',
      time: '08:00',
      type: 'inscription',
      color: '#61dafb'
    },
    {
      id: 11,
      title: 'Inicio 2do Cuatrimestre 2026',
      description: 'Comienzo de clases del segundo cuatrimestre. Finaliza el 05/12/26.',
      date: '2026-08-17',
      time: '08:00',
      type: 'event',
      color: '#2a8a8d'
    },
    {
      id: 12,
      title: 'Inscripción Exámenes (Sept)',
      description: 'Inscripción al turno extraordinario de exámenes de Septiembre. Finaliza el 01/10/26.',
      date: '2026-09-21',
      time: '08:00',
      type: 'inscription',
      color: '#61dafb'
    },
    {
      id: 13,
      title: 'Turno de Exámenes (Sept)',
      description: 'Turno extraordinario de exámenes de Septiembre. Finaliza el 03/10/26.',
      date: '2026-09-28',
      time: '08:00',
      type: 'academic',
      color: '#ff6b6b'
    },
    {
      id: 14,
      title: 'Inscripción Exámenes Finales (Dic)',
      description: 'Inscripción a exámenes finales de Diciembre 2026. Finaliza el 21/12/26.',
      date: '2026-12-07',
      time: '08:00',
      type: 'inscription',
      color: '#61dafb'
    },
    {
      id: 15,
      title: 'Turno de Exámenes (Dic)',
      description: 'Turno de exámenes finales de Diciembre 2026. Finaliza el 23/12/26.',
      date: '2026-12-10',
      time: '08:00',
      type: 'academic',
      color: '#ff6b6b'
    }
  ];

  useEffect(() => {
    // Cargar eventos locales por defecto
    setEvents(sampleEvents);
  }, []);

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Días del mes anterior
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({
        date: prevDate,
        isCurrentMonth: false,
        isToday: false
      });
    }

    // Días del mes actual
    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(year, month, day);
      const today = new Date();
      days.push({
        date: currentDate,
        isCurrentMonth: true,
        isToday: currentDate.toDateString() === today.toDateString()
      });
    }

    // Días del mes siguiente para completar la grilla
    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({
        date: nextDate,
        isCurrentMonth: false,
        isToday: false
      });
    }

    return days;
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      meeting: 'fas fa-users',
      workshop: 'fas fa-code',
      academic: 'fas fa-graduation-cap',
      event: 'fas fa-calendar-star'
    };
    return icons[type] || 'fas fa-calendar';
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    const event = {
      id: Date.now(),
      ...newEvent,
      color: getEventTypeColor(newEvent.type)
    };

    // Agregar evento local
    setEvents([...events, event]);

    setNewEvent({
      title: '',
      description: '',
      date: '',
      time: '',
      type: 'academic'
    });
    setShowModal(false);
  };

  const getEventTypeColor = (type) => {
    const colors = {
      meeting: '#2a8a8d',
      workshop: '#61dafb',
      academic: '#ff6b6b',
      event: '#4ecdc4'
    };
    return colors[type] || '#6c757d';
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const days = getDaysInMonth(currentDate);

  return (
    <section id="calendario" className="py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="section-title">Calendario CODES</h2>
          <p className="section-subtitle">
            Mantente al día con los eventos, reuniones y actividades del centro
          </p>
        </div>

        <Row>
          <Col lg={8}>
            <Card className="calendar-card">
              <Card.Header className="calendar-header">
                <div className="calendar-navigation">
                  <Button
                    variant="outline-primary"
                    onClick={() => navigateMonth(-1)}
                    className="nav-btn"
                  >
                    <i className="fas fa-chevron-left"></i>
                  </Button>
                  <h4 className="calendar-title">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h4>
                  <Button
                    variant="outline-primary"
                    onClick={() => navigateMonth(1)}
                    className="nav-btn"
                  >
                    <i className="fas fa-chevron-right"></i>
                  </Button>
                </div>
              </Card.Header>

              <Card.Body className="p-0">
                <div className="calendar-grid">
                  {/* Días de la semana */}
                  <div className="calendar-weekdays">
                    {dayNames.map(day => (
                      <div key={day} className="weekday">{day}</div>
                    ))}
                  </div>

                  {/* Días del calendario */}
                  <div className="calendar-days">
                    {days.map((day, index) => {
                      const dayEvents = getEventsForDate(day.date);
                      return (
                        <div
                          key={index}
                          className={`calendar-day ${!day.isCurrentMonth ? 'other-month' : ''} ${day.isToday ? 'today' : ''}`}
                          onClick={() => handleDateClick(day.date)}
                        >
                          <div className="day-number">{day.date.getDate()}</div>
                          <div className="day-events">
                            {dayEvents.slice(0, 2).map(event => (
                              <div
                                key={event.id}
                                className="event-dot"
                                style={{ backgroundColor: event.color }}
                                title={event.title}
                              ></div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="more-events">+{dayEvents.length - 2}</div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card className="events-sidebar">
              <Card.Header>
                <h5>Próximos Eventos</h5>
              </Card.Header>
              <Card.Body>
                {events
                  .filter(event => new Date(event.date) >= new Date())
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 5)
                  .map(event => (
                    <div key={event.id} className="event-item">
                      <div className="event-date">
                        <div className="event-day">{new Date(event.date).getDate()}</div>
                        <div className="event-month">
                          {monthNames[new Date(event.date).getMonth()].substring(0, 3)}
                        </div>
                      </div>
                      <div className="event-details">
                        <h6 className="event-title">{event.title}</h6>
                        <p className="event-time">
                          <i className="fas fa-clock"></i> {event.time}
                        </p>
                        <p className="event-description">{event.description}</p>
                      </div>
                      <div
                        className="event-type-indicator"
                        style={{ backgroundColor: event.color }}
                      ></div>
                    </div>
                  ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Modal para agregar eventos */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Agregar Evento</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={handleAddEvent}>
              <Form.Group className="mb-3">
                <Form.Label>Título del Evento</Form.Label>
                <Form.Control
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                />
              </Form.Group>

              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Fecha</Form.Label>
                    <Form.Control
                      type="date"
                      value={newEvent.date}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>Hora</Form.Label>
                    <Form.Control
                      type="time"
                      value={newEvent.time}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>Tipo de Evento</Form.Label>
                <Form.Select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent({ ...newEvent, type: e.target.value })}
                >
                  <option value="meeting">Reunión</option>
                  <option value="workshop">Taller</option>
                  <option value="academic">Académico</option>
                  <option value="event">Evento</option>
                </Form.Select>
              </Form.Group>

              <div className="d-flex justify-content-end gap-2">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancelar
                </Button>
                <Button variant="primary" type="submit">
                  Agregar Evento
                </Button>
              </div>
            </Form>
          </Modal.Body>
        </Modal>
      </Container>
    </section>
  );
};

export default Calendar;
