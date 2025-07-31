import { defineConfig } from 'vitest/config'
import { getDirname } from '@adonisjs/core/helpers'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./inertia/tests/setup.ts'],
  },
  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
    },
  },
})
