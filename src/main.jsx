import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';

// React Router
import { BrowserRouter } from 'react-router-dom';

// Bootstrap y estilos personalizados
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './App.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);

