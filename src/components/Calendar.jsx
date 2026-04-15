import React, { useState, useEffect, useRef } from 'react';
import { Container, Row, Col, Modal } from 'react-bootstrap';
import './Calendar.css';
import { calendarEvents } from '../data/calendarEvents';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDayEvents, setSelectedDayEvents] = useState([]);
  const [selectedDateLabel, setSelectedDateLabel] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const particlesRef = useRef(null);

  useEffect(() => {
    setEvents(calendarEvents);
    setTimeout(() => setIsVisible(true), 300);

    // Crear partículas dinámicas
    if (particlesRef.current) {
      const container = particlesRef.current;
      for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'cal-particle';
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

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = new Date(year, month, -i);
      days.push({ date: prevDate, isCurrentMonth: false, isToday: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const today = new Date();
      days.push({
        date: d,
        isCurrentMonth: true,
        isToday: d.toDateString() === today.toDateString()
      });
    }

    const remainingDays = 42 - days.length;
    for (let day = 1; day <= remainingDays; day++) {
      const nextDate = new Date(year, month + 1, day);
      days.push({ date: nextDate, isCurrentMonth: false, isToday: false });
    }

    return days;
  };

  const getEventsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateStr);
  };

  const getEventTypeIcon = (type) => {
    const icons = {
      inscription: 'fas fa-pen-to-square',
      academic: 'fas fa-graduation-cap',
      event: 'fas fa-calendar-star',
      holiday: 'fas fa-umbrella-beach',
      meeting: 'fas fa-users',
      workshop: 'fas fa-code'
    };
    return icons[type] || 'fas fa-calendar';
  };

  const getEventTypeLabel = (type) => {
    const labels = {
      inscription: 'Inscripción',
      academic: 'Académico',
      event: 'Evento',
      holiday: 'Receso',
      meeting: 'Reunión',
      workshop: 'Taller'
    };
    return labels[type] || 'Evento';
  };

  const handleDateClick = (date) => {
    const dayEvents = getEventsForDate(date);
    if (dayEvents.length === 0) return;

    setSelectedDayEvents(dayEvents);
    setSelectedDateLabel(
      `${date.getDate()} de ${monthNames[date.getMonth()]} ${date.getFullYear()}`
    );
    setShowModal(true);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const days = getDaysInMonth(currentDate);

  // Leyenda de tipos de eventos
  const eventTypes = [
    { type: 'inscription', label: 'Inscripción', color: '#61dafb' },
    { type: 'academic', label: 'Académico', color: '#ff6b6b' },
    { type: 'event', label: 'Evento', color: '#2a8a8d' },
    { type: 'holiday', label: 'Receso', color: '#4ecdc4' }
  ];

  return (
    <section id="calendario" className="cal-section">
      {/* Elementos decorativos */}
      <div className="cal-particles" ref={particlesRef}></div>
      <div className="cal-geometric-shapes">
        <div className="cal-shape cal-shape-1"></div>
        <div className="cal-shape cal-shape-2"></div>
        <div className="cal-shape cal-shape-3"></div>
      </div>
      <div className="cal-gradient-overlay"></div>

      {/* Hero */}
      <div className="cal-hero-section">
        <Container>
          <div className={`cal-hero-content ${isVisible ? 'visible' : ''}`}>
            <div className="cal-badge">
              <span><i className="fas fa-calendar-alt me-2"></i>Calendario Académico 2026</span>
            </div>
            <h1 className="cal-hero-title">Calendario CODES++</h1>
            <p className="cal-hero-subtitle">
              Mantente al día con las fechas clave del calendario académico, inscripciones, exámenes y actividades del centro
            </p>
          </div>
        </Container>
      </div>

      {/* Leyenda */}
      <Container>
        <div className={`cal-legend ${isVisible ? 'visible' : ''}`}>
          {eventTypes.map(et => (
            <div key={et.type} className="cal-legend-item">
              <span className="cal-legend-dot" style={{ backgroundColor: et.color }}></span>
              <span className="cal-legend-label">{et.label}</span>
            </div>
          ))}
        </div>
      </Container>

      {/* Contenido principal */}
      <Container>
        <Row className="cal-main-row">
          {/* Calendario */}
          <Col lg={8} className="mb-4 mb-lg-0">
            <div className="cal-card">
              <div className="cal-card-header">
                <div className="cal-navigation">
                  <button className="cal-nav-btn" onClick={() => navigateMonth(-1)} aria-label="Mes anterior">
                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <div className="cal-month-year">
                    <h3>{monthNames[currentDate.getMonth()]}</h3>
                    <span>{currentDate.getFullYear()}</span>
                  </div>
                  <button className="cal-nav-btn" onClick={() => navigateMonth(1)} aria-label="Mes siguiente">
                    <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
                <button className="cal-today-btn" onClick={goToToday}>
                  <i className="fas fa-crosshairs me-1"></i>Hoy
                </button>
              </div>

              <div className="cal-grid">
                <div className="cal-weekdays">
                  {dayNames.map(day => (
                    <div key={day} className="cal-weekday">{day}</div>
                  ))}
                </div>

                <div className="cal-days">
                  {days.map((day, index) => {
                    const dayEvents = getEventsForDate(day.date);
                    const hasEvents = dayEvents.length > 0;
                    return (
                      <div
                        key={index}
                        className={`cal-day ${!day.isCurrentMonth ? 'cal-day--other' : ''} ${day.isToday ? 'cal-day--today' : ''} ${hasEvents ? 'cal-day--has-events' : ''}`}
                        onClick={() => handleDateClick(day.date)}
                        role={hasEvents ? 'button' : undefined}
                        tabIndex={hasEvents ? 0 : undefined}
                        aria-label={hasEvents ? `${day.date.getDate()} - ${dayEvents.length} evento(s)` : undefined}
                      >
                        <div className="cal-day-number">{day.date.getDate()}</div>
                        {hasEvents && (
                          <div className="cal-day-dots">
                            {dayEvents.slice(0, 3).map(event => (
                              <span
                                key={event.id}
                                className="cal-dot"
                                style={{ backgroundColor: event.color }}
                              ></span>
                            ))}
                            {dayEvents.length > 3 && (
                              <span className="cal-dot-more">+{dayEvents.length - 3}</span>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Col>

          {/* Sidebar: Próximos eventos */}
          <Col lg={4}>
            <div className="cal-sidebar">
              <div className="cal-sidebar-header">
                <i className="fas fa-bolt me-2"></i>
                <h5>Próximos Eventos</h5>
              </div>
              <div className="cal-sidebar-body">
                {events
                  .filter(event => new Date(event.date + 'T00:00:00') >= new Date(new Date().toDateString()))
                  .sort((a, b) => new Date(a.date) - new Date(b.date))
                  .slice(0, 5)
                  .map(event => {
                    const eventDate = new Date(event.date + 'T00:00:00');
                    return (
                      <div key={event.id} className="cal-event-item" onClick={() => {
                        setSelectedDayEvents([event]);
                        setSelectedDateLabel(`${eventDate.getDate()} de ${monthNames[eventDate.getMonth()]} ${eventDate.getFullYear()}`);
                        setShowModal(true);
                      }}>
                        <div className="cal-event-date-badge" style={{ borderColor: event.color }}>
                          <span className="cal-event-day">{eventDate.getDate()}</span>
                          <span className="cal-event-month">{monthNames[eventDate.getMonth()].substring(0, 3)}</span>
                        </div>
                        <div className="cal-event-info">
                          <h6>{event.title}</h6>
                          <div className="cal-event-meta">
                            <span className="cal-event-type-tag" style={{ backgroundColor: event.color + '22', color: event.color, borderColor: event.color + '44' }}>
                              <i className={getEventTypeIcon(event.type) + ' me-1'}></i>
                              {getEventTypeLabel(event.type)}
                            </span>
                            {event.time && event.time !== '00:00' && (
                              <span className="cal-event-time">
                                <i className="fas fa-clock me-1"></i>{event.time} hs
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="cal-event-indicator" style={{ backgroundColor: event.color }}></div>
                      </div>
                    );
                  })}
                {events.filter(event => new Date(event.date + 'T00:00:00') >= new Date(new Date().toDateString())).length === 0 && (
                  <div className="cal-no-events">
                    <i className="fas fa-calendar-check"></i>
                    <p>No hay eventos próximos</p>
                  </div>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Modal de detalle de eventos */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered className="cal-modal">
        <div className="cal-modal-content">
          <div className="cal-modal-header">
            <div className="cal-modal-header-info">
              <i className="fas fa-calendar-day me-2"></i>
              <h5>{selectedDateLabel}</h5>
            </div>
            <button className="cal-modal-close" onClick={() => setShowModal(false)} aria-label="Cerrar">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="cal-modal-body">
            {selectedDayEvents.length === 0 ? (
              <div className="cal-no-events">
                <i className="fas fa-calendar-xmark"></i>
                <p>No hay eventos este día</p>
              </div>
            ) : (
              selectedDayEvents.map(event => (
                <div key={event.id} className="cal-modal-event">
                  <div className="cal-modal-event-bar" style={{ backgroundColor: event.color }}></div>
                  <div className="cal-modal-event-content">
                    <div className="cal-modal-event-header">
                      <span className="cal-modal-event-icon" style={{ backgroundColor: event.color + '22', color: event.color }}>
                        <i className={getEventTypeIcon(event.type)}></i>
                      </span>
                      <div>
                        <h6>{event.title}</h6>
                        <span className="cal-modal-event-type" style={{ color: event.color }}>
                          {getEventTypeLabel(event.type)}
                        </span>
                      </div>
                    </div>
                    {event.time && event.time !== '00:00' && (
                      <div className="cal-modal-event-detail">
                        <i className="fas fa-clock"></i>
                        <span>{event.time} hs</span>
                      </div>
                    )}
                    <p className="cal-modal-event-desc">{event.description}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Modal>
    </section>
  );
};

export default Calendar;
