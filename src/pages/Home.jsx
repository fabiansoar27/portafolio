import { useEffect } from 'react';
import Preloader from '../components/Preloader';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Services from '../components/Services';
import Projects from '../components/Projects';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import { trackVisit } from '../services/metricsService';

/**
 * Home page component - Public landing page
 * Integrates all public components and tracks visits
 */
const Home = () => {
  useEffect(() => {
    // Track visit when page loads
    trackVisit();

    // SEO Meta tags
    document.title = 'Fabián - Portafolio';
    
    // Meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'Portafolio de Fabián - Diseñador gráfico y desarrollador web. Explora mis proyectos de diseño, desarrollo y más.');
    }

    // Open Graph tags
    updateMetaTag('og:title', 'Fabián - Portafolio');
    updateMetaTag('og:description', 'Portafolio de Fabián - Diseñador gráfico y desarrollador web. Explora mis proyectos de diseño, desarrollo y más.');
    updateMetaTag('og:type', 'website');
    updateMetaTag('og:url', window.location.href);
    updateMetaTag('og:image', `${window.location.origin}/og-image.jpg`);
    
    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', 'Fabián - Portafolio');
    updateMetaTag('twitter:description', 'Portafolio de Fabián - Diseñador gráfico y desarrollador web.');
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

  return (
    <>
      <Preloader />
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
    </>
  );
};

export default Home;