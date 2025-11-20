import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // zorla 3000'de çalıştır
    proxy: {
      '/api': {
        target: 'https://3.128.244.219', // canlı backend
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
