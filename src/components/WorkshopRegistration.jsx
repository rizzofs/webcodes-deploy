import { useState } from 'react';
import { Form, Button, Card, Container, Alert, Spinner } from 'react-bootstrap';
import { supabase } from '../supabaseClient';

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
        alert('⚠️ ¡Ya te has inscripto con este email!');
      } else {
        alert('Error al inscribirse: ' + error.message);
      }
    } else {
      setSuccess(true);
      // Opcional: Aquí podrías disparar el envío del Ticket Visual
    }
  };

  const handleChange = (e) => setFormData({...formData, [e.target.name]: e.target.value});

  if (success) {
    return (
      <Container className="d-flex justify-content-center mt-5">
        <Card className="text-center p-5 shadow-lg border-success">
          <Card.Body>
            <h2 className="text-success mb-4">¡Estás dentro, {formData.full_name.split(' ')[0]}! 🚀</h2>
            <p className="lead">Tu lugar en el taller "Tu Código es tu CV" está reservado.</p>
            <div className="d-grid gap-3 mt-4">
              <Button variant="primary" size="lg" href="https://discord.gg/8GAv7zsqWm" target="_blank">
                1. Unirme al Discord
              </Button>
              <Button variant="outline-dark" href="TU_LINK_CALENDAR">
                2. Agendar en Google Calendar
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="mt-5 mb-5" style={{ maxWidth: '600px' }}>
      <Card className="shadow border-0">
        <Card.Header className="bg-dark text-white p-4">
          <h3>🎓 Taller: Tu Código es tu CV</h3>
          <p className="mb-0 text-muted">Aprende Git, GitHub y crea tu Portafolio.</p>
        </Card.Header>
        <Card.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            
            <Form.Group className="mb-3">
              <Form.Label>Nombre Completo</Form.Label>
              <Form.Control required name="full_name" onChange={handleChange} placeholder="Como saldrá en el certificado" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control required type="email" name="email" onChange={handleChange} />
            </Form.Group>

            <div className="row">
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Sede / Centro Regional</Form.Label>
                  <Form.Select name="campus" onChange={handleChange}>
                    <option>Luján</option>
                    <option>Chivilcoy</option>
                    <option>San Miguel</option>
                    <option>Mercedes</option>
                    <option>Otro</option>
                  </Form.Select>
                </Form.Group>
              </div>
              <div className="col-md-6">
                <Form.Group className="mb-3">
                  <Form.Label>Usuario GitHub (Opcional)</Form.Label>
                  <Form.Control name="github_user" onChange={handleChange} placeholder="@usuario" />
                </Form.Group>
              </div>
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Nivel actual con la Terminal/Git</Form.Label>
              <Form.Range min="1" max="5" name="tech_level" onChange={handleChange} />
              <div className="d-flex justify-content-between text-muted small">
                <span>Miedo total 😱</span>
                <span>¡Soy un hacker! 💻</span>
              </div>
            </Form.Group>

            <div className="d-grid mt-4">
              <Button variant="success" size="lg" type="submit" disabled={loading}>
                {loading ? <Spinner size="sm" animation="border" /> : '🚀 Confirmar Inscripción'}
              </Button>
            </div>

          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}