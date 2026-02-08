import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const Members = () => {
  const members = [
    {
      name: "Federico Rizzo",
      role: "Presidente",
      image: "/assets/images/fede.jpg",
      linkedin: "https://www.linkedin.com/in/federico-s-rizzo"
    },
    {
      name: "Juan Cruz Rodríguez",
      role: "Vice Presidente",
      image: "/assets/images/juan.jpg",
      linkedin: "https://www.linkedin.com/in/juan-cruz-rodriguez-731609218/"
    },
    {
      name: "Romina Ortiz",
      role: "Secretaria",
      image: "/assets/images/romi.jpeg",
      linkedin: "https://www.linkedin.com/in/romina-ortiz/"
    },
    {
      name: "Bautista Pereyra Buch",
      role: "Tesorero",
      image: "/assets/images/bau.jpeg",
      linkedin: "https://www.linkedin.com/in/bautista-pereyra-buch/"
    }
  ];

  const vocales = [
    { name: "Franco Marón", role: "Vocal" },
    { name: "Jeronimo Cardu Goldsworthy", role: "Vocal" },
    { name: "Blas Martín Andrade", role: "Vocal" },
    { name: "Marcelo Argañaraz", role: "Vocal" },
    { name: "Octavio Giaccaglia", role: "Vocal" }
  ];

  return (
    <section id="integrantes" className="py-5" role="region" aria-labelledby="members-title">
      <Container>
        <div className="text-center mb-5">
          <h2 id="members-title" className="section-title">Integrantes</h2>
          <p className="section-subtitle">
            Conocé al equipo que forma parte de la comisión directiva
          </p>
        </div>

        {/* Comisión Directiva */}
        <div className="mb-5" role="region" aria-labelledby="directiva-title">
          <h3 id="directiva-title" className="text-center mb-4" style={{color: 'var(--primary)', fontWeight: '600'}}>
            Comisión Directiva
          </h3>
          <Row role="list" aria-label="Miembros de la comisión directiva">
            {members.map((member, index) => (
              <Col sm={6} md={4} lg={3} className="mb-4" key={index} role="listitem">
                <Card className="member-card">
                  <img 
                    src={member.image} 
                    alt={`Foto de ${member.name}, ${member.role} de CODES++`}
                    className="member-avatar"
                    loading="lazy"
                  />
                  <Card.Body className="text-center">
                    <h5 className="member-name">{member.name}</h5>
                    <p className="member-role">{member.role}</p>
                    <a 
                      href={member.linkedin} 
                      className="btn-linkedin"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Ver perfil de LinkedIn de ${member.name}`}
                    >
                      <i className="bi bi-linkedin" aria-hidden="true"></i>
                      LinkedIn
                    </a>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* Vocales */}
        <div role="region" aria-labelledby="vocales-title">
          <h3 id="vocales-title" className="text-center mb-4" style={{color: 'var(--primary)', fontWeight: '600'}}>
            Vocales
          </h3>
          <div className="vocales-grid" role="list" aria-label="Miembros vocales">
            {vocales.map((vocal, index) => (
              <div key={index} className="vocal-item" role="listitem">
                <div className="vocal-name">{vocal.name}</div>
                <div className="vocal-role">{vocal.role}</div>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Members;
