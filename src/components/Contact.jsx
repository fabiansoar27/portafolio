import { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import toast, { Toaster } from 'react-hot-toast';

const Contact = () => {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    user_nombre: '',
    user_contacto: '',
    user_servicio: 'Diseño de marca',
    user_mensaje: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    return Object.values(formData).every(value => value.trim() !== '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Por favor, rellene todos los campos.', {
        duration: 5000,
        icon: '❌'
      });
      return;
    }

    // EmailJS configuration - using the same credentials from the original site
    emailjs.sendForm(
      'service_dnbv2ii',
      'template_o84eh2m',
      formRef.current,
      '3s_fsEYl-fBvGve7d'
    )
    .then(() => {
      toast.success('Mensaje enviado.', {
        duration: 5000,
        icon: '✅'
      });
      setFormData({
        user_nombre: '',
        user_contacto: '',
        user_servicio: 'Diseño de marca',
        user_mensaje: ''
      });
    })
    .catch((error) => {
      console.error('Error al enviar el correo:', error);
      toast.error('Mensaje no enviado. (Error del servidor)', {
        duration: 5000,
        icon: '❌'
      });
    });
  };

  return (
    <section className="contact section" id="contacto">
      <Toaster position="top-right" />
      <span className="section__subtitle">Envíame un mensaje</span>
      <h2 className="section__title">Contacta conmigo</h2>

      <div className="contact__container container grid">
        <div className="contact__content">
          <h3 className="contact__title">Háblame por</h3>

          <div className="contact__info">
            <div className="contact__card">
              <i className='bx bxl-messenger contact__card-icon'></i>
              <h3 className="contact__card-title">Messenger</h3>
              <span className="contact__card-data">Fabiansoar</span>
              <a 
                href="https://m.me/61560494786588" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact__button"
              >
                Escríbeme <i className='bx bx-right-arrow-alt contact__button-icon'></i>
              </a>
            </div>

            <div className="contact__card">
              <i className='bx bxl-whatsapp contact__card-icon'></i>
              <h3 className="contact__card-title">WhatsApp</h3>
              <span className="contact__card-data">+52 2941071690</span>
              <a 
                href="https://wa.me/522941071690?text=%C2%A1Hola!%20Fabi%C3%A1n%2C%20He%20visto%20tu%20portafolio%20web%20y%20me%20encantaron%20tus%20trabajos.%20Me%20gustar%C3%ADa%20hablar%20contigo%20sobre%20un%20proyecto.%20%C2%BFTienes%20tiempo%20para%20conversar%3F" 
                target="_blank" 
                rel="noopener noreferrer"
                className="contact__button"
              >
                Escríbeme <i className='bx bx-right-arrow-alt contact__button-icon'></i>
              </a>
            </div>
          </div>
        </div>

        <div className="contact__content">
          <h3 className="contact__title">Mensaje directo</h3>

          <form ref={formRef} className="contact__form" onSubmit={handleSubmit}>
            <div className="contact__form-div">
              <label className="contact__form-tag">Nombre</label>
              <input 
                type="text" 
                name="user_nombre" 
                placeholder="Ingresa tu nombre" 
                className="contact__form-input"
                value={formData.user_nombre}
                onChange={handleChange}
              />
            </div>

            <div className="contact__form-div">
              <label className="contact__form-tag">Correo electrónico | Número telefónico</label>
              <input 
                type="text" 
                name="user_contacto" 
                placeholder="Ingresa tu contacto" 
                className="contact__form-input"
                value={formData.user_contacto}
                onChange={handleChange}
              />
            </div>

            <div className="contact__form-div">
              <label className="contact__form-tag">Servicio</label>
              <select 
                className="contact__form-div2 contact__form-selector" 
                name="user_servicio"
                value={formData.user_servicio}
                onChange={handleChange}
                required
              >
                <option>Diseño de marca</option>
                <option>Rediseño de marca</option>
                <option>Página web</option>
                <option>Sitio web</option>
                <option>Tienda en línea</option>
                <option>Creación de logotipo</option>
                <option>Diseño para Redes Sociales</option>
              </select>
            </div>

            <div className="contact__form-div contact__form-area">
              <label className="contact__form-tag">Mensaje</label>
              <textarea 
                name="user_mensaje" 
                cols="30" 
                rows="10" 
                placeholder="Escribe tu proyecto" 
                className="contact__form-input"
                value={formData.user_mensaje}
                onChange={handleChange}
              ></textarea>
            </div>

            <button type="submit" className="button">
              Enviar mensaje <i className='bx bx-send'></i>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
