import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { uploadImage, uploadMultipleImages } from '../services/projectsService';

/**
 * ProjectForm component - Form for creating/editing projects
 * @param {Object} project - Existing project data (for edit mode)
 * @param {Function} onSubmit - Callback function when form is submitted
 * @param {Function} onCancel - Callback function when form is cancelled
 */
const ProjectForm = ({ project = null, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    image_url: '',
    images: [],
    link: '',
    project_date: '',
    slug: ''
  });
  const [mainImageFile, setMainImageFile] = useState(null);
  const [heroImageFile, setHeroImageFile] = useState(null);
  const [galleryImageFiles, setGalleryImageFiles] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [heroImagePreview, setHeroImagePreview] = useState('');
  const [galleryPreviews, setGalleryPreviews] = useState(['', '', '', '']);

  // Quill modules configuration
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'list', 'bullet',
    'link'
  ];

  // Load existing project data if editing
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        category: project.category || '',
        image_url: project.image_url || '',
        images: project.images || [],
        link: project.link || '',
        project_date: project.project_date || '',
        slug: project.slug || ''
      });
      setImagePreview(project.image_url || '');

      // Load existing gallery images
      if (project.images && project.images.length > 0) {
        setHeroImagePreview(project.images[0] || '');
        setGalleryPreviews([
          project.images[1] || '',
          project.images[2] || '',
          project.images[3] || '',
          project.images[4] || ''
        ]);
      }
    }
  }, [project]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Auto-generate slug from title
    if (name === 'title') {
      const slug = value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setFormData(prev => ({
        ...prev,
        slug
      }));
    }
  };

  const handleDescriptionChange = (content) => {
    setFormData(prev => ({
      ...prev,
      description: content
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMainImageFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeroImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setHeroImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryImageChange = (index) => (e) => {
    const file = e.target.files[0];
    if (file) {
      const newFiles = [...galleryImageFiles];
      newFiles[index] = file;
      setGalleryImageFiles(newFiles);

      const reader = new FileReader();
      reader.onloadend = () => {
        const newPreviews = [...galleryPreviews];
        newPreviews[index] = reader.result;
        setGalleryPreviews(newPreviews);
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
      let galleryImages = [];

      // Upload main image if new file selected
      if (mainImageFile) {
        const { publicUrl, error: uploadError } = await uploadImage(mainImageFile);
        if (uploadError) throw new Error('Error al subir la imagen principal');
        imageUrl = publicUrl;
      }

      // Upload hero image (first in gallery)
      if (heroImageFile) {
        const { publicUrl, error: uploadError } = await uploadImage(heroImageFile);
        if (uploadError) throw new Error('Error al subir la imagen hero');
        galleryImages.push(publicUrl);
      } else if (project?.images?.[0]) {
        galleryImages.push(project.images[0]);
      }

      // Upload gallery images (4 square images)
      for (let i = 0; i < 4; i++) {
        if (galleryImageFiles[i]) {
          const { publicUrl, error: uploadError } = await uploadImage(galleryImageFiles[i]);
          if (uploadError) {
            console.warn(`Error uploading gallery image ${i + 1}:`, uploadError);
            if (project?.images?.[i + 1]) {
              galleryImages.push(project.images[i + 1]);
            }
          } else {
            galleryImages.push(publicUrl);
          }
        } else if (project?.images?.[i + 1]) {
          galleryImages.push(project.images[i + 1]);
        }
      }

      // Prepare project data
      const projectData = {
        ...formData,
        image_url: imageUrl,
        images: galleryImages
      };

      // Call onSubmit callback
      await onSubmit(projectData);

    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message || 'Error al guardar el proyecto');
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
        <label htmlFor="title" className="form-label">
          Título del Proyecto *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="form-input"
          value={formData.title}
          onChange={handleInputChange}
          required
          disabled={loading}
        />
      </div>

      <div className="form-group">
        <label htmlFor="slug" className="form-label">
          Slug (URL amigable) *
        </label>
        <input
          type="text"
          id="slug"
          name="slug"
          className="form-input"
          value={formData.slug}
          onChange={handleInputChange}
          required
          disabled={loading}
          placeholder="mi-proyecto-web"
        />
        <small className="form-hint">Se genera automáticamente del título</small>
      </div>

      <div className="form-group" style={{ marginBottom: '4rem' }}>
        <label htmlFor="description" className="form-label">
          Descripción
        </label>
        <div className="quill-wrapper">
          <ReactQuill
            theme="snow"
            value={formData.description}
            onChange={handleDescriptionChange}
            modules={modules}
            formats={formats}
            readOnly={loading}
            placeholder="Escribe la descripción del proyecto..."
            style={{ height: '300px' }}
          />
        </div>
        <style>{`
          .quill-wrapper .ql-container {
            font-family: var(--body-font);
            font-size: var(--normal-font-size);
            border-bottom-left-radius: 0.5rem;
            border-bottom-right-radius: 0.5rem;
          }
          .quill-wrapper .ql-toolbar {
            border-top-left-radius: 0.5rem;
            border-top-right-radius: 0.5rem;
            border-color: #ccc;
          }
          .quill-wrapper .ql-container.ql-snow {
             border-color: #ccc;
          }
          .quill-wrapper .ql-editor {
            background-color: #fff;
            min-height: 200px;
          }
          /* Dark mode support */
          body.dark-theme .quill-wrapper .ql-toolbar,
          body.dark-theme .quill-wrapper .ql-container {
            border-color: var(--border-color);
            background-color: var(--container-color);
          }
          body.dark-theme .quill-wrapper .ql-editor {
            background-color: var(--container-color);
            color: var(--text-color);
          }
          body.dark-theme .quill-wrapper .ql-picker {
            color: var(--text-color);
          }
          body.dark-theme .quill-wrapper .ql-stroke {
            stroke: var(--text-color);
          }
          body.dark-theme .quill-wrapper .ql-fill {
            fill: var(--text-color);
          }
        `}</style>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="category" className="form-label">
            Categoría *
          </label>
          <select
            id="category"
            name="category"
            className="form-select"
            value={formData.category}
            onChange={handleInputChange}
            required
            disabled={loading}
          >
            <option value="">Selecciona una categoría</option>
            <option value="Diseño Gráfico">Diseño Gráfico</option>
            <option value="Desarrollo Web">Desarrollo Web</option>
            <option value="Aplicaciones Moviles">Aplicaciones Moviles</option>
            <option value="Videojuegos">Videojuegos</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="project_date" className="form-label">
            Fecha del Proyecto
          </label>
          <input
            type="text"
            id="project_date"
            name="project_date"
            className="form-input"
            value={formData.project_date}
            onChange={handleInputChange}
            disabled={loading}
            placeholder="2024 o 2024-03-15"
          />
          <small className="form-hint">
            Puedes ingresar solo el año (ej: 2024) o la fecha completa (ej: 2024-03-15)
          </small>
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="link" className="form-label">
          Enlace del Proyecto
        </label>
        <input
          type="url"
          id="link"
          name="link"
          className="form-input"
          value={formData.link}
          onChange={handleInputChange}
          disabled={loading}
          placeholder="https://ejemplo.com"
        />
      </div>

      <div className="form-group">
        <label htmlFor="mainImage" className="form-label">
          Imagen Principal {!project && '*'}
        </label>
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
          </div>
        )}
        <input
          type="file"
          id="mainImage"
          className="form-file"
          accept="image/*"
          onChange={handleMainImageChange}
          required={!project}
          disabled={loading}
        />
        <small className="form-hint">Imagen principal del proyecto (JPG, PNG, WebP)</small>
      </div>

      <div className="form-group">
        <label htmlFor="heroImage" className="form-label">
          Imagen Hero (1900 x 900px)
        </label>
        {heroImagePreview && (
          <div className="image-preview image-preview--hero">
            <img src={heroImagePreview} alt="Hero Preview" />
          </div>
        )}
        <input
          type="file"
          id="heroImage"
          className="form-file"
          accept="image/*"
          onChange={handleHeroImageChange}
          disabled={loading}
        />
        <small className="form-hint">Imagen horizontal grande para la galería (1648x800px)</small>
      </div>

      <div className="form-group">
        <label className="form-label">
          Galería de Imágenes (900 x 900px cada una)
        </label>
        <div className="gallery-grid">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="gallery-item">
              <label htmlFor={`galleryImage${index}`} className="gallery-label">
                Imagen {index + 2}
              </label>
              {galleryPreviews[index] && (
                <div className="image-preview image-preview--square">
                  <img src={galleryPreviews[index]} alt={`Gallery ${index + 2} Preview`} />
                </div>
              )}
              <input
                type="file"
                id={`galleryImage${index}`}
                className="form-file"
                accept="image/*"
                onChange={handleGalleryImageChange(index)}
                disabled={loading}
              />
            </div>
          ))}
        </div>
        <small className="form-hint">Imágenes cuadradas para la galería (800x800px cada una)</small>
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
              {project ? 'Actualizar' : 'Crear'} Proyecto
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default ProjectForm;
