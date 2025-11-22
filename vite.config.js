import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://raynott-fintech.onrender.com',
        changeOrigin: true,
        secure: false // Add this for HTTPS targets
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Add these for better build optimization
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
  // Add this for Vercel deployment
  base: './',
  preview: {
    port: 5173
  }
})