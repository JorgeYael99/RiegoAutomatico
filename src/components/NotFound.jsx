import '../components/LoadingScreen.css';

const NotFound = () => {
  return (
    <div className="loading-container">
      <div className="loading-card">
        <h1 style={{ fontSize: '80px', margin: '0', color: '#1e7f5c' }}>
          404
        </h1>
        
        <div className="error-title" style={{ fontSize: '24px', margin: '10px 0' }}>
          ¡Ups! Página no encontrada
        </div>
        
        <p className="error-text">
          Parece que la planta que buscas no ha crecido en este jardín.
          Verifica la URL o regresa al inicio.
        </p>

        <Link to="/">
          <button>
            Regresar al Dashboard
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;