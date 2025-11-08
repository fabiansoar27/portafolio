import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import AdminLayout from '../components/AdminLayout';
import Dashboard from '../components/Dashboard';

/**
 * Admin page component - Protected admin panel
 * Accessible at /admin route (requires authentication)
 */
const Admin = () => {
  const { user, updateProfile } = useAuth();

  useEffect(() => {
    document.title = 'Fabián - Panel de Administración';
  }, []);

  // Temporary function to set display name (you can remove this after setting it once)
  const setDisplayName = async () => {
    const name = prompt('Ingresa tu nombre:', 'Fabián');
    if (name) {
      const { error } = await updateProfile({ display_name: name });
      if (!error) {
        toast.success('¡Nombre actualizado! Recarga la página para ver los cambios.');
      } else {
        toast.error('Error al actualizar el nombre: ' + error.message);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-header">
          <div className="admin-header-content">
            <h1 className="admin-title">Métricas del Portafolio</h1>
            <p className="admin-subtitle">Vista general de estadísticas</p>
          </div>
        </div>

        <div className="admin-container">
          {/* Temporary button to set display name - Remove after first use */}
          {!user?.user_metadata?.display_name && (
            <div className="admin-setup-notice">
              <i className='bx bx-info-circle'></i>
              <span>¿Quieres personalizar tu saludo?</span>
              <button onClick={setDisplayName} className="admin-setup-button">
                Configurar nombre
              </button>
            </div>
          )}

          {/* Dashboard with metrics */}
          <Dashboard />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Admin;
