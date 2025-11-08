import { useState, useEffect } from 'react';
import { uploadImage } from '../services/testimonialsService';

/**
 * TestimonialForm component - Form for creating/editing testimonials
 * @param {Object} testimonial - Existing testimonial data (for edit mode)
 * @param {Function} onSubmit - Callback function when form is submitted
 * @param {Function} onCancel - Callback function when form is cancelled
 */
const TestimonialForm = ({ testimonial = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    image_url: '',
    rating: 5,
    comment: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  // Load existing testimonial data if editing
  useEffect(() => {
    if (testimonial) {
      setFormData({
        name: testimonial.name || '',
        image_url: testimonial.image_url || '',
        rating: testimonial.rating || 5,
        comment: testimonial.comment || ''
      });
      setImagePreview(testimonial.image_url || '');
    }
  }, [testimonial]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      // Create preview
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

      // Upload image if new file selected
      if (imageFile) {
        const { publicUrl, error: uploadError } = await uploadImage(imageFile);
        if (uploadError) throw new Error('Error al subir la imagen');
        imageUrl = publicUrl;
      }

      // Prepare testimonial data
      const testimonialData = {
        ...formData,
        image_url: imageUrl
      };

      // Call onSubmit callback
      await onSubmit(testimonialData);

    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Error al guardar el testimonio');
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

      <div className="form-group">
        <label htmlFor="name" className="form-label">
          Nombre del Cliente *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          className="form-input"
          value={formData.name}
          onChange={handleInputChange}
          required
          disabled={loading}
          placeholder="Juan Pérez"
        />
      </div>

      <div className="form-group">
        <label htmlFor="image" className="form-label">
          Foto del Cliente {!testimonial && '*'}
        </label>
        {imagePreview && (
          <div className="image-preview image-preview--circle">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}
        <input
          type="file"
          id="image"
          className="form-file"
          accept="image/*"
          onChange={handleImageChange}
          required={!testimonial}
          disabled={loading}
        />
        <small className="form-hint">Foto del cliente (preferiblemente cuadrada)</small>
      </div>

      <div className="form-group">
        <label htmlFor="rating" className="form-label">
          Calificación *
        </label>
        <div className="rating-input">
          <select
            id="rating"
            name="rating"
            className="form-select"
            value={formData.rating}
            onChange={handleInputChange}
            required
            disabled={loading}
          >
            <option value="5">⭐⭐⭐⭐⭐ (5 estrellas)</option>
            <option value="4">⭐⭐⭐⭐ (4 estrellas)</option>
            <option value="3">⭐⭐⭐ (3 estrellas)</option>
            <option value="2">⭐⭐ (2 estrellas)</option>
            <option value="1">⭐ (1 estrella)</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="comment" className="form-label">
          Comentario *
        </label>
        <textarea
          id="comment"
          name="comment"
          className="form-textarea"
          value={formData.comment}
          onChange={handleInputChange}
          rows="5"
          required
          disabled={loading}
          placeholder="Escribe el testimonio del cliente..."
        />
        <small className="form-hint">El comentario del cliente sobre tu trabajo</small>
      </div>

      <div className="form-actions">
        <button
          type="button"
          onClick={onCancel}
          className="button button--ghost"
          disabled={loading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="button"
          disabled={loading}
        >
          {loading ? (
            <>
              <i className='bx bx-loader-alt bx-spin'></i>
              Guardando...
            </>
          ) : (
            <>
              <i className='bx bx-save'></i>
              {testimonial ? 'Actualizar' : 'Crear'} Testimonio
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default TestimonialForm;
