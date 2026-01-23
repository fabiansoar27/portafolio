import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import useTestimonials from '../hooks/useTestimonials';

const Testimonials = () => {
  const { testimonials, loading, error } = useTestimonials();

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={index < rating ? 'bx bxs-star' : 'bx bx-star'}
      ></i>
    ));
  };

  if (loading) {
    return (
      <section className="testimonial section">
        <span className="section__subtitle">Comentarios de clientes</span>
        <h2 className="section__title">Testimonios</h2>
        <div className="container">Cargando testimonios...</div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="testimonial section">
        <span className="section__subtitle">Comentarios de clientes</span>
        <h2 className="section__title">Testimonios</h2>
        <div className="container">Error al cargar testimonios: {error}</div>
      </section>
    );
  }

  return (
    <section className="testimonial section">
      <span className="section__subtitle">Comentarios de clientes</span>
      <h2 className="section__title">Testimonios</h2>

      <div className="testimonial__container container">
        <style>
          {`
            .testimonial__container .swiper-pagination-bullet {
              background-color: hsl(353.165, 95%, 16%) !important;
              opacity: 0.3 !important;
            }
            .testimonial__container .swiper-pagination-bullet-active {
              background-color: hsl(353.165, 95%, 16%) !important;
              opacity: 1 !important;
            }
          `}
        </style>
        <Swiper
          modules={[Pagination]}
          spaceBetween={24}
          loop={true}
          grabCursor={true}
          slidesPerView={1}
          pagination={{
            clickable: true,
            dynamicBullets: true
          }}
          breakpoints={{
            320: {
              slidesPerView: 1,
              spaceBetween: 24
            },
            768: {
              slidesPerView: 2,
              spaceBetween: 24
            },
            992: {
              slidesPerView: 3,
              spaceBetween: 24
            }
          }}
        >
          {testimonials
            .filter(t => t.show_on_home !== false) // Filter for show_on_home
            .map((testimonial) => (
              <SwiperSlide key={testimonial.id}>
                <div className="testimonial__card">
                  <div className="testimonial__header">
                    <img
                      src={testimonial.image_url}
                      alt={testimonial.name}
                      className="testimonial__img"
                    />
                    <div className="testimonial__info">
                      <h3 className="testimonial__name">{testimonial.name}</h3>
                      <p className="stars">
                        {renderStars(testimonial.rating)}
                      </p>
                    </div>
                  </div>
                  {/* Updated to use review instead of comment */}
                  <p className="testimonial__description">{testimonial.review || testimonial.comment}</p>
                </div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Testimonials;
