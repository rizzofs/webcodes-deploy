// Discord API Service
// Nota: Para usar esto necesitarás crear un bot de Discord y obtener un token

const DISCORD_BOT_TOKEN = import.meta.env.VITE_DISCORD_BOT_TOKEN || 'demo-token';
const SERVER_ID = import.meta.env.VITE_DISCORD_SERVER_ID || 'demo-server-id';

class DiscordAPI {
  constructor() {
    this.baseURL = 'https://discord.com/api/v10';
    this.headers = {
      'Authorization': `Bot ${DISCORD_BOT_TOKEN}`,
      'Content-Type': 'application/json'
    };
  }

  // Obtener información del servidor
  async getServerInfo() {
    try {
      // Si es modo demo, retornar datos simulados
      if (DISCORD_BOT_TOKEN === 'demo-token') {
        return {
          name: 'CODES++ Discord',
          member_count: 150,
          icon: null
        };
      }

      const response = await fetch(`${this.baseURL}/guilds/${SERVER_ID}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Discord API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching server info:', error);
      return null;
    }
  }

  // Obtener canales del servidor
  async getChannels() {
    try {
      // Si es modo demo, retornar canales simulados
      if (DISCORD_BOT_TOKEN === 'demo-token') {
        return [
          { id: '1', name: '#introduccion-programacion', topic: 'Canal de Introducción a la Programación', position: 0, type: 0 },
          { id: '2', name: '#matematica-discreta', topic: 'Canal de Matemática Discreta', position: 1, type: 0 },
          { id: '3', name: '#fisica-i', topic: 'Canal de Física I', position: 2, type: 0 },
          { id: '4', name: '#quimica-general', topic: 'Canal de Química General', position: 3, type: 0 },
          { id: '5', name: '#algoritmos', topic: 'Canal de Algoritmos y Estructuras de Datos', position: 4, type: 0 },
          { id: '6', name: '#base-datos', topic: 'Canal de Base de Datos', position: 5, type: 0 },
          { id: '7', name: '#sistemas-operativos', topic: 'Canal de Sistemas Operativos', position: 6, type: 0 },
          { id: '8', name: '#redes', topic: 'Canal de Redes de Computadoras', position: 7, type: 0 }
        ];
      }

      const response = await fetch(`${this.baseURL}/guilds/${SERVER_ID}/channels`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Discord API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching channels:', error);
      return [];
    }
  }

  // Obtener miembros del servidor
  async getMembers() {
    try {
      // Si es modo demo, retornar datos simulados
      if (DISCORD_BOT_TOKEN === 'demo-token') {
        return Array(150).fill({ id: 'demo-member' });
      }

      const response = await fetch(`${this.baseURL}/guilds/${SERVER_ID}/members?limit=1000`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Discord API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching members:', error);
      return [];
    }
  }

  // Obtener información de un canal específico
  async getChannelInfo(channelId) {
    try {
      const response = await fetch(`${this.baseURL}/channels/${channelId}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Discord API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching channel info:', error);
      return null;
    }
  }

  // Obtener mensajes recientes de un canal
  async getRecentMessages(channelId, limit = 10) {
    try {
      const response = await fetch(`${this.baseURL}/channels/${channelId}/messages?limit=${limit}`, {
        headers: this.headers
      });
      
      if (!response.ok) {
        throw new Error(`Discord API error: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching messages:', error);
      return [];
    }
  }

  // Obtener estadísticas del servidor
  async getServerStats() {
    try {
      const [serverInfo, channels, members] = await Promise.all([
        this.getServerInfo(),
        this.getChannels(),
        this.getMembers()
      ]);

      if (!serverInfo) return null;

      // Filtrar canales de texto
      const textChannels = channels.filter(channel => 
        channel.type === 0 && channel.name.startsWith('#')
      );

      // Filtrar canales de voz
      const voiceChannels = channels.filter(channel => 
        channel.type === 2
      );

      return {
        totalMembers: serverInfo.member_count || members.length,
        totalChannels: channels.length,
        textChannels: textChannels.length,
        voiceChannels: voiceChannels.length,
        serverName: serverInfo.name,
        serverIcon: serverInfo.icon,
        channels: textChannels.map(channel => ({
          id: channel.id,
          name: channel.name,
          topic: channel.topic,
          position: channel.position,
          type: 'text'
        }))
      };
    } catch (error) {
      console.error('Error fetching server stats:', error);
      return null;
    }
  }

  // Verificar si un canal está activo (tiene mensajes recientes)
  async isChannelActive(channelId, hoursThreshold = 24) {
    try {
      const messages = await this.getRecentMessages(channelId, 1);
      
      if (messages.length === 0) return false;
      
      const lastMessage = messages[0];
      const messageTime = new Date(lastMessage.timestamp);
      const now = new Date();
      const hoursDiff = (now - messageTime) / (1000 * 60 * 60);
      
      return hoursDiff <= hoursThreshold;
    } catch (error) {
      console.error('Error checking channel activity:', error);
      return false;
    }
  }
}

export default new DiscordAPI();