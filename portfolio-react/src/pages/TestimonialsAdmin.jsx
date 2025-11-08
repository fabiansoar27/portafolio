import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import AdminLayout from '../components/AdminLayout';
import TestimonialForm from '../components/TestimonialForm';
import {
  getTestimonialsByStatus,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  deleteImage,
  approveTestimonial,
  rejectTestimonial
} from '../services/testimonialsService';

/**
 * TestimonialsAdmin component - Admin page for managing testimonials
 * Allows creating, editing, and deleting testimonials
 */
const TestimonialsAdmin = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    document.title = 'Fabián - Administrar Testimonios';
    fetchTestimonials();
  }, [statusFilter]);

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const { data, error } = await getTestimonialsByStatus(statusFilter);
      if (error) throw error;
      setTestimonials(data || []);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const { error } = await approveTestimonial(id);
      if (error) throw error;

      setTestimonials(prev => prev.map(t => 
        t.id === id ? { ...t, status: 'approved' } : t
      ));
      toast.success('Testimonio aprobado');
    } catch (err) {
      console.error('Error approving testimonial:', err);
      toast.error('Error al aprobar el testimonio');
    }
  };

  const handleReject = async (id) => {
    try {
      const { error} = await rejectTestimonial(id);
      if (error) throw error;

      setTestimonials(prev => prev.map(t => 
        t.id === id ? { ...t, status: 'rejected' } : t
      ));
      toast.success('Testimonio rechazado');
    } catch (err) {
      console.error('Error rejecting testimonial:', err);
      toast.error('Error al rechazar el testimonio');
    }
  };

  const handleCreateTestimonial = async (testimonialData) => {
    try {
      const { data, error } = await createTestimonial(testimonialData);
      if (error) throw error;
      
      setTestimonials(prev => [data, ...prev]);
      setShowForm(false);
      toast.success('¡Testimonio creado exitosamente!');
    } catch (err) {
      console.error('Error creating testimonial:', err);
      throw err;
    }
  };

  const handleUpdateTestimonial = async (testimonialData) => {
    try {
      const { data, error } = await updateTestimonial(editingTestimonial.id, testimonialData);
      if (error) throw error;
      
      setTestimonials(prev => prev.map(t => t.id === data.id ? data : t));
      setShowForm(false);
      setEditingTestimonial(null);
      toast.success('¡Testimonio actualizado exitosamente!');
    } catch (err) {
      console.error('Error updating testimonial:', err);
      throw err;
    }
  };

  const handleDeleteTestimonial = async (testimonial) => {
    if (!window.confirm(`¿Estás seguro de eliminar el testimonio de "${testimonial.name}"?`)) {
      return;
    }

    try {
      setDeletingId(testimonial.id);
      
      // Delete image from storage
      if (testimonial.image_url) {
        await deleteImage(testimonial.image_url);
      }

      // Delete testimonial from database
      const { error } = await deleteTestimonial(testimonial.id);
      if (error) throw error;

      setTestimonials(prev => prev.filter(t => t.id !== testimonial.id));
      toast.success('Testimonio eliminado exitosamente');
    } catch (err) {
      console.error('Error deleting testimonial:', err);
      toast.error('Error al eliminar el testimonio: ' + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (testimonial) => {
    setEditingTestimonial(testimonial);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingTestimonial(null);
  };

  const renderStars = (rating) => {
    return '⭐'.repeat(rating);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-page">
          <div className="admin-loading">
            <i className='bx bx-loader-alt bx-spin'></i>
            <p>Cargando testimonios...</p>
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
            <h1 className="admin-title">Gestión de Testimonios</h1>
            <p className="admin-subtitle">Administra opiniones de clientes</p>
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
                Testimonios ({testimonials.length})
              </h2>
              <button
                onClick={() => setShowForm(true)}
                className="button"
              >
                <i className='bx bx-plus'></i>
                Nuevo Testimonio
              </button>
            </div>

            {testimonials.length === 0 ? (
              <div className="admin-empty">
                <i className='bx bx-message-square-detail'></i>
                <p>No hay testimonios aún</p>
                <button onClick={() => setShowForm(true)} className="button">
                  Crear primer testimonio
                </button>
              </div>
            ) : (
              <div className="testimonials-grid">
                {testimonials.map((testimonial) => (
                  <div key={testimonial.id} className="testimonial-card-admin">
                    <div className="testimonial-card-admin__header">
                      <img 
                        src={testimonial.image_url} 
                        alt={testimonial.name}
                        className="testimonial-card-admin__image"
                      />
                      <div className="testimonial-card-admin__info">
                        <h3 className="testimonial-card-admin__name">{testimonial.name}</h3>
                        <div className="testimonial-card-admin__rating">
                          {renderStars(testimonial.rating)}
                        </div>
                      </div>
                    </div>
                    <div className="testimonial-card-admin__content">
                      <p className="testimonial-card-admin__comment">{testimonial.comment}</p>
                    </div>
                    <div className="testimonial-card-admin__actions">
                      <button
                        onClick={() => handleEdit(testimonial)}
                        className="button button--small"
                        disabled={deletingId === testimonial.id}
                      >
                        <i className='bx bx-edit'></i>
                        Editar
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(testimonial)}
                        className="button button--small button--danger"
                        disabled={deletingId === testimonial.id}
                      >
                        {deletingId === testimonial.id ? (
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
              {editingTestimonial ? 'Editar Testimonio' : 'Nuevo Testimonio'}
            </h2>
            <TestimonialForm
              testimonial={editingTestimonial}
              onSubmit={editingTestimonial ? handleUpdateTestimonial : handleCreateTestimonial}
              onCancel={handleCancelForm}
            />
          </div>
        )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default TestimonialsAdmin;
