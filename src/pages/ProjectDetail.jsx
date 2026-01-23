import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProjectDetailSkeleton from '../components/ProjectDetailSkeleton';
import { supabase } from '../supabaseClient';
import { getExperiencesByProjectId } from '../services/experiencesService';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [relatedProjects, setRelatedProjects] = useState([]);
  const [experiences, setExperiences] = useState([]); // State for experiences
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

      // 1. Get Project
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

      // 2. Parallel Fetch: Related Projects & Testimonials
      const [relatedRes, experiencesRes] = await Promise.all([
        supabase
          .from('projects')
          .select('*')
          .eq('category', projectData.category)
          .neq('slug', id),
        getExperiencesByProjectId(projectData.id)
      ]);

      if (relatedRes.error) throw relatedRes.error;
      const shuffled = (relatedRes.data || []).sort(() => Math.random() - 0.5);
      setRelatedProjects(shuffled.slice(0, 4));

      if (experiencesRes.error) console.error("Error fetching linked experiences:", experiencesRes.error);
      setExperiences(experiencesRes.data || []);

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
                    className="project-detail__description ql-editor"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                  <style>{`
                    .project-detail__description {
                       width: 100%;
                       overflow-wrap: break-word;
                       word-wrap: break-word;
                       word-break: break-word;
                       color: var(--text-color);
                    }
                    .project-detail__description p {
                      margin-bottom: 1rem;
                      line-height: 1.6;
                    }
                    .project-detail__description h1, 
                    .project-detail__description h2, 
                    .project-detail__description h3 {
                      margin-top: 1.5rem;
                      margin-bottom: 1rem;
                      color: var(--title-color);
                    }
                    .project-detail__description ul, 
                    .project-detail__description ol {
                      margin-left: 1.5rem;
                      margin-bottom: 1rem;
                    }
                    .project-detail__description img,
                    .project-detail__description video,
                    .project-detail__description iframe {
                      max-width: 100%;
                      height: auto;
                      border-radius: 0.5rem;
                      margin: 1rem 0;
                    }
                    .project-detail__description blockquote {
                      border-left: 4px solid var(--first-color);
                      padding-left: 1rem;
                      font-style: italic;
                      margin: 1rem 0;
                    }
                    .project-detail__description a {
                      color: var(--first-color);
                      text-decoration: underline;
                    }
                  `}</style>
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

              {/* Testimonios del Proyecto */}
              {experiences.length > 0 && (
                <div className="project-detail__testimonials">
                  <h2 className="section__title" style={{ marginBottom: '2rem' }}>Opinión del Cliente</h2>
                  <div className="testimonial__grid">
                    {experiences.map((exp) => (
                      <div key={exp.id} className="testimonial__card testimonial__card--project">
                        <div className="testimonial__header">
                          <img
                            src={exp.image_url}
                            alt={exp.name}
                            className="testimonial__img"
                          />
                          <div className="testimonial__info">
                            <h3 className="testimonial__name">{exp.name}</h3>
                            <div className="stars">
                              {Array.from({ length: 5 }, (_, i) => (
                                <i key={i} className={`bx ${i < exp.rating ? 'bxs-star' : 'bx-star'}`} style={{ color: '#EAB308' }}></i>
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="testimonial__description">{exp.review || exp.comment}</p>

                        {/* Contact Info in Project Detail */}
                        <div className="project-testimonial-details">
                          {exp.how_found && (
                            <div className="pt-detail">
                              <span className="pt-label"><i className='bx bx-search-alt'></i> Me encontró por:</span>
                              <span className="pt-value">{exp.how_found}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <style>{`
                    .project-detail__testimonials {
                      margin-top: 4rem;
                      margin-bottom: 2rem;
                    }
                    .testimonial__grid {
                      display: grid;
                      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                      gap: 1.5rem;
                    }
                    .testimonial__card--project {
                      background-color: var(--container-color);
                      padding: 1.5rem;
                      border-radius: 1rem;
                      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                      border: 1px solid rgba(0,0,0,0.05);
                    }
                    .project-testimonial-details {
                      margin-top: 1rem;
                      padding-top: 1rem;
                      border-top: 1px solid rgba(0,0,0,0.05);
                      font-size: var(--small-font-size);
                    }
                    .pt-detail {
                      display: flex;
                      align-items: center;
                      gap: 0.5rem;
                      color: var(--text-color-light);
                    }
                    
                    @media screen and (max-width: 576px) {
                      .pt-detail {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 0.25rem;
                      }
                    }
                    .pt-label {
                      font-weight: 600;
                      display: flex;
                      align-items: center;
                      gap: 0.25rem;
                    }
                  `}</style>
                </div>
              )}

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
