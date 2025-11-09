import { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Preloader from '../components/Preloader';
import useProjects from '../hooks/useProjects';
import '../assets/css/animations.css'; // Importa las animaciones

const ProjectsList = () => {
  const { projects, loading, error } = useProjects();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');
  const [showContent, setShowContent] = useState(false);
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    if (!loading) {
      // Inicia el desvanecimiento del preloader
      const fadeOutTimer = setTimeout(() => {
        setFadeOut(true);
      }, 0); // Inicia inmediatamente cuando la carga termina

      // Muestra el contenido (aún invisible)
      const showContentTimer = setTimeout(() => {
        setShowContent(true);
      }, 0); // Sincronizado con el inicio del fade-out

      // Elimina completamente el preloader del DOM después de la animación
      const hidePreloaderTimer = setTimeout(() => {
        setPreloaderVisible(false);
      }, 500); // Duración de la animación de fade-out

      return () => {
        clearTimeout(fadeOutTimer);
        clearTimeout(showContentTimer);
        clearTimeout(hidePreloaderTimer);
      };
    }
  }, [loading]);

  useEffect(() => {
    window.scrollTo(0, 0);

    document.title = 'Fabián - Proyectos';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Explora todos mis proyectos de diseño gráfico, desarrollo web, aplicaciones móviles y videojuegos.');
    }

    updateMetaTag('og:title', 'Fabián - Proyectos');
    updateMetaTag('og:description', 'Explora todos mis proyectos de diseño gráfico, desarrollo web, aplicaciones móviles y videojuegos.');
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('og:image', `${window.location.origin}/og-image.jpg`);
    
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', 'Fabián - Proyectos');
    updateMetaTag('twitter:description', 'Explora todos mis proyectos de diseño gráfico, desarrollo web y más.');
    updateMetaTag('twitter:image', `${window.location.origin}/og-image.jpg`);

  }, []);

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

  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    if (categoryFilter !== 'all') {
      result = result.filter(project => 
        project.category.toLowerCase() === categoryFilter.toLowerCase()
      );
    }

    switch (sortOrder) {
      case 'newest':
        result.sort((a, b) => {
          const dateA = a.project_date ? 
            (/^\d{4}$/.test(a.project_date.trim()) ? new Date(`${a.project_date}-12-31`) : new Date(a.project_date)) 
            : new Date(a.created_at);
          const dateB = b.project_date ? 
            (/^\d{4}$/.test(b.project_date.trim()) ? new Date(`${b.project_date}-12-31`) : new Date(b.project_date)) 
            : new Date(b.created_at);
          return dateB - dateA;
        });
        break;
      case 'oldest':
        result.sort((a, b) => {
          const dateA = a.project_date ? 
            (/^\d{4}$/.test(a.project_date.trim()) ? new Date(`${a.project_date}-01-01`) : new Date(a.project_date)) 
            : new Date(a.created_at);
          const dateB = b.project_date ? 
            (/^\d{4}$/.test(b.project_date.trim()) ? new Date(`${b.project_date}-01-01`) : new Date(b.project_date)) 
            : new Date(b.created_at);
          return dateA - dateB;
        });
        break;
      case 'az':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'za':
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        break;
    }

    return result;
  }, [projects, categoryFilter, sortOrder]);

  if (error) {
    return (
      <>
        <Navbar />
        <main className="main">
          <section className="projects-page section">
            <div className="container">
              <h1 className="section__title">Portafolio Completo</h1>
              <p>Error al cargar proyectos: {error}</p>
            </div>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      {preloaderVisible && <Preloader className={fadeOut ? 'fade-out' : ''} />}
      <div 
        className={showContent ? 'fade-in' : ''}
        style={{ visibility: showContent ? 'visible' : 'hidden' }}
      >
        <Navbar />
        <main className="main">
          <section className="projects-page section" id="proyectos">
            <div className="projects-page__container">
              <div className="projects-page__header">
                <div className="projects-page__tabs">
                  <button 
                    className={`projects-page__tab ${categoryFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('all')}
                  >
                    Proyectos
                  </button>
                  <button 
                    className={`projects-page__tab ${categoryFilter === 'Diseño Gráfico' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('Diseño Gráfico')}
                  >
                    Diseño Gráfico
                  </button>
                  <button 
                    className={`projects-page__tab ${categoryFilter === 'Desarrollo Web' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('Desarrollo Web')}
                  >
                    Desarrollo Web
                  </button>
                  <button 
                    className={`projects-page__tab ${categoryFilter === 'Aplicaciones Moviles' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('Aplicaciones Moviles')}
                  >
                    Aplicaciones Moviles
                  </button>
                  <button 
                    className={`projects-page__tab ${categoryFilter === 'Videojuegos' ? 'active' : ''}`}
                    onClick={() => setCategoryFilter('Videojuegos')}
                  >
                    Videojuegos
                  </button>
                </div>

                <div className="projects-page__actions">
                  <div className="projects-page__sort-wrapper">
                    <i className='bx bx-filter-alt projects-page__sort-icon'></i>
                    <select 
                      className="projects-page__sort"
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                    >
                      <option value="newest">Más reciente</option>
                      <option value="oldest">Más antiguo</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="work__container container grid">
                {filteredAndSortedProjects.length === 0 ? (
                  <p className="projects-page__empty">No hay proyectos en esta categoría</p>
                ) : (
                  filteredAndSortedProjects.map((project) => (
                    <div key={project.id} className="work__card">
                      <img src={project.image_url} alt={project.title} className="work__img" />
                      <h3 className="work__title">{project.title}</h3>
                      {project.description && (
                        <p className="work__description">{stripHtml(project.description)}</p>
                      )}
                      <Link 
                        to={`/proyectos/${project.slug}`}
                        className="work__button"
                      >
                        Ver detalles <i className='bx bx-right-arrow-alt work__icon'></i>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
};

export default ProjectsList;