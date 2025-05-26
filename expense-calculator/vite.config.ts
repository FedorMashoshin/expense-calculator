import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // Proxy configuration for development
    // When frontend makes requests to /api/*, they will be forwarded to the backend server
    proxy: {
      '/api': {
        // Backend server URL
        target: 'http://localhost:4000',
        // Ensures proper headers are set for the proxy request
        changeOrigin: true,
      }
    }
  }
})
