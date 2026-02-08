const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL || 'https://script.google.com/macros/s/AKfycbyFh4YHcVyz0lSvAVJyPKqlitaeyf8Cm6M-D8MIzCSRxsozyK-UCMzUNpBM0OnjEq-m/exec';
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
console.log('GOOGLE_SHEETS_URL:', GOOGLE_SHEETS_URL);

export const googleSheetsService = {
  async reservarNumero(datosReserva) {
    try {
      console.log('Reservando número:', datosReserva);
      console.log('Google Sheets URL:', GOOGLE_SHEETS_URL);
      
      // Construir la URL con parámetros simples
      const params = new URLSearchParams({
        action: 'reservarNumero',
        numero: datosReserva.numero,
        nombre: datosReserva.nombre,
        email: datosReserva.email,
        telefono: datosReserva.telefono || '',
        monto: datosReserva.monto,
        estado: datosReserva.estado
      });
      
      const url = `${GOOGLE_SHEETS_URL}?${params.toString()}`;
      console.log('Request URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      console.log('Response text:', text);
      
      let data;
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        throw new Error('Invalid JSON response');
      }
      
      console.log('Parsed data:', data);
      
      if (data.success) {
        console.log('Número reservado exitosamente:', data);
        return { success: true, data: data };
      } else {
        console.error('Error al reservar número:', data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error con fetch, intentando con proxy:', error);
      
      // Fallback: Usar proxy CORS
      try {
        return await this.reservarNumeroProxy(datosReserva);
      } catch (proxyError) {
        console.error('Error con proxy, usando reserva mock:', proxyError);
        return this.reservarNumeroMock(datosReserva);
      }
    }
  },

  // Método usando proxy CORS
  async reservarNumeroProxy(datosReserva) {
    const params = new URLSearchParams({
      action: 'reservarNumero',
      numero: datosReserva.numero,
      nombre: datosReserva.nombre,
      email: datosReserva.email,
      telefono: datosReserva.telefono || '',
      monto: datosReserva.monto,
      estado: datosReserva.estado
    });
    
    const url = `${GOOGLE_SHEETS_URL}?${params.toString()}`;
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
    
    console.log('Usando proxy CORS para reservar:', proxyUrl);
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Proxy error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.success) {
      return { success: true, data: data };
    } else {
      return { success: false, error: data.error };
    }
  },

  // Método de fallback con datos simulados
  reservarNumeroMock(datosReserva) {
    console.log('Usando reserva mock para:', datosReserva);
    
    return {
      success: true,
      data: {
        message: 'Número reservado exitosamente (Modo demo)',
        numero: datosReserva.numero,
        mock: true
      }
    };
  },

  async getNumeros() {
    try {
      const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getNumeros`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener números:', error);
      throw error;
    }
  },

  async verificarDisponibilidad(numero) {
    try {
      // Intentar con fetch primero
      const url = `${GOOGLE_SHEETS_URL}?action=verificarDisponibilidad&numero=${numero}&t=${Date.now()}`;
      console.log('Consultando URL:', url);
      
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      console.log('Response text:', text);
      
      const data = JSON.parse(text);
      
      // Verificar si la respuesta tiene error
      if (data.error) {
        throw new Error(data.error);
      }
      
      // Verificar si la respuesta tiene success: false
      if (data.success === false) {
        throw new Error(data.error || 'Error en la respuesta del servidor');
      }
      
      return data;
    } catch (error) {
      console.error('Error con fetch, intentando JSONP:', error);
      
      // Fallback: Usar JSONP
      try {
        return await this.verificarDisponibilidadJSONP(numero);
      } catch (jsonpError) {
        console.error('Error con JSONP, intentando proxy CORS:', jsonpError);
        // Último intento: usar proxy CORS
        try {
          return await this.verificarDisponibilidadProxy(numero);
        } catch (proxyError) {
          console.error('Error con proxy CORS, usando datos mock:', proxyError);
          return this.verificarDisponibilidadMock(numero);
        }
      }
    }
  },

  // Método JSONP para evitar CORS
  verificarDisponibilidadJSONP(numero) {
    return new Promise((resolve, reject) => {
      const callbackName = `callback_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      const url = `${GOOGLE_SHEETS_URL}?action=verificarDisponibilidad&numero=${numero}&callback=${callbackName}&t=${Date.now()}`;
      
      // Crear función callback global
      window[callbackName] = (data) => {
        delete window[callbackName];
        document.head.removeChild(script);
        resolve(data);
      };
      
      // Crear script tag
      const script = document.createElement('script');
      script.src = url;
      script.onerror = () => {
        delete window[callbackName];
        document.head.removeChild(script);
        reject(new Error('JSONP request failed'));
      };
      
      document.head.appendChild(script);
      
      // Timeout después de 10 segundos
      setTimeout(() => {
        if (window[callbackName]) {
          delete window[callbackName];
          document.head.removeChild(script);
          reject(new Error('JSONP timeout'));
        }
      }, 10000);
    });
  },

  // Método usando proxy CORS
  async verificarDisponibilidadProxy(numero) {
    const url = `${GOOGLE_SHEETS_URL}?action=verificarDisponibilidad&numero=${numero}&t=${Date.now()}`;
    const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
    
    console.log('Usando proxy CORS:', proxyUrl);
    
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Proxy error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  },

  // Método de fallback con datos simulados
  verificarDisponibilidadMock(numero) {
    // Simular algunos números vendidos para testing
    const numerosVendidos = ['0001', '0002', '0003', '0100', '1234', '5678', '9999'];
    const numeroStr = numero.toString().padStart(4, '0');
    
    const disponible = !numerosVendidos.includes(numeroStr);
    
    return {
      disponible,
      vendido: !disponible,
      numero: numeroStr,
      mensaje: disponible ? 'Número disponible' : 'Número ya vendido',
      mock: true // Indicar que es datos simulados
    };
  },

  async getEstadisticas() {
    try {
      const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getEstadisticas`, {
        method: 'GET',
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener estadísticas, intentando con proxy:', error);
      try {
        const url = `${GOOGLE_SHEETS_URL}?action=getEstadisticas`;
        const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        return data;
      } catch (proxyError) {
        console.error('Error con proxy, usando estadísticas mock:', proxyError);
        return this.getEstadisticasMock();
      }
    }
  },

  getEstadisticasMock() {
    return {
      numerosVendidos: 7,
      recaudado: 35000,
      numerosRestantes: 9993,
      primerPremio: 4000000,
      segundoPremio: 2000000,
      tercerPremio: 1500000,
      mock: true
    };
  },

  async getNumerosVendidos() {
    try {
      const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getNumerosVendidos`, {
        method: 'GET',
        mode: 'cors'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error al obtener números vendidos, intentando con proxy:', error);
      try {
        const url = `${GOOGLE_SHEETS_URL}?action=getNumerosVendidos`;
        const proxyUrl = `${CORS_PROXY}${encodeURIComponent(url)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        return data;
      } catch (proxyError) {
        console.error('Error con proxy, usando números vendidos mock:', proxyError);
        return this.getNumerosVendidosMock();
      }
    }
  },

  getNumerosVendidosMock() {
    return [
      { numero: '0001', vendido: new Date(Date.now() - 86400000) },
      { numero: '0002', vendido: new Date(Date.now() - 172800000) },
      { numero: '0003', vendido: new Date(Date.now() - 259200000) },
      { numero: '0100', vendido: new Date(Date.now() - 345600000) },
      { numero: '1234', vendido: new Date(Date.now() - 432000000) },
      { numero: '5678', vendido: new Date(Date.now() - 518400000) },
      { numero: '9999', vendido: new Date(Date.now() - 604800000) }
    ];
  },

  async confirmarPago(numero) {
    try {
      console.log('Confirmando pago para número:', numero);
      
      const response = await fetch(`${GOOGLE_SHEETS_URL}?action=confirmarPago&numero=${numero}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      console.log('Response text:', text);
      
      const data = JSON.parse(text);
      
      if (data.success) {
        console.log('Pago confirmado exitosamente:', data);
        return { success: true, data: data };
      } else {
        console.error('Error al confirmar pago:', data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error al confirmar pago:', error);
      return { success: false, error: 'Error de conexión' };
    }
  },

  async actualizarEstadisticas() {
    try {
      console.log('Actualizando estadísticas...');
      
      const response = await fetch(`${GOOGLE_SHEETS_URL}?action=actualizarEstadisticas`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      console.log('Response text:', text);
      
      const data = JSON.parse(text);
      
      if (data.success) {
        console.log('Estadísticas actualizadas exitosamente:', data);
        return { success: true, data: data };
      } else {
        console.error('Error al actualizar estadísticas:', data.error);
        return { success: false, error: data.error };
      }
    } catch (error) {
      console.error('Error al actualizar estadísticas:', error);
      return { success: false, error: 'Error de conexión' };
    }
  }
};
