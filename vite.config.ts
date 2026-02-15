import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * Plugin de Vite que simula las Vercel Serverless Functions (/api/*)
 * durante el desarrollo local. En producción (Vercel), la carpeta api/
 * se maneja automáticamente.
 */
function vercelApiDevPlugin() {
  let envVars: Record<string, string> = {}

  return {
    name: 'vercel-api-dev',
    configResolved(config: any) {
      // Cargar variables de entorno que NO empiezan con VITE_ (server-side)
      envVars = loadEnv(config.mode, config.root, '')
    },
    configureServer(server: any) {
      server.middlewares.use('/api', async (req: any, res: any, next: any) => {
        // Extraer nombre del endpoint: /api/send-collaborator-email -> send-collaborator-email
        const endpoint = req.url?.replace(/^\//, '').split('?')[0]
        if (!endpoint) return next()

        try {
          // Importar dinámicamente el handler de la serverless function
          const modulePath = `${process.cwd()}/api/${endpoint}.js`
          // Limpiar cache para hot reload
          delete require.cache?.[modulePath]
          
          const mod = await import(/* @vite-ignore */ `file://${modulePath.replace(/\\/g, '/')}`)
          const handler = mod.default

          if (typeof handler !== 'function') {
            return next()
          }

          // Parsear body JSON si corresponde
          let body = {}
          if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            body = await new Promise((resolve) => {
              let data = ''
              req.on('data', (chunk: string) => { data += chunk })
              req.on('end', () => {
                try { resolve(JSON.parse(data)) } catch { resolve({}) }
              })
            })
          }

          // Simular req/res de Vercel
          const vercelReq = {
            method: req.method,
            headers: req.headers,
            query: Object.fromEntries(new URL(req.url || '', 'http://localhost').searchParams),
            body,
          }

          // Inyectar env vars en process.env temporalmente
          const originalEnv = { ...process.env }
          Object.assign(process.env, envVars)

          const vercelRes = {
            statusCode: 200,
            _headers: {} as Record<string, string>,
            status(code: number) { this.statusCode = code; return this },
            setHeader(key: string, value: string) { this._headers[key] = value; return this },
            json(data: any) {
              res.writeHead(this.statusCode, { 
                'Content-Type': 'application/json',
                ...this._headers 
              })
              res.end(JSON.stringify(data))
            },
            send(data: string) {
              res.writeHead(this.statusCode, this._headers)
              res.end(data)
            }
          }

          await handler(vercelReq, vercelRes)

          // Restaurar env
          process.env = originalEnv
        } catch (err: any) {
          console.error(`[vercel-api-dev] Error en /api/${endpoint}:`, err.message)
          res.writeHead(500, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'Error interno del servidor de desarrollo' }))
        }
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    vercelApiDevPlugin(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'CODES++ - Centro de Estudiantes de Sistemas',
        short_name: 'CODES++',
        description: 'Centro Organizado de Estudiantes de Sistemas (CODES++) de la Universidad Nacional de Luján',
        theme_color: '#39c0c3',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/',
        start_url: '/',
        orientation: 'portrait-primary',
        icons: [
          {
            src: '/assets/images/Logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any'
          },
          {
            src: '/assets/images/Logo.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true
      }
    })
  ],
  server: {
    host: '0.0.0.0', // Escucha en todas las interfaces de red
    port: 5173,
    strictPort: true, // Falla si el puerto está ocupado
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom']
        }
      }
    }
  },
  define: {
    'process.env': {}
  }
})
