import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import purgecss from 'vite-plugin-purgecss'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    purgecss({
      content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
      safelist: {
        standard: [/^sc-/, /^ca-/, /^ta-/, /^ap-/, /^db-/, /^cb-/, /^cc-/, /swiper/, /framer/],
        deep: [/data-theme/],
      },
    }),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          recharts: ['recharts'],
          firebase: ['firebase/app', 'firebase/auth', 'firebase/firestore'],
        }
      }
    }
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
  server: {
    port: 3000, // zorla 3000'de çalıştır
    proxy: {
      '/api': {
        target: 'https://3.128.244.219', // canlı backend
        //target: 'http://localhost:8080', // yerel backend
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
