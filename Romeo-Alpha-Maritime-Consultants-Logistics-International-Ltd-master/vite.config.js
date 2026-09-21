import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    // Generate source maps for better debugging (flagged as missing by PageSpeed)
    sourcemap: true,
    // Increase warning threshold to reduce noise
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        // Split vendor libs into separate cacheable chunks
        // Reduces unused JS per page — each chunk only loads when needed
        manualChunks: {
          // Core React runtime — cached long-term, almost never changes
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          // Supabase SDK — large, separate chunk so it's cached independently
          'vendor-supabase': ['@supabase/supabase-js'],
          // EmailJS — only used on Contact/MarketplaceDetail pages
          'vendor-emailjs': ['@emailjs/browser'],
        },
      },
    },
  },
})
