import { useState } from 'react';
import { uploadImage } from '../services/testimonialsService';
import { supabase } from '../supabaseClient';

const TestimonialPopup = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1); // 1: formulario, 2: éxito
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const [formData, setFormData] = useState({
    how_found: '',
    service_acquired: '',
    improvement_aspect: '',
    improvement_other: '',
    name: '',
    review: '',
    rating: 5,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tamaño (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setError('La imagen debe ser menor a 2 MB');
        return;
      }

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
      let imageUrl = '';

      // Subir imagen si existe
      if (imageFile) {
        const { publicUrl, error: uploadError } = await uploadImage(imageFile);
        if (uploadError) throw new Error('Error al subir la imagen');
        imageUrl = publicUrl;
      }

      // Guardar testimonio en Supabase (Tabla experiences)
      const { error: insertError } = await supabase
        .from('experiences')
        .insert([
          {
            name: formData.name,
            review: formData.review,
            rating: parseInt(formData.rating),
            image_url: imageUrl,
            how_found: formData.how_found,
            service_acquired: formData.service_acquired,
            improvement_aspect: formData.improvement_aspect,
            improvement_other: formData.improvement_other,
            status: 'new' // Newly submitted experiences start as 'new'
          }
        ]);

      if (insertError) throw insertError;

      // Mostrar mensaje de éxito
      setStep(2);
    } catch (err) {
      console.error('Error submitting testimonial:', err);
      setError(err.message || 'Error al enviar el testimonio');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      how_found: '',
      service_acquired: '',
      improvement_aspect: '',
      improvement_other: '',
      name: '',
      review: '',
      rating: 5,
    });
    setImageFile(null);
    setImagePreview('');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="popup-close" onClick={handleClose}>
          <i className='bx bx-x'></i>
        </button>

        {step === 1 ? (
          <>
            <h2 className="popup-title">Formulario de Servicio</h2>
            <p className="popup-description">
              Este formulario fue elaborado con el fin de leer sus experiencias, consejos u opiniones al trabajar juntos.
              Así podré mejorar y brindar mejores experiencias, de antemano muchas gracias.
            </p>

            {error && (
              <div className="popup-error">
                <i className='bx bx-error-circle'></i>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="popup-form">
              {/* Sección: Información del servicio */}
              <div className="popup-section">
                <h3 className="popup-section-title">Información del Servicio</h3>

                <div className="form-group">
                  <label htmlFor="how_found" className="form-label">
                    ¿Cómo se enteró sobre mis servicios? *
                  </label>
                  <select
                    id="how_found"
                    name="how_found"
                    className="form-select"
                    value={formData.how_found}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="Redes sociales">Redes sociales</option>
                    <option value="Búsqueda web">Búsqueda web</option>
                    <option value="Recomendación de amigo o familiar">Recomendación de amigo o familiar</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="service_acquired" className="form-label">
                    ¿Cuál fue el servicio que adquirió? *
                  </label>
                  <select
                    id="service_acquired"
                    name="service_acquired"
                    className="form-select"
                    value={formData.service_acquired}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Seleccione un servicio</option>
                    <option value="Diseño Gráfico">Diseño Gráfico</option>
                    <option value="Desarrollo Web">Desarrollo Web</option>
                    <option value="Aplicaciones Móviles">Aplicaciones Móviles</option>
                    <option value="Videojuegos">Videojuegos</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="improvement_aspect" className="form-label">
                    Según su experiencia, ¿Qué aspecto debo mejorar? *
                  </label>
                  <select
                    id="improvement_aspect"
                    name="improvement_aspect"
                    className="form-select"
                    value={formData.improvement_aspect}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Seleccione un aspecto</option>
                    <option value="Tiempo de respuesta">Tiempo de respuesta</option>
                    <option value="Ampliar servicios">Ampliar servicios</option>
                    <option value="Soporte a clientes">Soporte a clientes</option>
                    <option value="Otro">Otro (especificar)</option>
                  </select>
                </div>

                {formData.improvement_aspect === 'Otro' && (
                  <div className="form-group">
                    <label htmlFor="improvement_other" className="form-label">
                      Especifique el aspecto a mejorar *
                    </label>
                    <input
                      type="text"
                      id="improvement_other"
                      name="improvement_other"
                      className="form-input"
                      value={formData.improvement_other}
                      onChange={handleInputChange}
                      required
                      disabled={loading}
                      placeholder="Describa el aspecto a mejorar"
                    />
                  </div>
                )}
              </div>

              {/* Sección: Testimonio */}
              <div className="popup-section">
                <h3 className="popup-section-title">Testimonio: Reseña</h3>
                <p className="popup-section-subtitle">Por favor escriba una reseña y calificación</p>

                <div className="form-group">
                  <label htmlFor="name" className="form-label">
                    ¿Cuál es su nombre? *
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
                    placeholder="Su nombre completo"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="review" className="form-label">
                    Comparta una reseña según su experiencia al trabajar en conjunto: *
                  </label>
                  <textarea
                    id="review"
                    name="review"
                    className="form-textarea"
                    value={formData.review}
                    onChange={handleInputChange}
                    rows="5"
                    required
                    disabled={loading}
                    placeholder="Cuéntenos sobre su experiencia..."
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="rating" className="form-label">
                    Del 1 al 5, ¿Qué le pareció el servicio, desarrollo y producto final del proyecto? *
                  </label>
                  <div className="rating-input">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <label key={star} className="rating-star">
                        <input
                          type="radio"
                          name="rating"
                          value={star}
                          checked={formData.rating === star}
                          onChange={() => setFormData(prev => ({ ...prev, rating: star }))}
                          disabled={loading}
                        />
                        <i className={`bx ${formData.rating >= star ? 'bxs-star' : 'bx-star'}`}></i>
                      </label>
                    ))}
                    <span className="rating-value">{formData.rating} estrella{formData.rating !== 1 ? 's' : ''}</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="image" className="form-label">
                    Comparta una fotografía suya
                  </label>
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="Preview" />
                    </div>
                  )}
                  <input
                    type="file"
                    id="image"
                    className="form-file"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={loading}
                  />
                  <small className="form-hint">
                    Opcional. Tamaño máximo: 2 MB. Formatos: JPG, PNG, WebP
                  </small>
                </div>
              </div>

              <div className="popup-actions">
                <button
                  type="button"
                  onClick={handleClose}
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
                      Enviando...
                    </>
                  ) : (
                    'Enviar opinión'
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="popup-success">
            <i className='bx bx-check-circle'></i>
            <h2>¡Gracias por tu opinión!</h2>
            <p>Tu testimonio ha sido enviado correctamente y será revisado pronto.</p>
            <button onClick={handleClose} className="button">
              <i className='bx bx-home'></i>
              Volver al inicio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialPopup;
