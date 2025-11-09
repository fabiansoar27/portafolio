import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [scrollHeader, setScrollHeader] = useState(false);
  const [activeLink, setActiveLink] = useState('#inicio');
  const location = useLocation();
  const navigate = useNavigate();

  // Detectar si estamos en la página principal
  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  const isProjectsPage = location.pathname === '/proyectos';
  const isProjectDetailPage = location.pathname.startsWith('/proyectos/');

  // Si estamos en la página de proyectos, marcar el icono de portafolio como activo
  // Si estamos en detalles de proyecto, no marcar ninguno
  useEffect(() => {
    if (isProjectDetailPage) {
      setActiveLink('');
    } else if (isProjectsPage) {
      setActiveLink('#portafolio');
    } else if (isHomePage) {
      setActiveLink('#inicio');
    }
  }, [isProjectsPage, isProjectDetailPage, isHomePage]);

  useEffect(() => {
    const handleScroll = () => {
      // Change background header
      if (window.scrollY >= 50) {
        setScrollHeader(true);
      } else {
        setScrollHeader(false);
      }

      // Scroll sections active link (solo en home)
      if (isHomePage) {
        const sections = document.querySelectorAll('section[id]');
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
          const sectionHeight = current.offsetHeight;
          const sectionTop = current.offsetTop - 58;
          const sectionId = current.getAttribute('id');

          if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            setActiveLink(`#${sectionId}`);
          }
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  // Manejar clicks en los links
  const handleNavClick = (e, href) => {
    e.preventDefault();

    if (isHomePage) {
      // Si estamos en home, scroll normal
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        setActiveLink(href);
      }
    } else {
      // Si estamos en otra página, navegar a home con el hash
      navigate(`/${href}`);
    }
  };

  const navLinks = [
    { href: '#inicio', icon: 'bx-home-alt' },
    { href: '#sobremi', icon: 'bx-user' },
    { href: '#habilidades', icon: 'bx-book' },
    { href: '#portafolio', icon: 'bx-briefcase-alt-2' },
    { href: '#contacto', icon: 'bx-message-square-detail' }
  ];

  return (
    <header className={`header ${scrollHeader ? 'scroll-header' : ''}`} id="header">
      <nav className="nav container">
        <a
          href="/"
          className="nav__logo"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
            setActiveLink('#inicio');
          }}
        >
          Fabián
        </a>

        <div className="nav__menu">
          <ul className="nav__list">
            {navLinks.map((link) => (
              <li key={link.href} className="nav__item">
                <a
                  href={link.href}
                  className={`nav__link ${activeLink === link.href ? 'active-link' : ''}`}
                  onClick={(e) => handleNavClick(e, link.href)}
                >
                  <i className={`bx ${link.icon}`}></i>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
