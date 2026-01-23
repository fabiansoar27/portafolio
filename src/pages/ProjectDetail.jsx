import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProjectDetails();
  }, [id]);

  useEffect(() => {
    if (project) {
      document.title = `Fabián - ${project.title}`;
      // Basic meta tag updates could go here similar to previous version
    }
  }, [project]);

  // Función para limpiar el HTML problemático
  const sanitizeHTML = (html) => {
    if (!html) return '';

    // Paso crítico: Reemplazar &nbsp; (espacios de no separación) por espacios normales
    // Esto evita que el navegador trate frases enteras como una sola palabra larga
    let cleanHtml = html
      .replace(/&nbsp;/g, ' ')
      .replace(/\u00A0/g, ' ');

    // Crea un elemento temporal para manipular el HTML
    const temp = document.createElement('div');
    temp.innerHTML = cleanHtml;

    // Elimina estilos inline problemáticos
    const allElements = temp.querySelectorAll('*');
    allElements.forEach(el => {
      // Elimina anchos fijos
      if (el.style.width && !el.style.width.includes('%')) {
        el.style.removeProperty('width');
      }
      if (el.style.minWidth) {
        el.style.removeProperty('min-width');
      }

      // Elimina white-space problemático
      if (el.style.whiteSpace === 'nowrap' || el.style.whiteSpace === 'pre') {
        el.style.removeProperty('white-space');
      }

      // Elimina position absolute/fixed que cause overflow
      if (el.style.position === 'absolute' || el.style.position === 'fixed') {
        el.style.removeProperty('position');
      }
    });

    return temp.innerHTML;
  };

  const fetchProjectDetails = async () => {
    try {
      setLoading(true);

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

      // Fetch related info
      const [relatedRes, experiencesRes] = await Promise.all([
        supabase
          .from('projects')
          .select('*')
          .eq('category', projectData.category)
          .neq('slug', id),
        getExperiencesByProjectId(projectData.id)
      ]);

      if (!relatedRes.error) {
        const shuffled = (relatedRes.data || []).sort(() => Math.random() - 0.5);
        setRelatedProjects(shuffled.slice(0, 4));
      }

      if (!experiencesRes.error) {
        setExperiences(experiencesRes.data || []);
      }

    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    if (/^\d{4}$/.test(dateString.trim())) return dateString.trim();
    const date = new Date(dateString);
    if (!isNaN(date.getTime())) {
      return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
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
              <button onClick={() => navigate('/proyectos')} className="button">
                <i className='bx bx-arrow-back'></i> Volver a proyectos
              </button>
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
            {/* Header/Navigation */}
            <div className="project-detail__nav">
              <Link to="/proyectos" className="project-detail__back">
                <i className='bx bx-arrow-back'></i> Volver
              </Link>
            </div>

            {/* Hero Section */}
            <div className="project-detail__hero">
              <div className="project-detail__hero-content">
                {/* Título */}
                <h1 className="project-detail__hero-title">
                  {project.title}
                </h1>

                {/* Info Container */}
                <div className="project-detail__info">
                  {/* Descripción - con HTML sanitizado */}
                  <div
                    className="project-detail__description"
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHTML(project.description)
                    }}
                  />
                </div>
              </div>

              {/* Gallery Section */}
              {project.images && project.images.length > 0 ? (
                <div className="project-detail__gallery">
                  {project.images.map((imageUrl, index) => (
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
                  ))}
                </div>
              ) : (
                <div className="project-detail__gallery">
                  <div className="project-detail__gallery-item project-detail__gallery-item--1">
                    <img
                      src={project.image_url}
                      alt={project.title}
                    />
                  </div>
                </div>
              )}

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
                      color: var(--text-color-light);
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
