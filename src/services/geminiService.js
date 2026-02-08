// Gemini AI Service
// Servicio para integrar Gemini AI como asistente de CODES++

import knowledgeBase from '../data/knowledgeBase.json';

class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.baseUrl = 'https://generativelanguage.googleapis.com/v1beta';
    this.model = 'gemini-1.5-flash';
    this.isInitialized = false;
    this.knowledgeBase = knowledgeBase;
    
    // Debug: mostrar información de la API key
    console.log('API Key configurada:', this.apiKey ? 'Sí' : 'No');
    console.log('Base URL:', this.baseUrl);
    console.log('Modelo:', this.model);
  }

  // Inicializar el servicio
  async initialize() {
    if (this.isInitialized) return;
    
    this.isInitialized = true;
    
    if (!this.apiKey) {
      console.warn('Gemini API Key no configurada. Funcionando en modo demo.');
      return true;
    }

    console.log('Gemini AI Service inicializado correctamente');
    return true;
  }

  // Enviar mensaje al asistente
  async sendMessage(message, context = {}) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.apiKey) {
      // Modo demo - responder con información de la base de conocimiento
      console.log('Usando modo demo para mensaje:', message);
      return this.getDemoResponse(message);
    }

    try {
      console.log('Enviando mensaje a Gemini API...');
      const systemPrompt = this.getSystemPrompt(context);
      const fullMessage = `${systemPrompt}\n\nUsuario: ${message}`;

      const url = `${this.baseUrl}/models/${this.model}:generateContent?key=${this.apiKey}`;
      console.log('URL de la API:', url);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: fullMessage
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          }
        })
      });

      console.log('Respuesta de la API:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error detallado de la API:', errorText);
        throw new Error(`Error en la API de Gemini: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Datos recibidos de Gemini:', data);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return data.candidates[0].content.parts[0].text;
      } else {
        console.error('Estructura de respuesta inesperada:', data);
        throw new Error('Respuesta inválida de Gemini');
      }
    } catch (error) {
      console.error('Error enviando mensaje a Gemini:', error);
      // En caso de error, usar respuesta demo como fallback
      console.log('Usando respuesta demo como fallback');
      return this.getDemoResponse(message);
    }
  }

  // Obtener prompt del sistema
  getSystemPrompt(context) {
    const currentDate = new Date().toLocaleDateString('es-AR');
    const currentTime = new Date().toLocaleTimeString('es-AR');

    // Extraer información relevante de la base de conocimiento
    const orgInfo = this.knowledgeBase.organization;
    const studyGroups = this.knowledgeBase.studyGroups;
    const events = this.knowledgeBase.events;
    const resources = this.knowledgeBase.resources;
    const contact = this.knowledgeBase.contact;
    const faq = this.knowledgeBase.faq;

    return `Eres el asistente de IA de ${orgInfo.name} (${orgInfo.fullName}) de la ${orgInfo.university}.

INFORMACIÓN ORGANIZACIONAL:
- Nombre: ${orgInfo.name}
- Nombre completo: ${orgInfo.fullName}
- Universidad: ${orgInfo.university}
- Carrera: ${orgInfo.career}
- Ubicación: ${orgInfo.location}
- Fundado: ${orgInfo.founded}
- Misión: ${orgInfo.mission}
- Visión: ${orgInfo.vision}

GRUPOS DE ESTUDIO DISPONIBLES:
${studyGroups.map(group => `
- ${group.name} (${group.subject})
  Horario: ${group.schedule}
  Ubicación: ${group.location}
  Coordinador: ${group.coordinator}
  Nivel: ${group.level}
  Contacto: ${group.contact}
`).join('')}

EVENTOS PRÓXIMOS:
${events.map(event => `
- ${event.name} (${event.type})
  Fecha: ${event.date} ${event.time}
  Ubicación: ${event.location}
  Descripción: ${event.description}
  Contacto: ${event.contact}
`).join('')}

RECURSOS ACADÉMICOS:
${resources.academic.map(resource => `
- ${resource.name}: ${resource.description}
  Acceso: ${resource.access}
`).join('')}

RECURSOS LABORALES:
${resources.career.map(resource => `
- ${resource.name}: ${resource.description}
`).join('')}

CONTACTO:
- Email: ${contact.email}
- Teléfono: ${contact.phone}
- Dirección: ${contact.address}
- Horario de oficina: ${contact.officeHours}
- Ubicación: ${contact.officeLocation}
- Redes sociales: ${Object.entries(contact.socialMedia).map(([platform, handle]) => `${platform}: ${handle}`).join(', ')}

PREGUNTAS FRECUENTES:
${faq.map(qa => `
P: ${qa.question}
R: ${qa.answer}
`).join('')}

CONTEXTO ADICIONAL:
- Fecha actual: ${currentDate} ${currentTime}
${context.events ? `- Eventos del usuario: ${context.events}` : ''}
${context.userInfo ? `- Información del usuario: ${context.userInfo}` : ''}

INSTRUCCIONES:
1. Responde de manera amigable y profesional
2. Mantén un tono estudiantil y cercano
3. Usa la información de la base de conocimiento para responder
4. Proporciona detalles específicos cuando sea relevante
5. Si no sabes algo específico, sugiere contactar con la comisión directiva
6. Mantén las respuestas concisas pero informativas
7. Usa emojis ocasionalmente para ser más amigable
8. Siempre incluye información de contacto cuando sea relevante

Responde en español argentino.`;
  }

  // Obtener sugerencias rápidas
  getQuickSuggestions() {
    return [
      "¿Qué actividades organiza CODES++?",
      "¿Cómo puedo unirme a un grupo de estudio?",
      "¿Cuáles son los próximos eventos?",
      "¿Qué recursos académicos ofrecen?",
      "¿Cómo contacto a la comisión directiva?"
    ];
  }

  // Buscar información específica en la base de conocimiento
  searchKnowledgeBase(query) {
    const results = [];
    const searchTerm = query.toLowerCase();

    // Buscar en grupos de estudio
    this.knowledgeBase.studyGroups.forEach(group => {
      if (group.name.toLowerCase().includes(searchTerm) || 
          group.subject.toLowerCase().includes(searchTerm) ||
          group.topics.some(topic => topic.toLowerCase().includes(searchTerm))) {
        results.push({
          type: 'studyGroup',
          data: group
        });
      }
    });

    // Buscar en eventos
    this.knowledgeBase.events.forEach(event => {
      if (event.name.toLowerCase().includes(searchTerm) ||
          event.type.toLowerCase().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm)) {
        results.push({
          type: 'event',
          data: event
        });
      }
    });

    // Buscar en recursos
    [...this.knowledgeBase.resources.academic, ...this.knowledgeBase.resources.career].forEach(resource => {
      if (resource.name.toLowerCase().includes(searchTerm) ||
          resource.description.toLowerCase().includes(searchTerm)) {
        results.push({
          type: 'resource',
          data: resource
        });
      }
    });

    // Buscar en FAQ
    this.knowledgeBase.faq.forEach(qa => {
      if (qa.question.toLowerCase().includes(searchTerm) ||
          qa.answer.toLowerCase().includes(searchTerm)) {
        results.push({
          type: 'faq',
          data: qa
        });
      }
    });

    return results;
  }

  // Obtener información específica por tipo
  getStudyGroups() {
    return this.knowledgeBase.studyGroups;
  }

  getEvents() {
    return this.knowledgeBase.events;
  }

  getResources() {
    return this.knowledgeBase.resources;
  }

  getContactInfo() {
    return this.knowledgeBase.contact;
  }

  getFAQ() {
    return this.knowledgeBase.faq;
  }

  getLeadership() {
    return this.knowledgeBase.leadership;
  }

  // Obtener eventos próximos
  getUpcomingEvents() {
    const today = new Date();
    return this.knowledgeBase.events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  // Obtener grupos por nivel
  getStudyGroupsByLevel(level) {
    return this.knowledgeBase.studyGroups.filter(group => 
      group.level.toLowerCase().includes(level.toLowerCase())
    );
  }

  // Procesar consulta específica sobre eventos
  async getEventInfo(eventType = 'all') {
    try {
      const message = `Dame información sobre los eventos de CODES++ para estudiantes de Sistemas. Tipo: ${eventType}`;
      return await this.sendMessage(message, { eventType });
    } catch (error) {
      console.error('Error obteniendo información de eventos:', error);
      return "Lo siento, no puedo acceder a la información de eventos en este momento.";
    }
  }

  // Procesar consulta sobre grupos de estudio
  async getStudyGroupsInfo() {
    try {
      const message = "¿Qué grupos de estudio tiene CODES++ para estudiantes de Sistemas?";
      return await this.sendMessage(message);
    } catch (error) {
      console.error('Error obteniendo información de grupos:', error);
      return "Lo siento, no puedo acceder a la información de grupos de estudio en este momento.";
    }
  }

  // Procesar consulta sobre recursos académicos
  async getAcademicResources() {
    try {
      const message = "¿Qué recursos académicos ofrece CODES++ para estudiantes de Sistemas?";
      return await this.sendMessage(message);
    } catch (error) {
      console.error('Error obteniendo recursos académicos:', error);
      return "Lo siento, no puedo acceder a la información de recursos académicos en este momento.";
    }
  }

  // Verificar si el servicio está disponible
  isAvailable() {
    return this.isInitialized; // Funciona tanto con API key como en modo demo
  }

  // Obtener estado del servicio
  getStatus() {
    return {
      initialized: this.isInitialized,
      hasApiKey: !!this.apiKey,
      available: this.isAvailable()
    };
  }

  // Respuesta demo cuando no hay API key
  getDemoResponse(message) {
    console.log('Generando respuesta demo para:', message);
    
    try {
      const lowerMessage = message.toLowerCase();
      
      // Información de la comisión directiva
      if (lowerMessage.includes('presidente') || lowerMessage.includes('president')) {
        return `El presidente de CODES++ es **Federico Sebastián Rizzo**.

¿Necesitas algún medio de contacto? 😊`;
      }
      
      // Información de contacto específico
      if (lowerMessage.includes('contacto') && (lowerMessage.includes('presidente') || lowerMessage.includes('federico'))) {
        return `**Contacto del Presidente:**
📧 **Email:** sistemas@codesunlu.tech
📱 **WhatsApp:** https://chat.whatsapp.com/C3i38DQvAT0JD0tBoC0YxV

¿Necesitas contactar con otro miembro de la comisión? 😊`;
      }
      
      // Información completa de la comisión
      if (lowerMessage.includes('comision') || lowerMessage.includes('comisión') || lowerMessage.includes('directiva')) {
        return `**Comisión Directiva de CODES++:**
• **Presidente:** Federico Sebastián Rizzo
• **Vicepresidente:** Juan Cruz Rodriguez  
• **Secretaria:** Romina Ortiz
• **Tesorero:** Bautista Pereyra Buch
• **Vocales:** Miembros adicionales

¿Necesitas contacto de algún miembro específico? 😊`;
      }
      
      // Información básica sobre CODES++
      if (lowerMessage.includes('que es') || lowerMessage.includes('qué es')) {
        return `**CODES++** es el Centro Organizado de Estudiantes de Sistemas de la Universidad Nacional de Luján.

Representamos la carrera de **Licenciatura en Sistemas de Información** en las 3 sedes: Luján, Chivilcoy y San Miguel.

¿Te interesa saber cómo unirte? 😊`;
      }
      
      // Información completa sobre CODES++
      if (lowerMessage.includes('codes') && (lowerMessage.includes('informacion') || lowerMessage.includes('información') || lowerMessage.includes('completo'))) {
        return `🏛️ **CODES++ - Centro Organizado de Estudiantes de Sistemas**

**Información General:**
• **Universidad:** Universidad Nacional de Luján
• **Carrera:** Licenciatura en Sistemas de Información
• **Sedes:** Luján, Chivilcoy y San Miguel
• **Fundado:** 14 de octubre de 2022

**Misión:** Representar y ayudar a los estudiantes y graduados de nuestra carrera, así como también impulsar mejoras.

**¿Cómo unirse?**
📧 Email: sistemas@codesunlu.tech
📱 WhatsApp: https://chat.whatsapp.com/C3i38DQvAT0JD0tBoC0YxV

¿Te interesa unirte? 😊`;
      }
      
      // Respuestas basadas en palabras clave
      if (lowerMessage.includes('actividades') || lowerMessage.includes('eventos')) {
        return `🎯 **Actividades y Eventos de CODES++:**

**Eventos Realizados:**
• **Hackathon CODES++** - Recientemente realizado (Virtual)

**Eventos en Desarrollo:**
• **Hackathon a Mayor Escala** - En evaluación
• **Equipo de E-Sports** - En desarrollo
• **Charlas y Conferencias** - Planificadas
• **Proyecto de Streaming** - En desarrollo temprano

**Características:**
• Todos los eventos son **gratuitos**
• Se realizan **virtualmente** para mayor convocatoria
• Se publican formularios de inscripción cuando están disponibles

¿Te interesa participar en algún evento? 😊`;
      }
      
      // Tutorías - respuesta básica
      if (lowerMessage.includes('tutoria') || lowerMessage.includes('tutoría')) {
        return `Sí, ofrecemos **tutorías académicas** para cualquier materia de la carrera.

Se realizan **virtualmente en Discord** y se coordinan según la demanda.

¿Necesitas ayuda con alguna materia específica? 🤔`;
      }
      
      // Tutorías - información completa
      if (lowerMessage.includes('grupo') || lowerMessage.includes('estudio') || lowerMessage.includes('como funciona') || lowerMessage.includes('cómo funciona')) {
        return `📚 **Tutorías Académicas de CODES++:**

**¿Qué ofrecemos?**
• **Tutorías personalizadas** para cualquier materia de la carrera
• **Apoyo académico general** en Sistemas
• **Resolución de dudas específicas**

**¿Cómo funciona?**
• Se coordinan según la demanda mediante cuestionarios
• Se realizan **virtualmente en Discord**
• Coordinadas por el **Presidente y Vicepresidente**
• Disponibles para **todos los años** (principalmente años iniciales)

**¿Cómo acceder?**
📧 Email: sistemas@codesunlu.tech
💬 Discord: Servidor de CODES++
📱 WhatsApp: https://chat.whatsapp.com/C3i38DQvAT0JD0tBoC0YxV

¿Necesitas ayuda con alguna materia específica? 🤔`;
      }
      
      // Recursos - respuesta básica
      if (lowerMessage.includes('github') || lowerMessage.includes('repositorio')) {
        return `Tenemos un **repositorio en GitHub** organizado por materias con teoría, práctica, exámenes, cursos y libros.

Es **gratuito** para todos los estudiantes.

¿Necesitas acceso o más información? 😊`;
      }
      
      // Recursos - información completa
      if (lowerMessage.includes('recursos') || lowerMessage.includes('biblioteca')) {
        return `📚 **Recursos Académicos de CODES++:**

**🛠️ Repositorio GitHub:**
• **Organizado por materias** con teoría, práctica, exámenes
• **Cursos y libros** digitales
• **Recursos de estudio** completos
• **Acceso gratuito** para todos los estudiantes

**📖 Tutorías Académicas:**
• **Apoyo personalizado** para cualquier materia
• **Disponibles siempre** que sea necesario
• **Coordinadas por Discord**

**💼 Bolsa de Trabajo:**
• **En desarrollo** para conectar estudiantes con empresas
• **Oportunidades laborales** y pasantías
• **Networking** con el sector

**📧 Contacto:** sistemas@codesunlu.tech
**💬 Discord:** Servidor de CODES++
**📱 WhatsApp:** https://chat.whatsapp.com/C3i38DQvAT0JD0tBoC0YxV

¿Necesitas acceso al repositorio o información específica? 😊`;
      }
      
      if (lowerMessage.includes('contacto') || lowerMessage.includes('unirse') || lowerMessage.includes('como contactar') || lowerMessage.includes('cómo contactar')) {
        return `🤝 **¡Únete a CODES++!**

**📧 Contacto Principal:**
• **Email:** sistemas@codesunlu.tech
• **WhatsApp:** https://chat.whatsapp.com/C3i38DQvAT0JD0tBoC0YxV

**📱 Redes Sociales:**
• **Instagram:** Nuestra red principal
• **Facebook:** Disponible
• **Discord:** Servidor de CODES++

**ℹ️ Información Importante:**
• **Sin ubicación física** - Siempre disponibles virtualmente
• **Horario:** Estamos siempre que lo necesiten
• **Membresía gratuita** para todos los estudiantes de Sistemas
• **Representamos** las 3 sedes: Luján, Chivilcoy y San Miguel

¿Te interesa unirte? ¡Contáctanos! 🎉`;
      }
      
      // Respuesta por defecto
      return `¡Hola! 👋 Soy el asistente de CODES++ (Centro Organizado de Estudiantes de Sistemas).

Puedo ayudarte con información sobre:
• 🎯 Actividades y eventos
• 📚 Grupos de estudio  
• 🛠️ Recursos académicos
• 💼 Oportunidades laborales
• 📞 Información de contacto

¿En qué puedo ayudarte hoy? 😊

*Nota: Estoy funcionando en modo demo. Para respuestas más avanzadas, contacta directamente con CODES++.*`;
    } catch (error) {
      console.error('Error en getDemoResponse:', error);
      return `¡Hola! 👋 Soy el asistente de CODES++. ¿En qué puedo ayudarte hoy? 😊`;
    }
  }
}

// Instancia singleton del servicio
const geminiService = new GeminiService();

export default geminiService;
