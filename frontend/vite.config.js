import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Force Vite to use port 5173
    strictPort: true, // Prevent auto-switching to another port
  },
})
