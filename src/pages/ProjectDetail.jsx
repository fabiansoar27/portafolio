import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../supabaseClient';
import ProjectDetailSkeleton from '../components/ProjectDetailSkeleton';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjectDetails();
  }, [id]);

  useEffect(() => {
    if (project) {
      // SEO Meta tags dinámicos
      document.title = `Fabián - ${project.title}`;
      
      // Extraer texto plano de la descripción HTML
      const plainDescription = stripHtml(project.description);
      const shortDescription = plainDescription.substring(0, 160);
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', shortDescription);
      }

      updateMetaTag('og:title', `Fabián - ${project.title}`);
      updateMetaTag('og:description', shortDescription);
      updateMetaTag('og:type', 'article');
      updateMetaTag('og:url', window.location.href);
      updateMetaTag('og:image', project.image_url || (project.images && project.images[0]) || `${window.location.origin}/og-image.jpg`);
      
      updateMetaTag('twitter:card', 'summary_large_image');
      updateMetaTag('twitter:title', `Fabián - ${project.title}`);
      updateMetaTag('twitter:description', shortDescription);
      updateMetaTag('twitter:image', project.image_url || (project.images && project.images[0]) || `${window.location.origin}/og-image.jpg`);
    }
  }, [project]);

  const updateMetaTag = (property, content) => {
    let meta = document.querySelector(`meta[property="${property}"]`) || 
               document.querySelector(`meta[name="${property}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      if (property.startsWith('og:') || property.startsWith('twitter:')) {
        meta.setAttribute('property', property);
      } else {
        meta.setAttribute('name', property);
      }
      document.head.appendChild(meta);
    }
    meta.setAttribute('content', content);
  };

  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      
      // Obtener detalles del proyecto por slug
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('slug', id)
        .single();

      if (projectError) throw projectError;
      
      if (!projectData) {
        setError('Proyecto no encontrado');
        setLoading(false);
        return;
      }

      setProject(projectData);

      // Obtener proyectos relacionados (misma categoría, excluyendo el actual, orden aleatorio)
      const { data: relatedData, error: relatedError } = await supabase
        .from('projects')
        .select('*')
        .eq('category', projectData.category)
        .neq('slug', id);

      if (relatedError) throw relatedError;
      
      // Mezclar aleatoriamente y tomar solo 3
      const shuffled = (relatedData || []).sort(() => Math.random() - 0.5);
      setRelatedProjects(shuffled.slice(0, 3));

    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    // Si es solo un año (4 dígitos)
    if (/^\d{4}$/.test(dateString.trim())) {
      return dateString.trim();
    }
    
    // Si es una fecha completa
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('es-ES', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric' 
      });
    }
    
    // Si no es válido, devolver el string original
    return dateString;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="main">
          <section className="project-detail section">
            <div className="container">
              <ProjectDetailSkeleton />
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !project) {
    return (
      <>
        <Navbar />
        <main className="main">
          <section className="project-detail section">
            <div className="container">
              <h1 className="section__title">Proyecto no encontrado</h1>
              <p>{error}</p>
              <Link to="/proyectos" className="button">
                <i className='bx bx-arrow-back'></i> Volver a proyectos
              </Link>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="main">
        <section className="project-detail section">
          <div className="project-detail__container">
            {/* Botón volver */}
            <Link to="/proyectos" className="project-detail__back">
              <i className='bx bx-arrow-back'></i> Volver
            </Link>

            {/* Hero Section con título grande */}
            <div className="project-detail__hero">
              <div className="project-detail__hero-content">
                <h1 className="project-detail__hero-title">{project.title}</h1>
                
                <div className="project-detail__info">
                  <div 
                    className="project-detail__description"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                </div>
              </div>

              {/* Grid de imágenes tipo masonry */}
              <div className="project-detail__gallery">
                {project.images && project.images.length > 0 ? (
                  project.images.map((imageUrl, index) => (
                    <div 
                      key={index} 
                      className={`project-detail__gallery-item project-detail__gallery-item--${(index % 6) + 1}`}
                    >
                      <img 
                        src={imageUrl} 
                        alt={`${project.title} - captura ${index + 1}`}
                        loading="lazy"
                      />
                    </div>
                  ))
                ) : (
                  <div className="project-detail__gallery-item project-detail__gallery-item--1">
                    <img 
                      src={project.image_url} 
                      alt={project.title}
                    />
                  </div>
                )}
              </div>

              {/* Meta información después de las imágenes */}
              <div className="project-detail__meta">
                <div className="project-detail__meta-item">
                  <span className="project-detail__meta-label">Categoría</span>
                  <span className="project-detail__meta-value">{project.category}</span>
                </div>
                
                {project.project_date && (
                  <div className="project-detail__meta-item">
                    <span className="project-detail__meta-label">Fecha</span>
                    <span className="project-detail__meta-value">{formatDate(project.project_date)}</span>
                  </div>
                )}
                
                {project.link && (
                  <div className="project-detail__meta-item">
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="button button--small"
                    >
                      Ver proyecto <i className='bx bx-link-external'></i>
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Proyectos relacionados */}
            {relatedProjects.length > 0 && (
              <div className="project-detail__related">
                <h2 className="section__title">Más proyectos</h2>
                <div className="work__container container grid">
                  {relatedProjects.map((relatedProject) => (
                    <div key={relatedProject.id} className="work__card">
                      <img src={relatedProject.image_url} alt={relatedProject.title} className="work__img" />
                      <h3 className="work__title">{relatedProject.title}</h3>
                      <span className="categoria">{relatedProject.category}</span>
                      <Link 
                        to={`/proyectos/${relatedProject.slug}`}
                        className="work__button"
                      >
                        Ver detalles <i className='bx bx-right-arrow-alt work__icon'></i>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default ProjectDetail;
