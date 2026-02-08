// Google Calendar API Integration Service
// Para conectar el calendario personalizado con Google Calendar

class GoogleCalendarService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    this.discoveryDoc = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
    this.scopes = 'https://www.googleapis.com/auth/calendar';
    this.gapi = null;
    this.isInitialized = false;
  }

  // Inicializar Google API
  async initialize() {
    if (this.isInitialized) return;

    // Verificar si las variables de entorno están configuradas
    if (!this.apiKey || !this.clientId) {
      console.warn('Google Calendar API no configurada. Variables de entorno faltantes.');
      return;
    }

    try {
      // Cargar Google API
      await this.loadGAPI();
      
      // Inicializar cliente
      await this.gapi.client.init({
        apiKey: this.apiKey,
        clientId: this.clientId,
        discoveryDocs: [this.discoveryDoc],
        scope: this.scopes
      });

      this.isInitialized = true;
      console.log('Google Calendar API inicializada correctamente');
    } catch (error) {
      console.error('Error inicializando Google Calendar API:', error);
      throw error;
    }
  }

  // Cargar Google API dinámicamente
  loadGAPI() {
    return new Promise((resolve, reject) => {
      if (window.gapi) {
        this.gapi = window.gapi;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://apis.google.com/js/api.js';
      script.onload = () => {
        window.gapi.load('client', () => {
          this.gapi = window.gapi;
          resolve();
        });
      };
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }

  // Autenticar usuario
  async authenticate() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      const authInstance = await this.gapi.auth2.getAuthInstance();
      const user = await authInstance.signIn();
      return user;
    } catch (error) {
      console.error('Error en autenticación:', error);
      throw error;
    }
  }

  // Obtener eventos del calendario
  async getEvents(calendarId = 'primary', maxResults = 50) {
    try {
      const response = await this.gapi.client.calendar.events.list({
        calendarId: calendarId,
        timeMin: new Date().toISOString(),
        maxResults: maxResults,
        singleEvents: true,
        orderBy: 'startTime'
      });

      return response.result.items || [];
    } catch (error) {
      console.error('Error obteniendo eventos:', error);
      throw error;
    }
  }

  // Crear evento en Google Calendar
  async createEvent(eventData) {
    try {
      const event = {
        summary: eventData.title,
        description: eventData.description,
        start: {
          dateTime: `${eventData.date}T${eventData.time}:00`,
          timeZone: 'America/Argentina/Buenos_Aires'
        },
        end: {
          dateTime: `${eventData.date}T${eventData.time}:00`,
          timeZone: 'America/Argentina/Buenos_Aires'
        },
        colorId: this.getColorId(eventData.type),
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 10 }
          ]
        }
      };

      const response = await this.gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event
      });

      return response.result;
    } catch (error) {
      console.error('Error creando evento:', error);
      throw error;
    }
  }

  // Actualizar evento existente
  async updateEvent(eventId, eventData) {
    try {
      const event = {
        summary: eventData.title,
        description: eventData.description,
        start: {
          dateTime: `${eventData.date}T${eventData.time}:00`,
          timeZone: 'America/Argentina/Buenos_Aires'
        },
        end: {
          dateTime: `${eventData.date}T${eventData.time}:00`,
          timeZone: 'America/Argentina/Buenos_Aires'
        },
        colorId: this.getColorId(eventData.type)
      };

      const response = await this.gapi.client.calendar.events.update({
        calendarId: 'primary',
        eventId: eventId,
        resource: event
      });

      return response.result;
    } catch (error) {
      console.error('Error actualizando evento:', error);
      throw error;
    }
  }

  // Eliminar evento
  async deleteEvent(eventId) {
    try {
      await this.gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId: eventId
      });
      return true;
    } catch (error) {
      console.error('Error eliminando evento:', error);
      throw error;
    }
  }

  // Obtener ID de color basado en el tipo de evento
  getColorId(type) {
    const colorMap = {
      meeting: '1',    // Azul
      workshop: '2',   // Verde
      academic: '3',   // Púrpura
      event: '4'       // Rojo
    };
    return colorMap[type] || '1';
  }

  // Sincronizar eventos locales con Google Calendar
  async syncEvents(localEvents) {
    try {
      const googleEvents = await this.getEvents();
      
      // Mapear eventos de Google a formato local
      const syncedEvents = googleEvents.map(event => ({
        id: event.id,
        title: event.summary || 'Sin título',
        description: event.description || '',
        date: event.start.dateTime ? 
          event.start.dateTime.split('T')[0] : 
          event.start.date,
        time: event.start.dateTime ? 
          event.start.dateTime.split('T')[1].substring(0, 5) : 
          '00:00',
        type: this.getTypeFromColor(event.colorId),
        color: this.getColorFromId(event.colorId),
        source: 'google'
      }));

      return syncedEvents;
    } catch (error) {
      console.error('Error sincronizando eventos:', error);
      throw error;
    }
  }

  // Obtener tipo de evento basado en el color
  getTypeFromColor(colorId) {
    const typeMap = {
      '1': 'meeting',
      '2': 'workshop', 
      '3': 'academic',
      '4': 'event'
    };
    return typeMap[colorId] || 'meeting';
  }

  // Obtener color basado en el ID
  getColorFromId(colorId) {
    const colorMap = {
      '1': '#2a8a8d',  // Azul
      '2': '#61dafb',  // Verde
      '3': '#ff6b6b',  // Púrpura
      '4': '#4ecdc4'   // Rojo
    };
    return colorMap[colorId] || '#6c757d';
  }

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    if (!this.gapi) return false;
    return this.gapi.auth2.getAuthInstance().isSignedIn.get();
  }

  // Cerrar sesión
  async signOut() {
    try {
      const authInstance = this.gapi.auth2.getAuthInstance();
      await authInstance.signOut();
      return true;
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      throw error;
    }
  }
}

// Instancia singleton del servicio
const googleCalendarService = new GoogleCalendarService();

export default googleCalendarService;
