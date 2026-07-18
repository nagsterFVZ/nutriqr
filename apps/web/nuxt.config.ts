import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  alias: {
    // Alias straight to packages/ts source (no dist/ build required) so the
    // demo/docs always reflect the live codec during local development.
    nutriqr: fileURLToPath(
      new URL('../../packages/ts/src/index.ts', import.meta.url)
    )
  },
  vite: {
    plugins: [tailwindcss()]
  }
})
