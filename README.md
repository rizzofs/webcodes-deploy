# WebCodes2026 - CODES++ 🚀

**Centro Organizado de Estudiantes de Sistemas - Universidad Nacional de Luján**

Este repositorio contiene el código fuente de la plataforma web oficial de CODES++. Es una aplicación moderna construida con React y Vite, diseñada para centralizar la información, recursos y herramientas para los estudiantes de la Licenciatura en Sistemas de Información.

## ✨ Características Principales

La plataforma cuenta con diversos módulos y funcionalidades pensadas para el estudiante:

- **📅 Calendario Académico y de Eventos**: Integración con Google Calendar para mostrar fechas importantes, exámenes y eventos del centro.
- **📚 Grupos de Estudio**: Sección para encontrar y unirse a grupos de estudio por materias y niveles.
- **💰 Transparencia**: Módulo para visualizar los ingresos y egresos del centro de estudiantes, promoviendo la honestidad y claridad en la gestión.
- **📰 Noticias y Novedades**: Carrusel de noticias integrado con Supabase para mantener a los estudiantes informados.
- **🤖 Asistente IA (Gemini)**: Chatbot inteligente potenciado por Google Gemini para responder dudas sobre la carrera, materias y el centro.
- **💸 Donaciones y Pagos**: Integración con MercadoPago para colaboraciones y pagos de bonos/rifas.
- **📊 Encuestas**: Sistema para recabar opiniones de los estudiantes.
- **🎓 Expo UNLu & CACIC**: Secciones dedicadas a eventos específicos de la universidad y congresos.
- **👥 Gestión de Miembros**: Visualización de la comisión directiva y colaboradores.
- **🔐 Autenticación**: Sistema de login y dashboard para administradores (protegido).

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 19**: Biblioteca principal para la interfaz de usuario.
- **Vite**: Empaquetador y servidor de desarrollo ultra rápido.
- **Bootstrap 5 & React-Bootstrap**: Framework de estilos para diseño responsivo.
- **React Router DOM**: Manejo de rutas y navegación.
- **Swiper**: Componente para carruseles táctiles.

### Backend & Servicios (Integraciones)
- **Supabase**: Base de datos (PostgreSQL), Autenticación y Almacenamiento.
- **Google Sheets API**: Utilizado como CMS ligero para ciertas gestiones (reservas, estadísticas).
- **Google Calendar API**: Sincronización de eventos.
- **Discord API**: Integración para mostrar estado del servidor y canales de la comunidad.
- **Google Gemini AI**: Motor de inteligencia artificial para el asistente virtual.
- **MercadoPago SDK**: Procesamiento de pagos y donaciones.
- **Google Analytics**: Seguimiento de métricas de uso.

## 🚀 Instalación y Configuración

Sigue estos pasos para levantar el proyecto en tu entorno local:

### 1. Prerrequisitos
 Asegúrate de tener instalado:
 - [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
 - npm (viene con Node.js)

### 2. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/WebCodes2026.git
cd WebCodes2026
```

### 3. Instalar dependencias
El código del frontend se encuentra en la carpeta `codes-react`.
```bash
cd codes-react
npm install
```

### 4. Configurar Variables de Entorno
Crea un archivo `.env` en la carpeta `codes-react` (puedes basarte en `.env.example` si existe, o usar las siguientes claves).

**⚠️ Importante**: Nunca subas tus claves privadas al repositorio.

```env
# Supabase (Base de datos y Auth)
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Google Analytics
VITE_GA_MEASUREMENT_ID=tu_ga_measurement_id

# Integraciones
VITE_DISCORD_BOT_TOKEN=tu_discord_bot_token
VITE_DISCORD_SERVER_ID=tu_discord_server_id
VITE_GOOGLE_API_KEY=tu_google_api_key
VITE_GOOGLE_CLIENT_ID=tu_google_client_id
VITE_GEMINI_API_KEY=tu_gemini_api_key
VITE_GOOGLE_SHEETS_URL=url_de_tu_google_script
VITE_MERCADOPAGO_PUBLIC_KEY=tu_mercadopago_public_key
```

### 5. Ejecutar el servidor de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en `http://localhost:5173`.

## 📂 Estructura del Proyecto

```
WebCodes2026/codes-react/src/
├── components/      # Componentes reutilizables (Header, Footer, Cards, etc.)
├── pages/           # Páginas principales (Home, Groups, Admin, etc.)
├── services/        # Lógica de conexión con APIs externas
│   ├── discordAPI.js
│   ├── geminiService.js
│   ├── googleCalendar.js
│   ├── googleSheetsService.js
│   ├── mercadoPagoService.js
│   ├── newsService.js
│   └── ...
├── context/         # Contextos de React (AuthContext, etc.)
├── hooks/           # Custom Hooks
├── utils/           # Utilidades y funciones auxiliares
├── App.jsx          # Componente principal y configuración de rutas
└── main.tsx         # Punto de entrada de la aplicación
```

## 🤝 Contribuir
Si deseas contribuir al proyecto:
1. Haz un Fork del repositorio.
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`).
3. Haz tus cambios y commit (`git commit -m 'Add some AmazingFeature'`).
4. Push a la rama (`git push origin feature/AmazingFeature`).
5. Abre un Pull Request.

## 📄 Licencia
Este proyecto es propiedad de CODES++ - Centro de Estudiantes de Sistemas UNLu.