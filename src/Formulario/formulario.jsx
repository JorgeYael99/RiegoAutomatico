import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Importa los íconos de react-icons
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa';

export function Formulario({ setNombre }) {
  const [nombreInput, setNombreInput] = useState('');
  const [password, setPassword] = useState('');
  const [nombreRegistro, setNombreRegistro] = useState('');
  const [passwordRegistro, setPasswordRegistro] = useState('');
  const [error, setError] = useState(''); // Este estado se usa para mensajes de error Y éxito
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    if (!nombreInput || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: nombreInput,
          password: password,
        }),
        credentials: 'include',
      });

      const data = await response.json();

      console.log('Login Response:', data);

      if (data && data.success) {
        setNombre(nombreInput);
        navigate(data.redirect);
      } else {
        setError(data?.message || 'Error en el inicio de sesión.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
      console.error('Fetch Error:', err);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos

    if (!nombreRegistro || !passwordRegistro) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: nombreRegistro,
          password: passwordRegistro,
        }),
      });

      const data = await response.json();

      console.log('Register Response:', data);

      if (data && data.success) {
        setError('Registro exitoso. Puedes iniciar sesión ahora.');
        setIsRegistering(false); // Regresar al formulario de inicio de sesión
      } else {
        setError(data?.message || 'Error en el registro.');
      }
    } catch (err) {
      setError('Error de conexión con el servidor.');
      console.error('Fetch Error:', err);
    }
  };

  return (
    <section className="container-fluid d-flex flex-column justify-content-center align-items-center vh-100">
      {/* Título principal añadido aquí con texto blanco */}
      <h1 className="text-center mb-4 text-white fw-bold display-4">Huerto Automatizado</h1>
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body">
          {/* El título "Registrar Usuario" / "Iniciar Sesión" ya es blanco por la clase text-white */}
          <h2 className="text-center mb-4 text-white">{isRegistering ? 'Registrar Usuario' : 'Iniciar Sesión'}</h2>

          {/* Mensajes de error/éxito mejorados */}
          {error && (
            <div className={`feedback-message ${error.includes('exitoso') ? 'feedback-success' : 'feedback-error'}`}>
              {error}
            </div>
          )}

          <form onSubmit={isRegistering ? handleRegisterSubmit : handleLoginSubmit}>
            {isRegistering && (
              <>
                <div className="mb-3">
                  <input
                    type="text"
                    value={nombreRegistro}
                    onChange={(e) => setNombreRegistro(e.target.value)}
                    placeholder="Nombre de usuario"
                    className="form-control custom-input" // Agregamos una clase para estilizar
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    value={passwordRegistro}
                    onChange={(e) => setPasswordRegistro(e.target.value)}
                    placeholder="Contraseña"
                    className="form-control custom-input" // Agregamos una clase para estilizar
                  />
                </div>
              </>
            )}
            {!isRegistering && (
              <>
                <div className="mb-3">
                  <input
                    type="text"
                    value={nombreInput}
                    onChange={(e) => setNombreInput(e.target.value)}
                    placeholder="Nombre de usuario"
                    className="form-control custom-input" // Agregamos una clase para estilizar
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Contraseña"
                    className="form-control custom-input" // Agregamos una clase para estilizar
                  />
                </div>
              </>
            )}
            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                {isRegistering ? 'Registrar' : 'Iniciar sesión'}
              </button>
            </div>
          </form>
          <div className="text-center mt-3">
            <button className="btn btn-link" onClick={() => setIsRegistering(!isRegistering)}>
              {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
            </button>
          </div>

          {/* Botones de Redes Sociales con íconos */}
          <div className="text-center mt-4">
            {/* Texto "Conocenos:" ahora con clase CSS */}
            <p className="social-text-prompt mb-2">Conócenos:</p>
            <div className="d-flex justify-content-center gap-3"> {/* Aumentado el gap a 3 */}

              {/* Botón de Facebook */}
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-button facebook" // Usamos las clases CSS
              >
                <FaFacebook />
              </a>

              {/* Botón de Twitter */}
              <a
                href="https://www.twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-button twitter" // Usamos las clases CSS
              >
                <FaTwitter />
              </a>

              {/* Botón de Instagram */}
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="social-button instagram" // Usamos las clases CSS
              >
                <FaInstagram />
              </a>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Formulario;