import "./LoadingScreen.css";

export default function LoadingScreen({ error }) {
  return (
    <div className="loading-container">
      {!error ? (
        <p>
          Por favor espere mientras carga la página
          <span className="dot">.</span>
          <span className="dot">.</span>
          <span className="dot">.</span>
        </p>
      ) : (
        <>
          <p className="error-title">
            Disculpe, en estos momentos tenemos problemas para conectar con la página.
          </p>
          <p>Verifique su conexión a internet o intente nuevamente.</p>
          <button onClick={() => window.location.reload()}>
            Recargar página
          </button>
        </>
      )}
    </div>
  );
}
