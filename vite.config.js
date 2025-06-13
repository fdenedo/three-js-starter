import { defineConfig } from 'vite'
import path from 'path'

export default defineConfig({
  root: './',
  publicDir: './public',
  base: './',
  optimizeDeps: {
    include: [
      'three',
      'three/addons/controls/OrbitControls.js',
      'three/examples/jsm/libs/stats.module.js'
    ],
  },
  resolve: {
    alias: {
      '@core': path.resolve(__dirname, './src/core')
    },
  },
})