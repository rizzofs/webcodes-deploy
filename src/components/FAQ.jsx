import React from 'react';
import { Container, Accordion } from 'react-bootstrap';
import './FAQ.css';

const FAQ = () => {
  const faqs = [
    {
      question: "¿Cómo me cambio de plan de estudios?",
      answer: "Para cambiar de plan de estudios, debés enviar un mail a tramitesunlu@unlu.edu.ar con tu DNI y las materias que tenés aprobadas. El trámite se realiza a través de la secretaría académica."
    },
    {
      question: "¿Por qué perdí la regularidad?",
      answer: "Se pierde la regularidad si no aprobás al menos dos materias con final en un año calendario. Es importante mantener un ritmo constante de estudio para conservar la regularidad."
    },
    {
      question: "¿Cómo puedo participar de las actividades del centro?",
      answer: "Podés participar siguiendo nuestras redes sociales, uniéndote al servidor de Discord, o contactándonos directamente. Todas nuestras actividades son gratuitas y abiertas a todos los estudiantes."
    },
    {
      question: "¿Qué beneficios tengo como estudiante de Sistemas?",
      answer: "Como estudiante de la carrera, tenés acceso a bibliografía recomendada, grupos de estudio, talleres especializados, competencias de programación, y una red de apoyo estudiantil."
    },
    {
      question: "¿Cómo puedo contactar al centro de estudiantes?",
      answer: "Podés contactarnos a través de nuestro email codes.unlu@gmail.com, nuestras redes sociales (@codes_unlu), o el servidor de Discord. También podés acercarte a las actividades presenciales."
    }
  ];

  return (
    <section id="faq" className="py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="section-title">Preguntas Frecuentes</h2>
          <p className="section-subtitle">
            Resolvemos las dudas más comunes de los estudiantes
          </p>
        </div>

        <Accordion className="mx-auto" style={{ maxWidth: '800px' }}>
          {faqs.map((faq, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header>
                {faq.question}
              </Accordion.Header>
              <Accordion.Body>
                <p>{faq.answer}</p>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      </Container>
    </section>
  );
};

export default FAQ;

