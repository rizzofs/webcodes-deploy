/**
 * Utilidades para Google Analytics
 * Funciones helper para trackear eventos personalizados
 */

// Obtener el ID de Google Analytics desde el entorno o usar el por defecto
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-C73GLNE05C';

/**
 * Función genérica para trackear eventos personalizados
 * @param {string} eventName - Nombre del evento
 * @param {object} eventParams - Parámetros adicionales del evento
 */
export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, {
      ...eventParams,
      timestamp: new Date().toISOString(),
    });
    console.log('📊 Analytics Event:', eventName, eventParams);
  } else {
    console.warn('⚠️ Google Analytics no está disponible');
  }
};

/**
 * Eventos predefinidos para acciones comunes del sitio
 */
export const analyticsEvents = {
  // ============ NAVEGACIÓN ============
  
  /**
   * Trackea clics en enlaces externos
   * @param {string} url - URL del enlace
   * @param {string} linkText - Texto del enlace
   */
  externalLinkClick: (url, linkText = '') => trackEvent('external_link_click', { 
    category: 'Navigation',
    action: 'click',
    label: linkText,
    link_url: url
  }),

  /**
   * Trackea clics en enlaces del menú
   * @param {string} section - Sección del menú
   */
  menuClick: (section) => trackEvent('menu_click', { 
    category: 'Navigation',
    action: 'click',
    label: section
  }),

  // ============ FORMULARIOS ============
  
  /**
   * Trackea envío de formularios
   * @param {string} formName - Nombre del formulario
   */
  formSubmit: (formName) => trackEvent('form_submit', { 
    category: 'Form',
    action: 'submit',
    label: formName
  }),

  /**
   * Trackea inicio de completado de formulario
   * @param {string} formName - Nombre del formulario
   */
  formStart: (formName) => trackEvent('form_start', { 
    category: 'Form',
    action: 'start',
    label: formName
  }),

  // ============ CACIC ============
  
  /**
   * Trackea cuando un usuario hace clic en una imagen del CACIC
   * @param {string} imageName - Nombre de la imagen
   */
  cacicImageClick: (imageName) => trackEvent('cacic_image_click', { 
    category: 'CACIC',
    action: 'click',
    label: imageName
  }),

  /**
   * Trackea cuando un usuario navega al carrusel del CACIC en móvil
   */
  cacicCarouselView: () => trackEvent('cacic_carousel_view', { 
    category: 'CACIC',
    action: 'view',
    label: 'Mobile Carousel'
  }),

  // ============ CONTACTO ============
  
  /**
   * Trackea clics en enlaces de WhatsApp
   * @param {string} section - Sección desde donde se hizo clic
   */
  whatsappClick: (section = 'general') => trackEvent('whatsapp_click', { 
    category: 'Contact',
    action: 'click',
    label: section
  }),

  /**
   * Trackea clics en enlaces de email
   * @param {string} email - Dirección de email
   */
  emailClick: (email) => trackEvent('email_click', { 
    category: 'Contact',
    action: 'click',
    label: email
  }),

  // ============ RECURSOS ============
  
  /**
   * Trackea cuando un usuario descarga un recurso
   * @param {string} resourceName - Nombre del recurso
   * @param {string} resourceType - Tipo de recurso (PDF, link, etc.)
   */
  resourceDownload: (resourceName, resourceType = '') => trackEvent('resource_download', { 
    category: 'Resources',
    action: 'download',
    label: resourceName,
    resource_type: resourceType
  }),

  // ============ BLOG ============
  
  /**
   * Trackea cuando un usuario lee un artículo del blog
   * @param {string} articleTitle - Título del artículo
   */
  articleRead: (articleTitle) => trackEvent('article_read', { 
    category: 'Blog',
    action: 'read',
    label: articleTitle
  }),

  // ============ BÚSQUEDA ============
  
  /**
   * Trackea búsquedas realizadas en el sitio
   * @param {string} searchTerm - Término buscado
   */
  search: (searchTerm) => trackEvent('search', { 
    category: 'Search',
    action: 'search',
    label: searchTerm,
    search_term: searchTerm
  }),

  // ============ SOCIAL ============
  
  /**
   * Trackea clics en enlaces de redes sociales
   * @param {string} platform - Plataforma social (Instagram, Twitter, etc.)
   */
  socialClick: (platform) => trackEvent('social_click', { 
    category: 'Social',
    action: 'click',
    label: platform
  }),
};

/**
 * Trackea un error
 * @param {string} errorMessage - Mensaje de error
 * @param {string} errorLocation - Ubicación donde ocurrió el error
 */
export const trackError = (errorMessage, errorLocation = 'unknown') => {
  trackEvent('error', {
    category: 'Error',
    action: 'error',
    label: errorMessage,
    error_location: errorLocation
  });
};






