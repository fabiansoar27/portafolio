import { useState, useEffect } from 'react';
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
import '../assets/css/animations.css'; // Importa las animaciones

const Home = () => {
  const [showPreloader, setShowPreloader] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const fadeOutTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1500);

    const showContentTimer = setTimeout(() => {
      setShowContent(true);
    }, 1500); // Inicia la animación de entrada al mismo tiempo que la de salida

    const hidePreloaderTimer = setTimeout(() => {
      setShowPreloader(false);
    }, 2000);

    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(showContentTimer);
      clearTimeout(hidePreloaderTimer);
    };
  }, []);

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
      {showPreloader && <Preloader className={fadeOut ? 'fade-out' : ''} />}
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
