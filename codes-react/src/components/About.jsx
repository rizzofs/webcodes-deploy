import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './About.css';

const About = () => {

  const values = [
    {
      icon: 'fas fa-code-branch',
      title: 'Solidaridad',
      description: 'Apoyamos a nuestros compañeros en su trayectoria académica'
    },
    {
      icon: 'fas fa-cogs',
      title: 'Compromiso',
      description: 'Trabajamos activamente por mejorar la calidad educativa'
    },
    {
      icon: 'fas fa-search',
      title: 'Transparencia',
      description: 'Mantenemos informada a la comunidad sobre nuestras acciones'
    },
    {
      icon: 'fas fa-rocket',
      title: 'Innovación',
      description: 'Buscamos nuevas formas de apoyar a los estudiantes'
    },
    {
      icon: 'fas fa-network-wired',
      title: 'Inclusión',
      description: 'Creamos espacios accesibles para todos los estudiantes'
    },
    {
      icon: 'fas fa-trophy',
      title: 'Excelencia',
      description: 'Promovemos la excelencia académica y profesional'
    },
    {
      icon: 'fas fa-microchip',
      title: 'Pasión',
      description: 'Trabajamos con entusiasmo y dedicación por nuestros objetivos'
    },
    {
      icon: 'fas fa-laptop-code',
      title: 'Formación',
      description: 'Promovemos el crecimiento académico y profesional continuo'
    }
  ];

  return (
    <section id="nosotros" className="py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="section-title">¿Quiénes somos?</h2>
          <p className="section-subtitle">
            Somos el Centro Organizado de Estudiantes de Sistemas (CODES++), un
            espacio creado por estudiantes y para estudiantes.
          </p>
        </div>

        {/* Historia Detallada */}
        <Row className="justify-content-center mb-5">
          <Col lg={10}>
            <div className="card p-4">
              <h3 className="text-center mb-4" style={{color: 'var(--primary)'}}>
                Nuestra Historia
              </h3>
              <Row>
                <Col md={6}>
                  <h5>
                    <i className="bi bi-calendar-event text-primary me-2"></i>
                    Nacimiento y Fundación
                  </h5>
                  <p className="text-justify">
                    CODES++ nació de la necesidad de reconstruir la representación
                    estudiantil en la carrera de Sistemas, luego de quedar acéfala
                    tras la pandemia. A mediados de 2022, un grupo de estudiantes
                    comprometidos comenzó a organizar un nuevo centro, al que
                    decidieron llamar CODES++. En octubre de 2022 se realizaron
                    las elecciones correspondientes, en las cuales fueron electas
                    las primeras autoridades del centro. Cumpliendo con el
                    reglamento vigente, dos años más tarde, en octubre de 2024, se
                    renovaron los miembros mediante una nueva elección.
                  </p>
                  <p className="text-justify">
                    Fuimos electos como centro de estudiantes con el objetivo
                    claro de representar, acompañar y potenciar a toda la
                    comunidad de la carrera, promoviendo iniciativas académicas,
                    sociales y profesionales.
                  </p>
                </Col>
                <Col md={6}>
                  <h5>
                    <i className="bi bi-bullseye text-primary me-2"></i>Nuestra Misión
                  </h5>
                  <p className="text-justify">
                    Nuestra misión es crear una comunidad unida, solidaria y
                    comprometida con el crecimiento colectivo. Trabajamos
                    activamente para representar los intereses tanto de
                    estudiantes como de personas graduadas de la carrera.
                  </p>
                  <p className="text-justify">
                    Participamos en comisiones académicas, órganos de gobierno
                    universitario y espacios de decisión donde llevamos la voz del
                    estudiantado, impulsando talleres, charlas, espacios de
                    acompañamiento y propuestas que enriquecen la vida
                    universitaria.
                  </p>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/* Logros y Reconocimientos */}
        <Row className="justify-content-center mb-5">
          <Col lg={10}>
            <div className="card p-4">
              <h3 className="text-center mb-4" style={{color: 'var(--primary)'}}>
                Logros y Reconocimientos
              </h3>
              <Row>
                <Col md={4} className="text-center mb-3">
                  <div className="achievement-item">
                    <i
                      className="bi bi-trophy text-primary"
                      style={{fontSize: '2.5rem'}}
                    ></i>
                    <h5 className="mt-2">Elección Democrática</h5>
                    <p>Electos como centro de estudiantes en octubre de 2024</p>
                  </div>
                </Col>
                <Col md={4} className="text-center mb-3">
                  <div className="achievement-item">
                    <i
                      className="bi bi-people text-primary"
                      style={{fontSize: '2.5rem'}}
                    ></i>
                    <h5 className="mt-2">Representación Activa</h5>
                    <p>
                      Participación en comisiones académicas y órganos de
                      cogobierno
                    </p>
                  </div>
                </Col>
                <Col md={4} className="text-center mb-3">
                  <div className="achievement-item">
                    <i
                      className="bi bi-lightbulb text-primary"
                      style={{fontSize: '2.5rem'}}
                    ></i>
                    <h5 className="mt-2">Iniciativas Innovadoras</h5>
                    <p>Desarrollo de talleres, mentorías y programas de apoyo</p>
                  </div>
                </Col>
              </Row>
            </div>
          </Col>
        </Row>

        {/* Valores */}
        <Row className="justify-content-center">
          <Col lg={12}>
            <div className="card p-4">
              <h3 className="text-center mb-5" style={{color: 'var(--primary)'}}>
                Nuestros Valores
              </h3>
              
              {/* Grid Layout */}
              <div className="values-grid">
                {values.map((value, index) => (
                  <div key={index} className="value-card">
                    <div className="value-icon">
                      <i className={value.icon}></i>
                    </div>
                    <h4 className="value-title">{value.title}</h4>
                    <p className="value-description">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default About;

