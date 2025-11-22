import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
  },
   build: {
    outDir: 'dist',
    sourcemap: false,
    // Remove minify option or use 'esbuild' (default)
  },
  // Remove proxy for production - it only works in dev
  // Add base path for proper asset resolution
  base: '/',
})