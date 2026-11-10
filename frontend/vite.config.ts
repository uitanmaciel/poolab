import { fileURLToPath, URL } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        // Requisições do proxy são same-origin para o navegador. Sem o Origin, o CORS do backend
        // (CORS_ORIGINS) não bloqueia a porta do Vite quando ela não está na lista (ex.: 5174, 127.0.0.1).
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => proxyReq.removeHeader('origin'))
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.{ts,tsx}'],
  },
})
