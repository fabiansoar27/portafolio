import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import ProjectsList from './pages/ProjectsList';
import ProjectDetail from './pages/ProjectDetail';
import Admin from './pages/Admin';
import ProjectsAdmin from './pages/ProjectsAdmin';
import TestimonialsAdmin from './pages/TestimonialsAdmin';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

/**
 * Main App component with React Router configuration
 * Defines all application routes:
 * - / and /home: Public home page
 * - /proyectos: Public projects list page
 * - /proyectos/:id: Project detail page
 * - /admin: Protected admin panel
 * - /admin/login: Login page for admin access
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
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/proyectos" element={<ProjectsList />} />
        <Route path="/proyectos/:id" element={<ProjectDetail />} />
        
        {/* Admin Routes */}
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
          path="/admin/testimonials" 
          element={
            <ProtectedRoute>
              <TestimonialsAdmin />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect any unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
