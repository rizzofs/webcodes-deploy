import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Hook personalizado para trackear cambios de página con Google Analytics
 * Se ejecuta automáticamente cada vez que cambia la ruta en React Router
 */
export const useGoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Verificar que gtag esté disponible
    if (typeof window.gtag === 'function') {
      // Obtener el título de la página
      const pageTitle = document.title || 'CODES++ - Centro de Estudiantes de Sistemas';
      
      // Trackear el cambio de página
      window.gtag('config', 'G-C73GLNE05C', {
        page_path: location.pathname + location.search,
        page_title: pageTitle,
        page_location: window.location.href,
      });

      // También enviar un evento personalizado de cambio de página
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: pageTitle,
        page_location: window.location.href,
      });

      console.log('📊 Google Analytics - Página trackeada:', location.pathname);
    } else {
      console.warn('⚠️ Google Analytics no está disponible (gtag no encontrado)');
    }
  }, [location]);
};






