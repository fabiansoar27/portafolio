import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import ProjectsList from './pages/ProjectsList';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin';
import ProjectsAdmin from './pages/ProjectsAdmin';
import ExperiencesAdmin from './pages/ExperiencesAdmin';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import WhatsAppButton from './components/WhatsAppButton';
import './App.css';

// Componente wrapper para poder usar el hook useLocation
const AppRoutes = () => {
  const location = useLocation();

  // Rutas donde el botón de WhatsApp debe ser visible
  const visibleRoutes = ['/', '/home'];
  const showButton = visibleRoutes.includes(location.pathname) || location.pathname.startsWith('/proyectos');

  return (
    <>
      <Routes>
        {/* Rutas Públicas */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/proyectos" element={<ProjectsList />} />
        <Route path="/proyectos/:id" element={<ProjectDetail />} />

        {/* Rutas de Administración */}
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <ProtectedRoute>
              <ProjectsAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/experiences"
          element={
            <ProtectedRoute>
              <ExperiencesAdmin />
            </ProtectedRoute>
          }
        />

        {/* Redirigir rutas desconocidas al inicio */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* Renderizar el botón condicionalmente */}
      {showButton && <WhatsAppButton />}
    </>
  );
}

/**
 * Componente principal con la configuración de React Router
 */
function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#292324',
            padding: '16px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          },
          success: {
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AppRoutes />
    </Router>
  );
}

export default App;
