import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  oxc: false,
  esbuild: {
    drop: ['console', 'debugger'],
    legalComments: 'none',
  } as unknown as Record<string, unknown>,
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom/')
          ) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/react-router/')) {
            return 'vendor-router'
          }
          if (id.includes('node_modules/motion/')) {
            return 'vendor-motion'
          }
          if (id.includes('node_modules/animejs/')) {
            return 'vendor-anime'
          }
        },
      },
    },
  },
  server: {
    host:true
  }
})
