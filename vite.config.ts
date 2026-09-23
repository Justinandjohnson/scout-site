import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://<user>.github.io/scout-site/ on GitHub Pages.
  base: '/scout-site/',
  plugins: [react()],
})
