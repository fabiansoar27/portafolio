import { useMetrics } from '../hooks/useMetrics';

/**
 * Dashboard component - Displays metrics and statistics
 * Shows: Total visits, CV downloads, projects count, testimonials count
 */
const Dashboard = () => {
  const { metrics, loading, error, refetch } = useMetrics();

  if (loading) {
    return (
      <div className="dashboard-loading">
        <i className='bx bx-loader-alt bx-spin'></i>
        <p>Cargando métricas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <i className='bx bx-error-circle'></i>
        <p>Error al cargar métricas: {error}</p>
        <button onClick={refetch} className="button">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2 className="dashboard-title">Métricas del Portafolio</h2>
        <button onClick={refetch} className="dashboard-refresh-button">
          <i className='bx bx-refresh'></i>
          Actualizar
        </button>
      </div>

      <div className="dashboard-metrics">
        <div className="metric-card metric-card--primary">
          <div className="metric-card__icon">
            <i className='bx bx-show'></i>
          </div>
          <div className="metric-card__content">
            <h3 className="metric-card__title">Visitas Totales</h3>
            <p className="metric-card__value">{metrics.visits.toLocaleString()}</p>
            <span className="metric-card__label">Visitantes únicos</span>
          </div>
        </div>

        <div className="metric-card metric-card--success">
          <div className="metric-card__icon">
            <i className='bx bx-download'></i>
          </div>
          <div className="metric-card__content">
            <h3 className="metric-card__title">Descargas de CV</h3>
            <p className="metric-card__value">{metrics.downloads.toLocaleString()}</p>
            <span className="metric-card__label">Descargas totales</span>
          </div>
        </div>

        <div className="metric-card metric-card--info">
          <div className="metric-card__icon">
            <i className='bx bx-briefcase-alt'></i>
          </div>
          <div className="metric-card__content">
            <h3 className="metric-card__title">Proyectos</h3>
            <p className="metric-card__value">{metrics.projects}</p>
            <span className="metric-card__label">Proyectos publicados</span>
          </div>
        </div>

        <div className="metric-card metric-card--warning">
          <div className="metric-card__icon">
            <i className='bx bx-message-square-detail'></i>
          </div>
          <div className="metric-card__content">
            <h3 className="metric-card__title">Testimonios</h3>
            <p className="metric-card__value">{metrics.testimonials}</p>
            <span className="metric-card__label">Testimonios activos</span>
          </div>
        </div>
      </div>

      <div className="dashboard-info">
        <i className='bx bx-info-circle'></i>
        <p>Las métricas se actualizan en tiempo real desde Supabase</p>
      </div>
    </div>
  );
};

export default Dashboard;
