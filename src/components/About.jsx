const About = () => {
  return (
    <section className="about section" id="sobremi">
      <span className="section__subtitle">Introducción</span>
      <h2 className="section__title">Sobre mí</h2>

      <div className="about__container container">
        <div className="about__info">
          <div className="about__box">
            <i className='bx bx-award about__icon'></i>
            <h3 className="about__title">Experiencia</h3>
            <span className="about__subtitle">+6 años</span>
          </div>

          <div className="about__box">
            <i className='bx bx-briefcase-alt about__icon'></i>
            <h3 className="about__title">Proyectos</h3>
            <span className="about__subtitle">+45 completados</span>
          </div>

          <div className="about__box">
            <i className='bx bx-book about__icon'></i>
            <h3 className="about__title">Cursos</h3>
            <span className="about__subtitle">+8 finalizados</span>
          </div>

          <div className="about__box">
            <i className='bx bx-smile about__icon'></i>
            <h3 className="about__title">Clientes</h3>
            <span className="about__subtitle">+25 satisfechos</span>
          </div>
        </div>

        <div className="about__data">
          <p className="about__description">
            Mi capacidad para combinar diseño gráfico y desarrollo web me permite ofrecer una ventaja única a mis clientes: proyectos visualmente atractivos, con una funcionalidad sólida y profesional. Además, he tomado cursos especializados en instituciones como{' '}
            <img 
              src="/assets/img/Google-Logo.svg" 
              alt="Google"
              className="about__inline-logo"
            />
            ,{' '}
            <img 
              src="/assets/img/GitHub-Logo.svg" 
              alt="GitHub"
              className="about__inline-logo"
            />
            {' '}y{' '}
            <img 
              src="/assets/img/Platzi-Logo.svg" 
              alt="Platzi"
              className="about__inline-logo"
            />
            , lo que respalda y actualiza constantemente mi trabajo.
          </p>

          <a 
            href="#contacto" 
            className="button about__button"
          >
            Contactar <i className='bx bx-send'></i>
          </a>
        </div>
      </div>
    </section>
  );
};

export default About;
