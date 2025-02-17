import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Point to the build version which provides a default export.
      'jwt-decode': path.resolve(__dirname, 'node_modules/jwt-decode/build/esm/index.js'),
    },
  },
})
