import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@micro-cms/types': resolve(__dirname, '../../packages/types/src'),
      '@micro-cms/admin-ui': resolve(__dirname, '../../packages/admin-ui/src'),
      '@micro-cms/mock-db': resolve(__dirname, '../../packages/mock-db/src'),
      '@micro-cms/core': resolve(__dirname, '../../packages/core/src'),
    }
  },
  server: {
    port: 3000
  }
})