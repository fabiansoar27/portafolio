const WhatsAppButton = () => {
  const whatsappUrl = "https://wa.me/522941129950?text=%C2%A1Hola!%20Fabi%C3%A1n%2C%20He%20visto%20tu%20portafolio%20web%20y%20me%20encantaron%20tus%20trabajos.%20Me%20gustar%C3%ADa%20hablar%20contigo%20sobre%20un%20proyecto.%20%C2%BFTienes%20tiempo%20para%20conversar%3F";

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Contactar por WhatsApp"
    >
      <i className='bx bxl-whatsapp'></i>
    </a>
  );
};

export default WhatsAppButton;
