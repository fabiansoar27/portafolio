import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

/**
 * AdminLayout component - Layout wrapper for admin pages with sidebar navigation
 * @param {React.ReactNode} children - Page content to render
 */
const AdminLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName = user?.user_metadata?.display_name || user?.email?.split('@')[0] || 'Usuario';

  const handleLogout = async () => {
    const { error } = await logout();
    if (!error) {
      navigate('/admin/login');
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    {
      path: '/admin',
      icon: 'bx-bar-chart-alt-2',
      label: 'Métricas',
      exact: true
    },
    {
      path: '/admin/projects',
      icon: 'bx-briefcase-alt',
      label: 'Proyectos'
    },
    {
      path: '/admin/testimonials',
      icon: 'bx-message-square-detail',
      label: 'Testimonios'
    }
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path;
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__header">
          <div className="admin-sidebar__logo">
            <i className='bx bx-code-alt'></i>
            <span>Admin Panel</span>
          </div>
          <button 
            className="admin-sidebar__close"
            onClick={toggleSidebar}
          >
            <i className='bx bx-x'></i>
          </button>
        </div>

        <nav className="admin-sidebar__nav">
          <ul className="admin-sidebar__menu">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button
                  className={`admin-sidebar__link ${isActive(item) ? 'admin-sidebar__link--active' : ''}`}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                >
                  <i className={`bx ${item.icon}`}></i>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <div className="admin-sidebar__user-avatar">
              <i className='bx bx-user'></i>
            </div>
            <div className="admin-sidebar__user-info">
              <p className="admin-sidebar__user-name">{displayName}</p>
              <p className="admin-sidebar__user-email">{user?.email}</p>
            </div>
          </div>
          <button 
            className="admin-sidebar__logout"
            onClick={handleLogout}
          >
            <i className='bx bx-log-out'></i>
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="admin-sidebar__overlay"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Main content */}
      <div className="admin-content">
        {/* Top bar for mobile */}
        <div className="admin-topbar">
          <button 
            className="admin-topbar__menu"
            onClick={toggleSidebar}
          >
            <i className='bx bx-menu'></i>
          </button>
          <h1 className="admin-topbar__title">Panel de Administración</h1>
          <button 
            className="admin-topbar__logout"
            onClick={handleLogout}
          >
            <i className='bx bx-log-out'></i>
          </button>
        </div>

        {/* Page content */}
        <div className="admin-content__body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
