import "./LoadingScreen.css";

export default function LoadingScreen({ error }) {
  return (
    <div className="loading-container">
      <div className="loading-card">
        {!error ? (
          <>
            <p className="loading-text">Cargando la página</p>
            <div className="dots">
              <span className="dot">.</span>
              <span className="dot">.</span>
              <span className="dot">.</span>
            </div>
          </>
        ) : (
          <>
            <p className="error-title">
              Disculpe, en estos momentos tenemos problemas para conectar con la página
            </p>
            <p className="error-text">
              Verifique su conexión a internet o intente nuevamente.
            </p>
            <button onClick={() => window.location.reload()}>
              Recargar página
            </button>
          </>
        )}
      </div>
    </div>
  );
}
