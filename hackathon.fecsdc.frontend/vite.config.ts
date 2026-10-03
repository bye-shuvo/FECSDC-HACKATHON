import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    build: {
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (
              id.includes('node_modules/react/') ||
              id.includes('node_modules/react-dom/') ||
              id.includes('node_modules/react-router/')
            ) {
              return 'vendor-react'
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
      proxy: {
        // Proxy all requests starting with /api to your backend server
        '/api': {
          target: env.VITE_BACKEND_ENDPOINT, // Your backend server URL
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ''), // Remove /api prefix from the request
        },
      },
    },
  }
})
