import React, { useEffect } from 'react'; // <--- 1. Agregamos useEffect
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// React Router: Agregamos useLocation para saber en qué página estamos
import { BrowserRouter, useLocation } from 'react-router-dom'; // <--- 2. Agregamos useLocation

// Importamos la librería de Analytics
import ReactGA from "react-ga4"; // <--- 3. Importamos la librería

import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './App.css';

// --- CONFIGURACIÓN DE ANALYTICS ---
// Inicializamos con tu ID
ReactGA.initialize("G-GQQCMMPJSW"); // <--- 4. Tu ID va aquí

// Este componente "escucha" los cambios de página
function RastreadorDeVisitas() {
  const location = useLocation();

  useEffect(() => {
    // Envía el aviso a Google
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
    console.log("Visita registrada en Analytics:", location.pathname);
  }, [location]);

  return null; // No dibuja nada en pantalla, solo trabaja en el fondo
}
// ----------------------------------

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* 5. Ponemos el rastreador DENTRO del Router pero ANTES de la App */}
      <RastreadorDeVisitas /> 
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);