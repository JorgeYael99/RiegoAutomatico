import React, { useState } from 'react';

import { Routes, Route } from 'react-router-dom';

import Formulario from './Formulario/formulario';

import Plantas from './pages/plantas';

import Soporte from './pages/soporte';

import Dashboard from './Dashboard/Dashboard';



export const App = () => {

const [nombre, setNombre] = useState('');



return (

<Routes>

<Route path="/" element={<Formulario setNombre={setNombre} />} />

<Route path="/dashboard" element={<Dashboard nombre={nombre} />} />

<Route path="/admin/dashboard" element={<Dashboard nombre={nombre} />} /> {/* Asumo que el dashboard es el mismo, solo cambia la ruta */}

<Route path="/plantas" element={<Plantas />} />

<Route path="/soporte" element={<Soporte />} />

</Routes>

);

};



export default App;




