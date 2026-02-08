import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import activitiesService from '../services/activitiesService';
import './Events.css';

const Events = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const data = await activitiesService.getAll();
        // Filtrar actividades futuras solamente? O mostrarlas todas?
        // Por ahora todas, ordenadas por fecha
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) return null;

  return (
    <section id="eventos" className="py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="section-title">📅 Próximas Actividades</h2>
          <p className="section-subtitle">
            Mantente al tanto de nuestros próximos eventos y actividades
          </p>
        </div>

        {activities.length > 0 ? (
          <Row className="justify-content-center">
             {activities.map((activity) => (
                <Col md={6} lg={4} key={activity.id} className="mb-4">
                  <Card className="h-100 shadow-sm border-0 event-card">
                    {activity.image_url && (
                      <Card.Img variant="top" src={activity.image_url} style={{ height: '200px', objectFit: 'cover' }} />
                    )}
                    <Card.Body>
                      <div className="text-primary mb-2">
                        <i className="bi bi-calendar-event me-2"></i>
                        {new Date(activity.date).toLocaleString()}
                      </div>
                      <Card.Title>{activity.title}</Card.Title>
                      <Card.Text className="text-muted small">
                        <i className="bi bi-geo-alt me-1"></i> {activity.location}
                      </Card.Text>
                      <Card.Text>{activity.description}</Card.Text>
                      {activity.registration_link && (
                        <Button variant="primary" href={activity.registration_link} target="_blank">
                          Inscribirse
                        </Button>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
             ))}
          </Row>
        ) : (
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <div className="event-card">
                <div className="event-content text-center">
                  <i className="bi bi-calendar-check" style={{ fontSize: '3rem', color: 'var(--primary-color)' }}></i>
                  <h4 className="mt-3">Próximamente</h4>
                  <p className="text-muted">
                    Estamos preparando nuevas actividades y eventos para la comunidad. 
                    ¡Mantente atento a nuestras redes sociales para más información!
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </section>
  );
};

export default Events;
