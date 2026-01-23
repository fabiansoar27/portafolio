import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMetrics } from '../hooks/useMetrics';

/**
 * Dashboard component - Displays metrics and statistics
 * Shows: Total visits, CV downloads, projects count, testimonials count
 */
const Dashboard = () => {
  const { metrics, loading, error, refetch } = useMetrics();
  const [dateRange, setDateRange] = useState('all');

  const handleDateRangeChange = (e) => {
    const newRange = e.target.value;
    setDateRange(newRange);
    refetch(newRange);
  };

  if (loading && !metrics.visits) { // Show loading only on initial load
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
        <button onClick={() => refetch(dateRange)} className="button">
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h2 className="dashboard-title">Métricas del Portafolio</h2>
          <p className="dashboard-subtitle">Resumen de actividad</p>
        </div>

        <div className="dashboard-actions">
          <select
            className="dashboard-filter"
            value={dateRange}
            onChange={handleDateRangeChange}
          >
            <option value="all">Todo el tiempo</option>
            <option value="30d">Últimos 30 días</option>
            <option value="15d">Últimos 15 días</option>
            <option value="7d">Últimos 7 días</option>
          </select>

          <button onClick={() => refetch(dateRange)} className="dashboard-refresh-button">
            <i className='bx bx-refresh'></i>
          </button>
        </div>
      </div>

      <div className="dashboard-metrics">
        <div className="metric-card metric-card--primary">
          <div className="metric-card__icon">
            <i className='bx bx-show'></i>
          </div>
          <div className="metric-card__content">
            <h3 className="metric-card__title">Visitas</h3>
            <p className="metric-card__value">{metrics.visits.toLocaleString()}</p>
            <span className="metric-card__label">
              {dateRange === 'all' ? 'Total histórico' : 'En el periodo seleccionado'}
            </span>
          </div>
        </div>

        <div className="metric-card metric-card--success">
          <div className="metric-card__icon">
            <i className='bx bx-download'></i>
          </div>
          <div className="metric-card__content">
            <h3 className="metric-card__title">Descargas CV</h3>
            <p className="metric-card__value">{metrics.downloads.toLocaleString()}</p>
            <span className="metric-card__label">
              {dateRange === 'all' ? 'Total histórico' : 'En el periodo seleccionado'}
            </span>
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
            <i className='bx bx-star'></i>
          </div>
          <div className="metric-card__content">
            <h3 className="metric-card__title">Experiencias</h3>
            <p className="metric-card__value">{metrics.testimonials}</p>
            <span className="metric-card__label">Publicadas en web</span>
          </div>
        </div>
      </div>

      {/* New Experiences Feed */}
      <div className="dashboard-feed">
        <div className="dashboard-feed__header">
          <h3 className="dashboard-feed__title">
            <i className='bx bx-bell'></i> Nuevas Experiencias
            {metrics.newExperiences?.length > 0 && <span className="notification-badge">{metrics.newExperiences.length}</span>}
          </h3>
          <Link to="/admin/experiences" className="view-all-link">
            Ver todas <i className='bx bx-right-arrow-alt'></i>
          </Link>
        </div>

        <div className="dashboard-feed__list">
          {metrics.newExperiences && metrics.newExperiences.length > 0 ? (
            metrics.newExperiences.map((exp) => (
              <div key={exp.id} className="feed-item">
                <div className="feed-item__icon">
                  <i className='bx bx-user-voice'></i>
                </div>
                <div className="feed-item__content">
                  <p className="feed-item__text">
                    <strong>{exp.name}</strong> compartió una opinión sobre <strong>{exp.service_acquired}</strong>
                  </p>
                  <span className="feed-item__date">
                    {new Date(exp.created_at).toLocaleDateString()} • {new Date(exp.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <Link to="/admin/experiences" className="button button--small button--ghost">
                  Revisar
                </Link>
              </div>
            ))
          ) : (
            <div className="feed-empty">
              <i className='bx bx-check-circle'></i>
              <p>No hay nuevas experiencias pendientes de revisión.</p>
            </div>
          )}
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
