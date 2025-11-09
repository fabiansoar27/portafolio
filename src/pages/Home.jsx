import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import Preloader from '../components/Preloader';
import { trackVisit } from '../services/metricsService';
import '../assets/css/animations.css';

const Home = () => {
  const [preloaderVisible, setPreloaderVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Inicia el desvanecimiento del preloader
    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    // Muestra el contenido (aún invisible, pero presente para el renderizado)
    const showContentTimer = setTimeout(() => {
      setShowContent(true);
    }, 1500); // Sincronizado con el inicio del fade-out

    // Elimina completamente el preloader del DOM después de la animación
    const hidePreloaderTimer = setTimeout(() => {
      setPreloaderVisible(false);
    }, 2000); // 1500ms (inicio) + 500ms (duración de la animación)

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(showContentTimer);
      clearTimeout(hidePreloaderTimer);
    };
  }, []);

  useEffect(() => {
    if (showContent && location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [showContent, location]);

  useEffect(() => {
    document.title = 'Fabián - Portafolio';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Portafolio de Fabián - Diseñador gráfico y desarrollador web. Explora mis proyectos de diseño, desarrollo y más.');
    }

    updateMetaTag('og:title', 'Fabián - Portafolio');
    updateMetaTag('og:description', 'Portafolio de Fabián - Diseñador gráfico y desarrollador web. Explora mis proyectos de diseño, desarrollo y más.');
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('og:image', `${window.location.origin}/og-image.jpg`);
    
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', 'Fabián - Portafolio');
    updateMetaTag('twitter:description', 'Portafolio de Fabián - Diseñador gráfico y desarrollador web.');
    updateMetaTag('twitter:image', `${window.location.origin}/og-image.jpg`);
    
    trackVisit();
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

  return (
    <>
      {preloaderVisible && <Preloader className={fadeOut ? 'fade-out' : ''} />}
      <div 
        className={showContent ? 'fade-in' : ''}
        style={{ visibility: showContent ? 'visible' : 'hidden' }}
      >
        <Navbar />
        <main className="main">
          <Hero />
          <About />
          <Skills />
          <Services />
          <Projects />
          <Testimonials />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Home;
