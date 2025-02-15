import { defineConfig } from "vite";
import viteReact from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [
    TanStackRouterVite({ autoCodeSplitting: true }),
    viteReact(),
  ],
  server: {
    port: 3000,
    host: true,
    watch: {
      usePolling: true,
    },
  },
});