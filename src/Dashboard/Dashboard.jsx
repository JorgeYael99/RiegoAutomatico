import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import axios from 'axios';

import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';
import { FiLogOut } from 'react-icons/fi'; // Assuming you also want to keep the logout button improved

// Make sure this path is correct
import './Dashboard.css';

const Dashboard = ({ nombre }) => {
  const navigate = useNavigate();

  const [barData, setBarData] = useState([
    { name: 'Humedad', value: 0 },
    { name: 'Temperatura', value: 0 },
  ]);

  const [pieData, setPieData] = useState([
    { name: 'Humedad', value: 0 },
    { name: 'Temperatura', value: 0 },
  ]);

  const [log, setLog] = useState([]);

  const COLORS = ['#9CCC65', '#558B2F']; // Verde lima, Verde oliva oscuro
  const RADIAN = Math.PI / 180;

  const handleLogout = () => {
    console.log('Cerrando sesión...');
    navigate('/'); // Redirect to the main page
  };

  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      percent > 0.05 && (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
          {`${(percent * 100).toFixed(0)}%`}
        </text>
      )
    );
  };

  useEffect(() => {
    const fetchData = () => {
      axios.get('http://localhost:5001/sensores')
        .then(res => {
          const humedad = Number(res.data.humedad);
          const temperatura = Number(res.data.temperatura);

          if (isNaN(humedad) || isNaN(temperatura)) {
            return;
          }

          setBarData([
            { name: 'Humedad', value: humedad },
            { name: 'Temperatura', value: temperatura },
          ]);

          setPieData([
            { name: 'Humedad', value: humedad },
            { name: 'Temperatura', value: temperatura },
          ]);

          setLog(prev => [
            ...prev.slice(-17),
            `humedad: ${humedad}, temperatura: ${temperatura}`
          ]);
        })
        .catch(err => {
          console.error('Error al obtener datos del backend:', err);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="container-fluid d-flex justify-content-center flex-column" style={{ position: 'relative' }}>

     {/* Main Card structure - assuming it's properly closed elsewhere */}
     <div className="card-body">
        <div
            className="card shadow p-4 text-white d-flex justify-content-between align-items-start"
            style={{
              maxWidth: '1300px', // Corrected from 13000px
              width: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.49)',
              borderRadius: '1rem',
              marginTop: '3rem',
              position: 'relative',
            }}
          >
            {/* Main Dashboard Content */}
            <div className="text-center" style={{ flexGrow: 1 }}>
              <div className="d-flex justify-content-center">
                <h2 className="mb-4">¡Hola {nombre}!</h2>
              </div>
              <p className="mb-4 text-center">Bienvenido al panel de control.</p>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <button className="btn btn-green-light" onClick={() => navigate('/plantas')}
                  style={{
                    padding: '5px 20px',
                    fontSize: '1.2em',
                  }}
                >Cultivos</button>
                <button className="btn btn-green-dark" onClick={() => navigate('/soporte')}
                  style={{
                    padding: '5px 20px',
                    fontSize: '1.2em',
                  }}
                >Soporte</button>
              
        {/* Logout Button - Keeping the improved styling */}
        <button className="btn btn-green-light" onClick={handleLogout}>
          <FiLogOut style={{ marginRight: '8px' }} />
          Salir de la cuenta
        </button>
      </div>
      


              {/* Main Container for Charts and Console */}
              <div className="mt-5 d-flex flex-wrap justify-content-center align-items-start gap-4">
{/* Charts Container */}
<div className="d-flex flex-column align-items-center" style={{ flex: '1 1 60%' }}>
  <h5 className="text-white mb-3">Estado de Cultivo</h5>
  <div
    className="d-flex flex-column align-items-center gap-4"
    style={{ width: '400%' }}
  >
    {/* Bar Chart */}
    <div style={{ width: '25%', height: 250, minWidth: '280px' }}>
      <ResponsiveContainer>
        <BarChart data={barData}>
          <XAxis dataKey="name" stroke="#fff" />
          <YAxis stroke="#fff" />
          <Tooltip />
          <Bar dataKey="value" fill="#9CCC65" />
        </BarChart>
      </ResponsiveContainer>
    </div>

    {/* Pie Chart (ahora abajo) */}
    <div style={{ width: '20%', height: 250, minWidth: '280px' }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={renderCustomizedLabel}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#fff', borderRadius: '5px', padding: '8px' }}
            itemStyle={{ color: '#fff' }}
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
  </div>
</div>


                {/* Data Console */}<div
  className="mt-2"
  style={{
    textAlign: 'center',
    flex: '2 2 36%',
    backgroundColor: '',
    fontFamily: 'Consolas, "Courier New", monospace',
    fontSize: '0.95em',
    lineHeight: '1.4',
    padding: '.5em',
    borderRadius: 'rem',
    borderRadius: '10px',
    height: '500px', // altura fija para evitar scroll y crecimiento
    overflow: 'hidden', // quita scroll
    textAlign: 'left',
    border: '1px solid rgb(0, 0, 0)',
    boxShadow: '0 0 15px rgba(0, 0, 0, 0.5), inset 0 0 8px rgba(0, 0, 0, 0.2)',
    textShadow: '0 0 5px rgba(231, 231, 231, 0.7)',
  }}
>

                  <h5 className="mb-3" style={{ textAlign: 'center' }}>Consola de Datos del  Sistema</h5>
                  {log.map((linea, index) => (
                    <div key={index} style={{ wordWrap: 'break-word', whiteSpace: 'pre-wrap' }}>{linea}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
    </section>
  );
};

export default Dashboard;