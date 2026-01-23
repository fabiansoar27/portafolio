import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';
import TestimonialForm from '../components/TestimonialForm';
import {
    getExperiencesByStatus,
    createExperience,
    updateExperience,
    deleteExperience,
    deleteImage
} from '../services/experiencesService';
import { supabase } from '../supabaseClient';

/**
 * ExperiencesAdmin component - Refactored for better UI and Brand Colors
 */
const ExperiencesAdmin = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [editingExperience, setEditingExperience] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [statusFilter, setStatusFilter] = useState('all');

    // Uncommented state
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        document.title = 'Fabián - Administrar Experiencias';
        fetchExperiences();
        fetchProjects(); // Fetch projects for linking
    }, [statusFilter]);

    const fetchExperiences = async () => {
        try {
            setLoading(true);
            const { data, error } = await getExperiencesByStatus(statusFilter);
            if (error) throw error;
            setExperiences(data || []);
        } catch (err) {
            console.error('Error fetching experiences:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Helper to fetch projects
    const fetchProjects = async () => {
        const { data } = await supabase.from('projects').select('id, title').order('created_at', { ascending: false });
        setProjects(data || []);
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const { error } = await updateExperience(id, { status: newStatus });
            if (error) throw error;

            setExperiences(prev => prev.map(e =>
                e.id === id ? { ...e, status: newStatus } : e
            ));

            const statusLabels = {
                'published': 'Publicado',
                'archived': 'Archivado'
            };
            toast.success(`Estado actualizado a: ${statusLabels[newStatus] || newStatus}`);
        } catch (err) {
            console.error('Error updating status:', err);
            toast.error('Error al actualizar el estado');
        }
    };

    const handleCreateExperience = async (experienceData) => {
        try {
            const { data, error } = await createExperience({
                ...experienceData,
                status: 'published'
            });
            if (error) throw error;

            setExperiences(prev => [data, ...prev]);
            setShowForm(false);
            toast.success('¡Experiencia creada exitosamente!');
        } catch (err) {
            console.error('Error creating experience:', err);
            throw err;
        }
    };

    const handleUpdateExperience = async (experienceData) => {
        try {
            const { data, error } = await updateExperience(editingExperience.id, experienceData);
            if (error) throw error;

            setExperiences(prev => prev.map(e => e.id === data.id ? data : e));
            setShowForm(false);
            setEditingExperience(null);
            toast.success('¡Experiencia actualizada exitosamente!');
        } catch (err) {
            console.error('Error updating experience:', err);
            throw err;
        }
    };

    const handleDeleteExperience = async (experience) => {
        if (!window.confirm(`¿Estás seguro de eliminar la experiencia de "${experience.name}"?`)) {
            return;
        }

        try {
            setDeletingId(experience.id);
            if (experience.image_url) {
                await deleteImage(experience.image_url);
            }
            const { error } = await deleteExperience(experience.id);
            if (error) throw error;

            setExperiences(prev => prev.filter(e => e.id !== experience.id));
            toast.success('Experiencia eliminada exitosamente');
        } catch (err) {
            console.error('Error deleting experience:', err);
            toast.error('Error al eliminar: ' + err.message);
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = (experience) => {
        setEditingExperience(experience);
        setShowForm(true);
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingExperience(null);
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <i key={i} className={`bx ${i < rating ? 'bxs-star' : 'bx-star'}`} style={{ color: '#eab308' }}></i>
        ));
    };

    // Componente de Badge para el estado
    const StatusBadge = ({ status }) => {
        const config = {
            'new': { label: 'NUEVA', className: 'status-new' },
            'published': { label: 'PUBLICADA', className: 'status-published' },
            'archived': { label: 'ARCHIVADA', className: 'status-archived' },
        };
        const { label, className } = config[status] || { label: status, className: '' };
        return <span className={`status-badge ${className}`}>{label}</span>;
    };

    if (loading) return (
        <AdminLayout>
            <div className="flex-center" style={{ height: '80vh' }}>
                <i className='bx bx-loader-alt bx-spin' style={{ fontSize: '2rem', color: 'var(--first-color)' }}></i>
            </div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="admin-page">
                <div className="admin-header">
                    <div>
                        <h1 className="admin-title">Gestión de Experiencias</h1>
                        <p className="admin-subtitle">Administra las opiniones de tus clientes y la información de servicio.</p>
                    </div>
                </div>

                {!showForm ? (
                    <>
                        <div className="admin-filters mb-2">
                            {/* Filters moved here */}
                            <button onClick={() => setStatusFilter('all')} className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}>Todas</button>
                            <button onClick={() => setStatusFilter('new')} className={`filter-btn ${statusFilter === 'new' ? 'active' : ''}`}>Nuevas</button>
                            <button onClick={() => setStatusFilter('published')} className={`filter-btn ${statusFilter === 'published' ? 'active' : ''}`}>Publicadas</button>
                        </div>

                        <div className="admin-container">
                            <button onClick={() => setShowForm(true)} className="button mb-2">
                                <i className='bx bx-plus'></i> Nueva Experiencia
                            </button>

                            <div className="experiences-grid">
                                {experiences.length === 0 ? (
                                    <p className="text-center">No hay experiencias para mostrar.</p>
                                ) : experiences.map((exp) => (
                                    <article key={exp.id} className="experience-card">
                                        {/* Header: Photo, Name, Rating, Date */}
                                        <div className="card-header">
                                            <div className="user-info">
                                                {exp.image_url ? (
                                                    <img src={exp.image_url} alt={exp.name} className="user-avatar" />
                                                ) : (
                                                    <div className="user-avatar-placeholder">
                                                        <i className='bx bx-user'></i>
                                                    </div>
                                                )}
                                                <div>
                                                    <h3 className="user-name">{exp.name}</h3>
                                                    <div className="user-rating">{renderStars(exp.rating)}</div>
                                                </div>
                                            </div>
                                            <StatusBadge status={exp.status} />
                                        </div>

                                        {/* Review Body */}
                                        <div className="card-body">
                                            <p className="review-text">"{exp.review}"</p>
                                        </div>

                                        {/* Service Info Grid (The 3 Questions) */}
                                        <div className="service-info-grid">
                                            <div className="info-item">
                                                <span className="info-label">Servicio Adquirido</span>
                                                <span className="info-value">{exp.service_acquired || 'N/A'}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="info-label">Me encontró por</span>
                                                <span className="info-value">{exp.how_found || 'N/A'}</span>
                                            </div>
                                            <div className="info-item full-width">
                                                <span className="info-label">Aspecto a mejorar</span>
                                                <span className="info-value">
                                                    {exp.improvement_aspect === 'Otro'
                                                        ? `${exp.improvement_aspect}: ${exp.improvement_other}`
                                                        : exp.improvement_aspect || 'N/A'}
                                                </span>
                                            </div>
                                            {/* Project Link Info */}
                                            {exp.projects?.title && (
                                                <div className="info-item full-width">
                                                    <span className="info-label">Enlazado al proyecto</span>
                                                    <span className="info-value" style={{ color: 'var(--first-color)' }}>
                                                        <i className='bx bx-link'></i> {exp.projects.title}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="card-footer">
                                            <div className="action-buttons">
                                                {exp.status === 'new' && (
                                                    <button onClick={() => handleStatusChange(exp.id, 'published')} className="btn-action btn-publish" title="Publicar en la web">
                                                        <i className='bx bx-check'></i> Publicar
                                                    </button>
                                                )}
                                                {exp.status === 'published' && (
                                                    <button onClick={() => handleStatusChange(exp.id, 'archived')} className="btn-action btn-archive" title="Ocultar de la web pero guardar en admin">
                                                        <i className='bx bx-archive-in'></i> Archivar
                                                    </button>
                                                )}
                                                {exp.status === 'archived' && (
                                                    <button onClick={() => handleStatusChange(exp.id, 'published')} className="btn-action btn-publish" title="Volver a publicar">
                                                        <i className='bx bx-upload'></i> Republicar
                                                    </button>
                                                )}

                                                <button onClick={() => handleEdit(exp)} className="btn-action btn-edit" title="Editar información">
                                                    <i className='bx bx-edit'></i>
                                                </button>
                                                <button onClick={() => handleDeleteExperience(exp)} className="btn-action btn-delete" title="Eliminar permanentemente">
                                                    <i className='bx bx-trash'></i>
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="admin-form-container">
                        <TestimonialForm
                            testimonial={editingExperience}
                            projects={projects} // Passing projects to form
                            onSubmit={editingExperience ? handleUpdateExperience : handleCreateExperience}
                            onCancel={handleCancelForm}
                        />
                    </div>
                )}
            </div>

            <style>{`
                .admin-subtitle {
                    color: var(--text-color-light);
                    font-size: var(--small-font-size);
                    margin-bottom: 1rem;
                }
                
                .experiences-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
                    gap: 1.5rem;
                }

                .experience-card {
                    background-color: #fff; /* We can use var(--container-color) if light mode */
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 1.5rem;
                    display: flex;
                    flex-direction: column;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                    transition: transform 0.2s, box-shadow 0.2s;
                    color: var(--text-color);
                }
                .experience-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 10px 15px rgba(0,0,0,0.1);
                }

                .card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 1rem;
                }

                .user-info {
                    display: flex;
                    align-items: center;
                    gap: 0.75rem;
                }
                .user-avatar {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    object-fit: cover;
                }
                .user-avatar-placeholder {
                    width: 48px;
                    height: 48px;
                    border-radius: 50%;
                    background-color: #f3f4f6;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 1.5rem;
                    color: #9ca3af;
                }
                .user-name {
                    font-size: 1rem;
                    font-weight: 600;
                    color: var(--title-color);
                    margin: 0;
                }
                .user-rating {
                    font-size: 0.875rem;
                    display: flex;
                }

                .review-text {
                    font-style: italic;
                    color: var(--text-color);
                    margin-bottom: 1.25rem;
                    line-height: 1.5;
                }

                /* Service Info Grid */
                .service-info-grid {
                    display: grid;
                    grid-template-columns: 1fr 1fr; /* 2 columns */
                    gap: 0.75rem;
                    background-color: #f9fafb;
                    padding: 1rem;
                    border-radius: 8px;
                    margin-bottom: 1.25rem;
                }
                .info-item {
                    display: flex;
                    flex-direction: column;
                }
                .info-item.full-width {
                    grid-column: span 2;
                }
                .info-label {
                    font-size: 0.7rem;
                    text-transform: uppercase;
                    color: #6b7280;
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }
                .info-value {
                    font-size: 0.85rem;
                    color: var(--title-color);
                    font-weight: 500;
                }

                .card-footer {
                    margin-top: auto;
                    padding-top: 1rem;
                    border-top: 1px solid #f3f4f6;
                }

                .action-buttons {
                    display: flex;
                    gap: 0.5rem;
                    justify-content: flex-end;
                }

                .btn-action {
                    padding: 0.5rem 0.75rem;
                    border-radius: 6px;
                    font-size: 0.85rem;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 0.25rem;
                    border: 1px solid transparent;
                    transition: all 0.2s;
                }
                .btn-publish {
                    background-color: #dcfce7;
                    color: #166534;
                }
                .btn-publish:hover { background-color: #bbf7d0; }
                
                .btn-archive {
                    background-color: #f3f4f6;
                    color: #4b5563;
                }
                .btn-archive:hover { background-color: #e5e7eb; }

                .btn-edit {
                    background-color: transparent;
                    color: var(--first-color);
                    border: 1px solid var(--first-color);
                }
                .btn-edit:hover {
                    background-color: var(--first-color);
                    color: #fff;
                }
                
                .btn-delete {
                    background-color: transparent;
                    color: #ef4444;
                    border: 1px solid #ef4444;
                }
                .btn-delete:hover {
                    background-color: #ef4444;
                    color: #fff;
                }

                .status-badge {
                    padding: 0.25rem 0.6rem;
                    border-radius: 999px;
                    font-size: 0.7rem;
                    font-weight: 700;
                }
                .status-new { background-color: #dbeafe; color: #1e40af; }
                .status-published { background-color: #d1fae5; color: #065f46; }
                .status-archived { background-color: #f3f4f6; color: #374151; }

                .filter-btn {
                    background: transparent;
                    border: 1px solid #ddd;
                    color: var(--text-color);
                    padding: 0.4rem 1rem;
                    margin-left: 0.5rem;
                    border-radius: 20px;
                    font-size: 0.85rem;
                    transition: all 0.3s;
                }
                .filter-btn.active {
                    background-color: var(--first-color);
                    color: white;
                    border-color: var(--first-color);
                }
                .mb-2 { margin-bottom: 2rem; }
                .flex-center { display: flex; justify-content: center; align-items: center;}
                .text-center { text-align: center; width: 100%; color: var(--text-color-light); }
            `}</style>
        </AdminLayout>
    );
};

export default ExperiencesAdmin;
