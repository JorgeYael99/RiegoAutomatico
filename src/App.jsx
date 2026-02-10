import React, { useState, useEffect } from 'react';

import { Routes, Route } from 'react-router-dom';

import Formulario from './Formulario/formulario';

import Plantas from './pages/plantas';

import Soporte from './pages/soporte';

import Dashboard from './Dashboard/Dashboard';

import LoadingScreen from './components/LoadingScreen';

import NotFound from './components/NotFound';


export const App = () => {

const [nombre, setNombre] = useState('');
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);

 useEffect(() => {
    const timer = setTimeout(() => {
      setError(true);
      setLoading(false);
    }, 8000); // 8 segundos esperando conexión

    window.addEventListener("load", () => {
      clearTimeout(timer);
      setLoading(false);
    });

    return () => clearTimeout(timer);
  }, []);

  if (loading || error) {
    return <LoadingScreen error={error} />;
  }


return (

<Routes>

<Route path="/" element={<Formulario setNombre={setNombre} />} />

<Route path="/dashboard" element={<Dashboard nombre={nombre} />} />

<Route path="/admin/dashboard" element={<Dashboard nombre={nombre} />} /> {/* Asumo que el dashboard es el mismo, solo cambia la ruta */}

<Route path="/plantas" element={<Plantas />} />

<Route path="/soporte" element={<Soporte />} />

<Route path="*" element={<NotFound />} />

</Routes>

);

};



export default App;




