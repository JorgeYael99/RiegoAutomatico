import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { BarChart, Bar, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Nuevo componente para visualizar el nivel de agua
const WaterLevelDisplay = ({ humidity }) => {
  const waterHeight = humidity > 100 ? 100 : humidity < 0 ? 0 : humidity; // Asegura que esté entre 0 y 100
  const backgroundColor = waterHeight < 30 ? '#dc3545' : // Rojo si es bajo
                          waterHeight < 60 ? '#ffc107' : // Amarillo si es medio
                          '#28a745'; // Verde si es óptimo

  return (
    <div className="water-level-container">
      <div
        className="water-level-fill"
        style={{
          height: `${waterHeight}%`,
          backgroundColor: backgroundColor,
        }}
      ></div>
      <div className="water-level-percentage">{humidity}%</div>
    </div>
  );
};


const Plantas = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [newPlant, setNewPlant] = useState({ nombre: '', humedad: '', temperatura: '' });
  const [flores, setFlores] = useState([
    { nombre: 'Cempoalxóchitl', humedad: 60, temperatura: 20 },
    { nombre: 'Dalia', humedad: 80, temperatura: 25 },
    { nombre: 'Gladiola', humedad: 70, temperatura: 22 },
  ]);

  const verdurasData = [
    { name: 'Espinaca', value: 30, humedad: 75, temperatura: 18 },
    { name: 'Lechuga', value: 45, humedad: 85, temperatura: 16 },
    { name: 'Cilantro', value: 25, humedad: 90, temperatura: 20 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    return percent > 0.01 ? (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = () => setShowModal(true);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewPlant({ ...newPlant, [name]: value });
  };

  const handleAddPlant = () => {
    if (newPlant.nombre && newPlant.humedad && newPlant.temperatura) {
      setFlores([...flores, {
        nombre: newPlant.nombre,
        humedad: parseInt(newPlant.humedad),
        temperatura: parseInt(newPlant.temperatura),
      }]);
      setNewPlant({ nombre: '', humedad: '', temperatura: '' });
      handleCloseModal();
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  return (
    <Container className="main-container py-4 text-white">
      <h1 className="text-center mb-4">Panel de cultivos</h1>

      <div className="text-center mt-4">
        <Button className="btn-volver me-2" onClick={() => navigate('/dashboard')}>
          Volver al Inicio
        </Button>
        <Button className="btn-volver ms-2" onClick={handleShowModal}>
          Añadir Planta
        </Button>
      </div>

      <Row className="g-4 mt-5">
        {flores.map((flor, index) => (
          <Col key={index} md={6} lg={4} className="mb-5">
            <h3 className="text-center mb-3">{flor.nombre}</h3>
            {/* Contenedor del gráfico de barras existente */}
            <div style={{ marginBottom: '20px' }}> {/* Reduje el margen inferior para el indicador de agua */}
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[flor]} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="humedad" fill="#8884d8" name="Humedad (%)" />
                  <Bar dataKey="temperatura" fill="#82ca9d" name="Temperatura (°C)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            {/* Nuevo: Indicador de nivel de agua debajo del gráfico de barras */}
            <div className="d-flex justify-content-center mt-3"> {/* Centrar el indicador */}
              <WaterLevelDisplay humidity={flor.humedad} />
            </div>
          </Col>
        ))}
      </Row>

      <Row className="g-4 mt-4">
        {verdurasData.map((verdura, index) => (
          <Col key={index} md={4} sm={6} xs={12} className="mb-4">
            <h3 className="text-center mb-3">{verdura.name}</h3>
            {/* Contenedor del gráfico de pastel existente */}
            <div style={{ width: '115%', height: 200, marginBottom: '20px' }}> {/* Reduje el margen inferior para el indicador de agua */}
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={[verdura]}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                    label={renderCustomizedLabel}
                  >
                    {/* Assuming you want different colors for each */}
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#fff', borderRadius: '5px', padding: '8px' }}
                    itemStyle={{ color: '#fff' }}
                    formatter={(value, name) => [`${value}`, name]} // Customize tooltip content
                  />
                  <Legend
                    layout="vertical"
                    align="right"
                    verticalAlign="middle"
                    wrapperStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <p className="text-center mt-2">Humedad: {verdura.humedad}%</p>
            <p className="text-center">Temperatura: {verdura.temperatura}°C</p>
            {/* Nuevo: Indicador de nivel de agua al lado de los párrafos de info */}
            <div className="d-flex justify-content-center mt-3"> {/* Centrar el indicador */}
              <WaterLevelDisplay humidity={verdura.humedad} />
            </div>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Añadir Nueva Planta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de la Planta</Form.Label>
              <Form.Control
                type="text"
                placeholder="Ej: Rosa"
                name="nombre"
                value={newPlant.nombre}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Humedad Requerida (%)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ej: 70"
                name="humedad"
                value={newPlant.humedad}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Temperatura Requerida (°C)</Form.Label>
              <Form.Control
                type="number"
                placeholder="Ej: 22"
                name="temperatura"
                value={newPlant.temperatura}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddPlant}>
            Añadir
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Plantas;