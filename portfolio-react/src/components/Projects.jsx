import { Link } from 'react-router-dom';
import useProjects from '../hooks/useProjects';

const Projects = () => {
  const { projects, loading, error } = useProjects(4);

  if (loading) {
    return (
      <section className="work section" id="portafolio">
        <span className="section__subtitle">Portafolio</span>
        <h2 className="section__title">Últimos proyectos</h2>
        <div className="container">Cargando proyectos...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="work section" id="portafolio">
        <span className="section__subtitle">Portafolio</span>
        <h2 className="section__title">Últimos proyectos</h2>
        <div className="container">Error al cargar proyectos: {error}</div>
      </section>
    );
  }

  return (
    <section className="work section" id="portafolio">
      <span className="section__subtitle">Portafolio</span>
      <h2 className="section__title">Últimos proyectos</h2>

      <div className="work__container container grid">
        {projects.map((project) => (
          <div key={project.id} className="work__card">
            <img src={project.image_url} alt={project.title} className="work__img" />
            <h3 className="work__title">{project.title}</h3>
            <span className="categoria">{project.category}</span>
            <Link 
              to={`/proyectos/${project.slug}`}
              className="work__button"
            >
              Ver detalles <i className='bx bx-right-arrow-alt work__icon'></i>
            </Link>
          </div>
        ))}
      </div>

      <div className="button-portafolio">
        <Link to="/proyectos" className="button">
          Ver portafolio completo <i className='bx bx-right-arrow-alt work__icon'></i>
        </Link>
      </div>
    </section>
  );
};

export default Projects;
