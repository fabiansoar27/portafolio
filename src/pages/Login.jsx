import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

/**
 * Login page component - Authentication page for admin access
 * Accessible at /admin/login route
 */
const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.title = 'Fabián - Iniciar Sesión';
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        navigate('/admin');
      }
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1 className="login-title">Panel de Administración</h1>
            <p className="login-subtitle">Inicia sesión para continuar</p>
          </div>

          <form onSubmit={handleLogin} className="login-form">
            {error && (
              <div className="login-error">
                <i className='bx bx-error-circle'></i>
                <span>{error}</span>
              </div>
            )}

            <div className="login-form-group">
              <label htmlFor="email" className="login-label">
                <i className='bx bx-envelope'></i>
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                className="login-input"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="login-form-group">
              <label htmlFor="password" className="login-label">
                <i className='bx bx-lock-alt'></i>
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                className="login-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <i className='bx bx-loader-alt bx-spin'></i>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  <i className='bx bx-log-in'></i>
                  Iniciar sesión
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <a href="/" className="login-back-link">
              <i className='bx bx-arrow-back'></i>
              Volver al inicio
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
