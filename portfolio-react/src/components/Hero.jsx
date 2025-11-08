import { trackDownload } from '../services/metricsService';

const Hero = () => {
  const handleDownloadCV = () => {
    // Track CV download
    trackDownload();
  };

  return (
    <section className="home section" id="inicio">
      <div className="home__container container grid">
        <div className="home__data">
          <span className="home__greeting">¡Hola!, soy</span>
          <h1 className="home__name">Fabián</h1>
          <h3 className="home__education">Diseñador Gráfico & Desarrollador Web</h3>

          <div className="home__buttons">
            <a
              download=""
              href="/assets/pdf/Fabián-CV.pdf"
              className="button button--ghost"
              onClick={handleDownloadCV}
            >
              Descargar CV
            </a>

            <a href="#sobremi" className="button">Sobre mí</a>
          </div>

          <div className="home__clients home__clients--desktop">
            <p className="home__clients-title">Confían en mi trabajo</p>
            <div className="home__clients-logos">
              <a
                href="https://www.advantms.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="home__client-link"
              >
                <img
                  src="/assets/img/Advant-Logo.svg"
                  alt="Advantms"
                  className="home__client-logo"
                />
              </a>
              <a
                href="https://www.instagram.com/ecoheroesmx/"
                target="_blank"
                rel="noopener noreferrer"
                className="home__client-link"
              >
                <img
                  src="/assets/img/Yoel-Logo.svg"
                  alt="Eco Heroes MX"
                  className="home__client-logo"
                />
              </a>
              <a
                href="https://www.mezklafm.mx/"
                target="_blank"
                rel="noopener noreferrer"
                className="home__client-link"
              >
                <img
                  src="/assets/img/Mezkla-Logo.svg"
                  alt="Mezkla FM"
                  className="home__client-logo"
                />
              </a>
            </div>
          </div>
        </div>

        <div className="home__handle">
          <img src="/assets/img/perfil.png" alt="Fabián" className="home__img" />
        </div>

        <div className="home__clients home__clients--mobile">
          <p className="home__clients-title">Confían en mi trabajo</p>
          <div className="home__clients-logos">
            <a
              href="https://www.advantms.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="home__client-link"
            >
              <img
                src="/assets/img/Advant-Logo.svg"
                alt="Advantms"
                className="home__client-logo"
              />
            </a>
            <a
              href="https://www.instagram.com/ecoheroesmx/"
              target="_blank"
              rel="noopener noreferrer"
              className="home__client-link"
            >
              <img
                src="/assets/img/Yoel-Logo.svg"
                alt="Eco Heroes MX"
                className="home__client-logo"
              />
            </a>
            <a
              href="https://www.mezklafm.mx/"
              target="_blank"
              rel="noopener noreferrer"
              className="home__client-link"
            >
              <img
                src="/assets/img/Mezkla-Logo.svg"
                alt="Mezkla FM"
                className="home__client-logo"
              />
            </a>
          </div>
        </div>

        <div className="home__social">
          <a
            href="https://www.facebook.com/profile.php?id=61560494786588"
            target="_blank"
            rel="noopener noreferrer"
            className="home__social-link"
          >
            <i className='bx bxl-facebook'></i>
          </a>
        </div>

        <a href="#sobremi" className="home__scroll">
          <i className='bx bx-mouse home__scroll-icon'></i>
          <span className="home__scroll-name">Scroll Down</span>
        </a>
      </div>
    </section>
  );
};

export default Hero;
