import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Served as a GitHub Pages project site at
  // https://gastromate.github.io/thomas-und-foerster-/ — must match the
  // repo name exactly, trailing hyphen included, or every asset 404s.
  base: '/thomas-und-foerster-/',
})
