import { useState } from 'react';
import TestimonialPopup from './TestimonialPopup';

const Footer = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <>
      <footer className="footer">
        <div className="footer__container container">
          <h1 className="footer__title">Fabián</h1>
          
          <ul className="footer__list">
            <li>
              <a href="#servicios" className="footer__link">Servicios</a>
            </li>

            <li>
              <button 
                onClick={() => setIsPopupOpen(true)}
                className="footer__link footer__link--button"
              >
                Opinar
              </button>
            </li>
          </ul>

        <ul className="footer__social">
          <a 
            href="https://www.facebook.com/profile.php?id=61560494786588" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer__social-link"
          >
            <i className='bx bxl-facebook'></i>
          </a>
        </ul>

        <span className="footer__copy">
          Fabiansoar &#169; Todos los derechos reservados.
        </span>
      </div>
    </footer>

    <TestimonialPopup 
      isOpen={isPopupOpen} 
      onClose={() => setIsPopupOpen(false)} 
    />
  </>
  );
};

export default Footer;
