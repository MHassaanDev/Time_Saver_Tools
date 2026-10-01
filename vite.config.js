import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// No backend. Static build only — output in /dist is deployed as-is
// to Cloudflare Pages (or any static host). See README.md.
export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2019',
    sourcemap: false
  }
})
