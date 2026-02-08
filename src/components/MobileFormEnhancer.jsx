import React, { useEffect } from 'react';

const MobileFormEnhancer = () => {
  useEffect(() => {
    // Detectar si es móvil
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
      // Agregar clases específicas para móvil
      document.body.classList.add('mobile-device');
      
      // Mejorar la experiencia de scroll en formularios
      const forms = document.querySelectorAll('.newsletter-form-container, .contact-form-container, .footer-newsletter-container');
      
      forms.forEach(form => {
        form.addEventListener('focusin', (e) => {
          // Scroll suave al campo cuando se enfoca
          setTimeout(() => {
            e.target.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center',
              inline: 'nearest'
            });
          }, 300);
        });
      });
      
      // Mejorar la experiencia de los botones en móvil
      const buttons = document.querySelectorAll('.btn, .filter-btn, .read-more-btn, .submit-btn, .newsletter-btn');
      
      buttons.forEach(button => {
        button.addEventListener('touchstart', () => {
          button.style.transform = 'scale(0.95)';
        });
        
        button.addEventListener('touchend', () => {
          setTimeout(() => {
            button.style.transform = 'scale(1)';
          }, 150);
        });
      });
      
      // Mejorar la experiencia de las opciones de interés
      const interestOptions = document.querySelectorAll('.interest-option');
      
      interestOptions.forEach(option => {
        option.addEventListener('touchstart', () => {
          option.style.transform = 'scale(0.98)';
        });
        
        option.addEventListener('touchend', () => {
          setTimeout(() => {
            option.style.transform = 'scale(1)';
          }, 150);
        });
      });
    }
    
    // Cleanup
    return () => {
      document.body.classList.remove('mobile-device');
    };
  }, []);

  return null; // Este componente no renderiza nada
};

export default MobileFormEnhancer;
