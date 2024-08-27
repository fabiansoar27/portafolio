/*=============== CHANGE BACKGROUND HEADER ===============*/

function scrollHeader(){
	const header = document.getElementById('header')
	//when the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
	if(this.scrollY >= 50) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}

window.addEventListener('scroll',scrollHeader)

/*=============== SERVICES MODAL ===============*/

const modalViews = document.querySelectorAll('.services__modal'),
	modalBtns = document.querySelectorAll('.services__button'),
	modalClose = document.querySelectorAll('.services__modal-close')

let modal = function(modalClick){
	modalViews[modalClick].classList.add('active-modal')
}

modalBtns.forEach((mb,i) => {
	mb.addEventListener('click', () =>{
		modal(i)
	})
})

modalClose.forEach((mc) =>{
	mc.addEventListener('click', () =>{
		modalViews.forEach((mv) =>{
			mv.classList.remove('active-modal')
		})
	})
})

/*=============== MIXITUP FILTER PORTFOLIO ===============*/

let mixerPortfolio = mixitup('.work__container', {
    selectors: {
        target: '.work__card'
    },
    animation: {
        duration: 300
    }
});

/* Link active work */ 

const linkWork = document.querySelectorAll('.work__item')

function activeWork(){
	linkWork.forEach(l=> l.classList.remove('active-work'))
	this.classList.add('active-work')
}

linkWork.forEach(l=> l.addEventListener('click', activeWork))

/*=============== SWIPER TESTIMONIAL ===============*/

let swiperTestimonial = new Swiper(".testimonial__container", {
      spaceBetween: 24,
      loop: true,
      grabCursor: true,

      pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
      breakpoints: {
        576: {
          slidesPerView: 2,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 48,
        },
      },
});

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/

const sections = document.querySelectorAll('section[id]')

function scrollActive() {
    const scrollY = window.pageYOffset

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
            sectionTop = current.offsetTop - 58,
            sectionId = current.getAttribute('id')

        const targetElement = document.querySelector('.nav__menu a[href*=' + sectionId + ']')
        if (targetElement) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                targetElement.classList.add('active-link')
            } else {
                targetElement.classList.remove('active-link')
            }
        }
    })
}

window.addEventListener('scroll', scrollActive)

/*=============== EMAIL JS ===============*/

const contactForm = document.getElementById('mensaje'),
      contactMessage = document.getElementById('contact-message')

// Function to check if all fields are filled
const validateForm = () => {
   const formFields = contactForm.querySelectorAll('input, textarea'); // Add any other form elements if necessary
   let allFilled = true;

   formFields.forEach(field => {
      if (field.value.trim() === '') {
         allFilled = false;
      }
   });

   return allFilled;
}

const sendEmail = (e) => {
   e.preventDefault();

   // Validar campos
   if (!validateForm()) {
      contactMessage.innerHTML = "Por favor, rellene todos los campos. <i class='bx bx-message-square-error'></i>";
      showToastNotification();
      return;
   }
   
   // Enviar correo
   emailjs.sendForm('service_dnbv2ii', 'template_o84eh2m', '#mensaje', '3s_fsEYl-fBvGve7d')
   .then(() => {
      contactMessage.innerHTML = "Mensaje enviado. <i class='bx bx-message-check'></i>";
      showToastNotification();
      contactForm.reset();
   }, (error) => {  // Captura el error
      contactMessage.innerHTML = "Mensaje no enviado. (Error del servidor) <i class='bx bx-message-square-x'></i>";
      console.error('Error al enviar el correo:', error);  // Muestra más detalles del error en la consola
      showToastNotification();
   });

}

// Función para mostrar y ocultar el toast notification
const showToastNotification = () => {
   contactMessage.classList.add('show'); // Añadir clase para mostrar la notificación
   setTimeout(() => {
      contactMessage.classList.remove('show'); // Quitar clase para ocultar la notificación
   }, 5000); // Mantener la notificación visible durante 5 segundos
}

contactForm.addEventListener('submit', sendEmail);

/*=============== NO MOSTRAR HASH EN APARTADOS (#) ===============*/

document.querySelectorAll('a.nav__link, a.button, a.footer__link').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        // Solo prevenir el comportamiento por defecto si el enlace apunta a un ID en la misma página
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault(); // Evita que el enlace siga el hash en la URL

            const targetID = this.getAttribute('href').substring(1); // Obtiene el ID del destino
            const targetElement = document.getElementById(targetID);

            window.scrollTo({
                top: targetElement.offsetTop, // Desplaza la página hacia el destino
                behavior: 'smooth' // Desplazamiento suave
            });
        }
    });
});


/*==================== PRELOADER ====================*/
window.addEventListener('load', () => {
  const contenedor_loader = document.querySelector('.contenedor_loader');
  contenedor_loader.style.opacity = 0;
  contenedor_loader.style.visibility = 'hidden';
});
