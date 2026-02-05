import React from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';

const Soporte = () => {
  const navigate = useNavigate();

  return (
    <Container className="main-container py-4 text-white">
      <h1 className="text-center mb-4">Soporte</h1>

      {/* Botón para volver al inicio */}
      <div className="text-center mt-4">
        <button className="btn btn-volver" onClick={() => navigate('/dashboard')}>
          Volver al menu
        </button>
      </div>

      {/* Servicios ofrecidos */}
      <section className="servicios-ofrecidos mt-5">
        <h2 className="text-center mb-3">Informacion de Contactos</h2>
        <Row className="justify-content-center g-4">
          <Col xs={12} md={6} lg={4}>
            <Card className="h-100 shadow bg-transparent border-light text-white text-center">
              <Card.Body>
                <i className="bi bi-wrench display-4 mb-3"></i>
                <Card.Title>Teléfonos:</Card.Title>
                <p>+ 52 (55) 80262733</p>
                <p>+ 52 (55) 51493022</p>
                <p>+ 52 (22) 02323158</p>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Card className="h-100 shadow bg-transparent border-light text-white text-center">
              <Card.Body>
                <i className="bi bi-shield-check display-4 mb-3"></i>
                <Card.Title>Correos Electrónicos:</Card.Title>
                <p>soporte@cultivos.com</p>
                <p>atencion@cultivos.com</p>
              </Card.Body>
            </Card>
          </Col>

          <Col xs={12} md={6} lg={4}>
            <Card className="h-100 shadow bg-transparent border-light text-white text-center">
              <Card.Body>
                <i className="bi bi-chat-dots display-4 mb-3"></i>
                <Card.Title>Horario de Atención:</Card.Title>
                <p>Lunes a Viernes: 9:00 AM - 6:00 PM</p>
                <p>Sábado: 10:00 AM - 2:00 PM</p>
                <p>Domingo: Cerrado</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </section>
    </Container>
  );
};

export default Soporte;