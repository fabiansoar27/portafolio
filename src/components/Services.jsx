import { useState } from 'react';

const Services = () => {
  const [activeModal, setActiveModal] = useState(null);

  const services = [
    {
      id: 1,
      icon: 'bx-palette',
      title: 'Diseño de marca',
      description: 'Creo la identidad visual de tu marca desde cero, reflejando su esencia y diferenciándola de la competencia. Diseño un logotipo, selecciono colores y tipografías para que tu marca se destaque y conecte con tu audiencia.',
      items: [
        'Brief de marca (Cuestionario)',
        'Elaboración de bocetos',
        'Diseño de logo y variaciones',
        'Manual de identidad',
        'Posts para redes sociales'
      ]
    },
    {
      id: 2,
      icon: 'bx-refresh',
      title: 'Rediseño de marca',
      description: 'Renuevo la identidad visual de tu marca para mantenerla relevante y atractiva. Modernizo el logotipo, colores y otros elementos visuales para reflejar su evolución y mejorar su conexión con el público.',
      items: [
        'Análisis de marca',
        'Elaboración de bocetos',
        'Diseño de logo y variaciones',
        'Manual de identidad',
        'Posts para redes sociales'
      ]
    },
    {
      id: 3,
      icon: 'bx-file',
      title: 'Página web',
      description: 'Desarrollo páginas web informativas y atractivas, optimizadas para ofrecer la mejor experiencia de usuario y presentar tu negocio de manera profesional.',
      items: [
        'Elaboración de prototipo',
        'Diseño de interface digital',
        'Página web responsive',
        'Optimización SEO básica'
      ]
    },
    {
      id: 4,
      icon: 'bx-globe',
      title: 'Sitio web',
      description: 'Creo sitios web completos y funcionales con múltiples páginas, adaptados a tus necesidades específicas y objetivos de negocio.',
      items: [
        'Elaboración de prototipo',
        'Diseño de interface digital',
        'Sitio web multi-página',
        'Panel de administración'
      ]
    },
    {
      id: 5,
      icon: 'bx-cart',
      title: 'Tienda en línea',
      description: 'Desarrollo tiendas en línea completas con sistema de pagos, gestión de productos y carrito de compras para que puedas vender tus productos online.',
      items: [
        'Diseño de tienda online',
        'Catálogo de productos',
        'Carrito de compras',
        'Integración de pagos'
      ]
    },
    {
      id: 6,
      icon: 'bx-pen',
      title: 'Creación de logotipo',
      description: 'Diseño logotipos únicos y memorables que representan la esencia de tu marca, asegurando que se destaque en cualquier medio, digital o impreso.',
      items: [
        'Lluvia de ideas',
        'Conceptualización',
        'Logotipo en diferentes formatos',
        'Variaciones de color'
      ]
    },
    {
      id: 7,
      icon: 'bx-share-alt',
      title: 'Diseño para Redes Sociales',
      description: 'Diseño de contenido visual atractivo y alineado con la identidad de tu marca para redes sociales, ayudando a captar la atención de tu audiencia y mejorar tu presencia online.',
      items: [
        'Foto de perfil y portada',
        'Posts para Instagram y Facebook',
        'Historias para redes sociales',
        'Miniaturas para YouTube'
      ]
    }
  ];

  const openModal = (id) => {
    setActiveModal(id);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const scrollToContact = () => {
    const contactSection = document.querySelector('#contacto');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="services section" id="servicios">
      <span className="section__subtitle">Mis servicios</span>
      <h2 className="section__title">Lo que ofrezco</h2>

      <div className="services__container container grid">
        {services.map((service) => (
          <div key={service.id} className="services__card">
            <div className="services__title-wrapper">
              <i className={`bx ${service.icon} services__card-icon`}></i>
              <h3 className="services__title">{service.title}</h3>
            </div>

            <span className="services__button" onClick={() => openModal(service.id)}>
              Ver más <i className='bx bx-right-arrow-alt services__icon'></i>
            </span>

            <div className={`services__modal ${activeModal === service.id ? 'active-modal' : ''}`}>
              <div className="services__modal-content">
                <i className='bx bx-x services__modal-close' onClick={closeModal}></i>

                <h3 className="services__modal-title">{service.title}</h3>
                <p className="services__modal-description">
                  {service.description}
                </p>

                <ul className="services__modal-list">
                  {service.items.map((item, index) => (
                    <li key={index} className="services__modal-item">
                      <i className='bx bx-check services__modal-icon'></i>
                      <p className="services__modal-info">
                        {item}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Services;
