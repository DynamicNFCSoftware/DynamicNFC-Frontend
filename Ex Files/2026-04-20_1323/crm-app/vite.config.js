import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/enterprise/crmdemo/',
  server: {
    port: 3000
  }
})