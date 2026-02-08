import { useState, useEffect, useCallback } from 'react';
import googleCalendarService from '../services/googleCalendar';

const useGoogleCalendar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);

  // Inicializar el servicio
  useEffect(() => {
    const initializeService = async () => {
      try {
        setIsLoading(true);
        await googleCalendarService.initialize();
        setIsAuthenticated(googleCalendarService.isAuthenticated());
      } catch (err) {
        // No mostrar error si las variables de entorno no están configuradas
        if (err.message && err.message.includes('Variables de entorno')) {
          console.warn('Google Calendar no configurado - funcionará en modo local');
        } else {
          setError('Error inicializando Google Calendar');
          console.error(err);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeService();
  }, []);

  // Autenticar usuario
  const authenticate = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await googleCalendarService.authenticate();
      setIsAuthenticated(true);
      return true;
    } catch (err) {
      setError('Error en autenticación con Google');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cerrar sesión
  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      await googleCalendarService.signOut();
      setIsAuthenticated(false);
      setEvents([]);
      return true;
    } catch (err) {
      setError('Error cerrando sesión');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Obtener eventos
  const getEvents = useCallback(async () => {
    if (!isAuthenticated) {
      setError('No autenticado');
      return [];
    }

    try {
      setIsLoading(true);
      setError(null);
      const googleEvents = await googleCalendarService.getEvents();
      setEvents(googleEvents);
      return googleEvents;
    } catch (err) {
      setError('Error obteniendo eventos');
      console.error(err);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  // Crear evento
  const createEvent = useCallback(async (eventData) => {
    if (!isAuthenticated) {
      setError('No autenticado');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      const newEvent = await googleCalendarService.createEvent(eventData);
      
      // Actualizar lista de eventos
      await getEvents();
      
      return newEvent;
    } catch (err) {
      setError('Error creando evento');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, getEvents]);

  // Actualizar evento
  const updateEvent = useCallback(async (eventId, eventData) => {
    if (!isAuthenticated) {
      setError('No autenticado');
      return null;
    }

    try {
      setIsLoading(true);
      setError(null);
      const updatedEvent = await googleCalendarService.updateEvent(eventId, eventData);
      
      // Actualizar lista de eventos
      await getEvents();
      
      return updatedEvent;
    } catch (err) {
      setError('Error actualizando evento');
      console.error(err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, getEvents]);

  // Eliminar evento
  const deleteEvent = useCallback(async (eventId) => {
    if (!isAuthenticated) {
      setError('No autenticado');
      return false;
    }

    try {
      setIsLoading(true);
      setError(null);
      await googleCalendarService.deleteEvent(eventId);
      
      // Actualizar lista de eventos
      await getEvents();
      
      return true;
    } catch (err) {
      setError('Error eliminando evento');
      console.error(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, getEvents]);

  // Sincronizar eventos
  const syncEvents = useCallback(async (localEvents) => {
    if (!isAuthenticated) {
      setError('No autenticado');
      return localEvents;
    }

    try {
      setIsLoading(true);
      setError(null);
      const syncedEvents = await googleCalendarService.syncEvents(localEvents);
      setEvents(syncedEvents);
      return syncedEvents;
    } catch (err) {
      setError('Error sincronizando eventos');
      console.error(err);
      return localEvents;
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  return {
    isAuthenticated,
    isLoading,
    error,
    events,
    authenticate,
    signOut,
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent,
    syncEvents
  };
};

export default useGoogleCalendar;
