import { useState, useEffect } from 'react';
import { uploadImage } from '../services/experiencesService'; // Updated service import

/**
 * TestimonialForm component - Form for creating/editing experiences
 * @param {Object} testimonial - Existing experience data (for edit mode)
 * @param {Function} onSubmit - Callback function when form is submitted
 * @param {Function} onCancel - Callback function when form is cancelled
 * @param {Array} projects - List of projects for linking
 */
const TestimonialForm = ({ testimonial = null, onSubmit, onCancel, projects = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
    rating: 5,
    review: '', // Changed from comment to review
    how_found: '',
    service_acquired: '',
    improvement_aspect: '',
    improvement_other: '',
    project_id: '',
    show_on_home: true
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // Load existing data if editing
  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name || '',
        image_url: testimonial.image_url || '',
        rating: testimonial.rating || 5,
        review: testimonial.review || testimonial.comment || '', // Handle both for safety
        how_found: testimonial.how_found || '',
        service_acquired: testimonial.service_acquired || '',
        improvement_aspect: testimonial.improvement_aspect || '',
        improvement_other: testimonial.improvement_other || '',
        project_id: testimonial.project_id || '',
        show_on_home: testimonial.show_on_home !== false // Default true, unless explicitly false
      });
      setImagePreview(testimonial.image_url || '');
    }
  }, [testimonial]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (name === 'rating' ? parseInt(value) : value)
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        const { publicUrl, error: uploadError } = await uploadImage(imageFile);
        if (uploadError) throw new Error('Error al subir la imagen');
        imageUrl = publicUrl;
      }

      const submissionData = {
        ...formData,
        image_url: imageUrl,
        // Ensure project_id is null if empty string
        project_id: formData.project_id || null
      };

      await onSubmit(submissionData);

    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Error al guardar la experiencia');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="project-form">
      {error && (
        <div className="form-error">
          <i className='bx bx-error-circle'></i>
          <span>{error}</span>
        </div>
      )}

      {/* --- Información del Cliente --- */}
      <h3 className="form-section-title">Información del Cliente</h3>

      <div className="form-grid-2">
        <div className="form-group">
          <label htmlFor="name" className="form-label">Nombre del Cliente *</label>
          <input
            type="text"
            id="name"
            name="name"
            className="form-input"
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image" className="form-label">Foto</label>
          <div className="file-input-wrapper">
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="img-preview-mini" />
            )}
            <input
              type="file"
              id="image"
              className="form-file"
              accept="image/*"
              onChange={handleImageChange}
              disabled={loading}
            />
          </div>
        </div>
      </div>

      {/* --- Testimonio --- */}
      <h3 className="form-section-title">Testimonio</h3>

      <div className="form-group">
        <label htmlFor="rating" className="form-label">Calificación *</label>
        <select
          id="rating"
          name="rating"
          className="form-select"
          value={formData.rating}
          onChange={handleInputChange}
          required
          disabled={loading}
        >
          <option value="5">⭐⭐⭐⭐⭐ (5)</option>
          <option value="4">⭐⭐⭐⭐ (4)</option>
          <option value="3">⭐⭐⭐ (3)</option>
          <option value="2">⭐⭐ (2)</option>
          <option value="1">⭐ (1)</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="review" className="form-label">Reseña (Comentario) *</label>
        <textarea
          id="review"
          name="review" // Matching DB field
          className="form-textarea"
          value={formData.review}
          onChange={handleInputChange}
          rows="4"
          required
          disabled={loading}
          placeholder="Comentario del cliente..."
        />
      </div>

      {/* --- Información del Servicio --- */}
      <h3 className="form-section-title">Detalles del Servicio</h3>

      <div className="form-grid-2">
        <div className="form-group">
          <label htmlFor="service_acquired" className="form-label">Servicio Adquirido</label>
          <select
            id="service_acquired"
            name="service_acquired"
            className="form-select"
            value={formData.service_acquired}
            onChange={handleInputChange}
            disabled={loading}
          >
            <option value="">-- Seleccionar --</option>
            <option value="Diseño Gráfico">Diseño Gráfico</option>
            <option value="Desarrollo Web">Desarrollo Web</option>
            <option value="Aplicaciones Móviles">Aplicaciones Móviles</option>
            <option value="Videojuegos">Videojuegos</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="how_found" className="form-label">Me encontró por</label>
          <select
            id="how_found"
            name="how_found"
            className="form-select"
            value={formData.how_found}
            onChange={handleInputChange}
            disabled={loading}
          >
            <option value="">-- Seleccionar --</option>
            <option value="Redes sociales">Redes sociales</option>
            <option value="Búsqueda web">Búsqueda web</option>
            <option value="Recomendación de amigo o familiar">Recomendación</option>
          </select>
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-group">
          <label htmlFor="improvement_aspect" className="form-label">Aspecto a mejorar</label>
          <select
            id="improvement_aspect"
            name="improvement_aspect"
            className="form-select"
            value={formData.improvement_aspect}
            onChange={handleInputChange}
            disabled={loading}
          >
            <option value="">-- Seleccionar --</option>
            <option value="Tiempo de respuesta">Tiempo de respuesta</option>
            <option value="Ampliar servicios">Ampliar servicios</option>
            <option value="Soporte a clientes">Soporte a clientes</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        {formData.improvement_aspect === 'Otro' && (
          <div className="form-group">
            <label htmlFor="improvement_other" className="form-label">Especifique Otro</label>
            <input
              type="text"
              id="improvement_other"
              name="improvement_other"
              className="form-input"
              value={formData.improvement_other}
              onChange={handleInputChange}
              disabled={loading}
            />
          </div>
        )}
      </div>

      {/* --- Configuración (Project Linking & Visibility) --- */}
      <h3 className="form-section-title">Configuración</h3>

      <div className="form-grid-2">
        <div className="form-group">
          <label htmlFor="project_id" className="form-label">Enlazar a Proyecto (Opcional)</label>
          <select
            id="project_id"
            name="project_id"
            className="form-select"
            value={formData.project_id}
            onChange={handleInputChange}
            disabled={loading}
          >
            <option value="">-- Ninguno --</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
          <small className="form-hint">Si seleccionas un proyecto, aparecerá en su detalle.</small>
        </div>

        <div className="form-group flex-center-vertical">
          <label className="checkbox-label">
            <input
              type="checkbox"
              name="show_on_home"
              checked={formData.show_on_home}
              onChange={handleInputChange}
              disabled={loading}
            />
            <span className="checkbox-text">Mostrar en Página de Inicio</span>
          </label>
          <small className="form-hint d-block">Desmarcar para ocultar del carrusel principal.</small>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="button button--ghost" disabled={loading}>
          Cancelar
        </button>
        <button type="submit" className="button" disabled={loading}>
          {loading ? <><i className='bx bx-loader-alt bx-spin'></i> Guardando...</> : <><i className='bx bx-save'></i> Guardar</>}
        </button>
      </div>

      <style>{`
        .form-section-title {
            font-size: 1rem;
            color: var(--first-color);
            margin-bottom: 1rem;
            margin-top: 1.5rem;
            border-bottom: 1px solid #eee;
            padding-bottom: 0.5rem;
        }
        .form-section-title:first-child { margin-top: 0; }
        .form-grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
        }
        @media (max-width: 600px) {
            .form-grid-2 { grid-template-columns: 1fr; }
        }
        .img-preview-mini {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
            margin-right: 10px;
        }
        .file-input-wrapper { display: flex; align-items: center; }
        .flex-center-vertical { display: flex; flex-direction: column; justify-content: center; }
        .checkbox-label {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            cursor: pointer;
            font-weight: 500;
            color: var(--title-color);
        }
        .checkbox-label input { width: 1.2rem; height: 1.2rem; cursor: pointer; }
        .d-block { display: block; margin-top: 0.25rem; }
      `}</style>
    </form>
  );
};

export default TestimonialForm;
