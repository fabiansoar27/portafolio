import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';
import ProjectForm from '../components/ProjectForm';
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  deleteImage
} from '../services/projectsService';

/**
 * ProjectsAdmin component - Admin page for managing projects
 * Allows creating, editing, and deleting projects
 */
const ProjectsAdmin = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    document.title = 'Fabián - Administrar Proyectos';
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await getProjects();
      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      const { data, error } = await createProject(projectData);
      if (error) throw error;
      
      setProjects(prev => [data, ...prev]);
      setShowForm(false);
      toast.success('¡Proyecto creado exitosamente!');
    } catch (err) {
      console.error('Error creating project:', err);
      throw err;
    }
  };

  const handleUpdateProject = async (projectData) => {
    try {
      const { data, error } = await updateProject(editingProject.id, projectData);
      if (error) throw error;
      
      setProjects(prev => prev.map(p => p.id === data.id ? data : p));
      setShowForm(false);
      setEditingProject(null);
      toast.success('¡Proyecto actualizado exitosamente!');
    } catch (err) {
      console.error('Error updating project:', err);
      throw err;
    }
  };

  const handleDeleteProject = async (project) => {
    if (!window.confirm(`¿Estás seguro de eliminar "${project.title}"?`)) {
      return;
    }

    try {
      setDeletingId(project.id);
      
      // Delete images from storage
      if (project.image_url) {
        await deleteImage(project.image_url);
      }
      if (project.images && project.images.length > 0) {
        await Promise.all(project.images.map(url => deleteImage(url)));
      }

      // Delete project from database
      const { error } = await deleteProject(project.id);
      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== project.id));
      toast.success('Proyecto eliminado exitosamente');
    } catch (err) {
      console.error('Error deleting project:', err);
      toast.error('Error al eliminar el proyecto: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingProject(null);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-page">
          <div className="admin-loading">
            <i className='bx bx-loader-alt bx-spin'></i>
            <p>Cargando proyectos...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-header">
          <div className="admin-header-content">
            <h1 className="admin-title">Gestión de Proyectos</h1>
            <p className="admin-subtitle">Administra tu portafolio</p>
          </div>
        </div>

      <div className="admin-container">
        {error && (
          <div className="admin-error">
            <i className='bx bx-error-circle'></i>
            <p>Error: {error}</p>
          </div>
        )}

        {!showForm ? (
          <>
            <div className="admin-section-header">
              <h2 className="admin-section-title">
                Proyectos ({projects.length})
              </h2>
              <button
                onClick={() => setShowForm(true)}
                className="button"
              >
                <i className='bx bx-plus'></i>
                Nuevo Proyecto
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="admin-empty">
                <i className='bx bx-folder-open'></i>
                <p>No hay proyectos aún</p>
                <button onClick={() => setShowForm(true)} className="button">
                  Crear primer proyecto
                </button>
              </div>
            ) : (
              <div className="projects-grid">
                {projects.map((project) => (
                  <div key={project.id} className="project-card-admin">
                    <div className="project-card-admin__image">
                      <img src={project.image_url} alt={project.title} />
                      <span className="project-card-admin__category">{project.category}</span>
                    </div>
                    <div className="project-card-admin__content">
                      <h3 className="project-card-admin__title">{project.title}</h3>
                      {project.description && (
                        <p className="project-card-admin__description">{project.description}</p>
                      )}
                      <div className="project-card-admin__meta">
                        {project.project_date && (
                          <span className="project-card-admin__date">
                            <i className='bx bx-calendar'></i>
                            {new Date(project.project_date).toLocaleDateString('es-ES')}
                          </span>
                        )}
                        {project.images && project.images.length > 0 && (
                          <span className="project-card-admin__images">
                            <i className='bx bx-image'></i>
                            {project.images.length} imágenes
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="project-card-admin__actions">
                      <button
                        onClick={() => handleEdit(project)}
                        className="button button--small"
                        disabled={deletingId === project.id}
                      >
                        <i className='bx bx-edit'></i>
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteProject(project)}
                        className="button button--small button--danger"
                        disabled={deletingId === project.id}
                      >
                        {deletingId === project.id ? (
                          <>
                            <i className='bx bx-loader-alt bx-spin'></i>
                            Eliminando...
                          </>
                        ) : (
                          <>
                            <i className='bx bx-trash'></i>
                            Eliminar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="admin-form-container">
            <h2 className="admin-section-title">
              {editingProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
            </h2>
            <ProjectForm
              project={editingProject}
              onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
              onCancel={handleCancelForm}
            />
          </div>
        )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProjectsAdmin;
