const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL || 'https://script.google.com/macros/s/AKfycbxpV04uR6UJCSTrDMxsTM52HmU5HxDcm52ww51nTkCZVbe1Oy11XQWWAkDY77yWPi9s/exec';
const publicKey = import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY || 'APP_USR-2fef1a71-008c-43e0-a564-3b3c7625116c';

// Debugging de variables de entorno
console.log('🔍 Debugging variables de entorno:');
console.log('VITE_MERCADOPAGO_PUBLIC_KEY:', import.meta.env.VITE_MERCADOPAGO_PUBLIC_KEY);
console.log('VITE_GOOGLE_SHEETS_URL:', import.meta.env.VITE_GOOGLE_SHEETS_URL);
console.log('publicKey variable:', publicKey);

// Verificar que la PUBLIC_KEY esté configurada
if (!publicKey) {
  console.error('❌ VITE_MERCADOPAGO_PUBLIC_KEY no está configurada en el archivo .env');
  console.error('📝 Agrega VITE_MERCADOPAGO_PUBLIC_KEY=TU_PUBLIC_KEY_AQUI a tu archivo .env');
  console.error('🔧 Asegúrate de que el archivo .env esté en la raíz del proyecto (codes-react/.env)');
  console.error('🔄 Reinicia el servidor de desarrollo después de cambiar el .env');
}

export const mercadoPagoService = {
  async crearPreferencia(datosCompra) {
    try {
      console.log('Creando preferencia a través de Google Apps Script...');
      
      // Llamar a Google Apps Script para crear la preferencia
      const url = `${GOOGLE_SHEETS_URL}?action=crearPreferencia&datos=${encodeURIComponent(JSON.stringify(datosCompra))}`;
      
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Error al crear preferencia');
      }

      return result.preference;
    } catch (error) {
      console.error('Error al crear preferencia:', error);
      throw error;
    }
  },

  async inicializarBricks(containerId, preferenceId) {
    try {
      // Verificar que publicKey esté disponible
      if (!publicKey) {
        throw new Error('VITE_MERCADOPAGO_PUBLIC_KEY no está configurada. Revisa tu archivo .env');
      }
      
      console.log('🔑 Inicializando Mercado Pago con publicKey:', publicKey);
      
      // Cargar el SDK de Mercado Pago dinámicamente
      const script = document.createElement('script');
      script.src = 'https://sdk.mercadopago.com/js/v2';
      script.async = true;
      
      return new Promise((resolve, reject) => {
        script.onload = () => {
          try {
            console.log('📦 SDK de Mercado Pago cargado, inicializando...');
            // Inicializar Mercado Pago
            const mp = new window.MercadoPago(publicKey, {
              locale: 'es-AR'
            });

            // Crear el wallet brick
            const wallet = mp.bricks().create('wallet', containerId, {
              initialization: {
                preferenceId: preferenceId
              },
              callbacks: {
                onReady: () => {
                  console.log('Wallet ready');
                  resolve();
                },
                onSubmit: (formData) => {
                  console.log('Form data:', formData);
                  return new Promise((resolve) => {
                    resolve();
                  });
                },
                onError: (error) => {
                  console.error('Wallet error:', error);
                  reject(error);
                }
              }
            });
          } catch (error) {
            console.error('Error al inicializar Mercado Pago:', error);
            reject(error);
          }
        };
        
        script.onerror = () => {
          reject(new Error('Error al cargar el SDK de Mercado Pago'));
        };
        
        document.head.appendChild(script);
      });
    } catch (error) {
      console.error('Error al inicializar Bricks:', error);
      throw error;
    }
  }
};
