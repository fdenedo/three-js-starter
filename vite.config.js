import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: './',
  publicDir: './public',
  base: '/three-js-starter/',
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './src/core')
    },
  },
})