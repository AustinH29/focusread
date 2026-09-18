import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/fetch-url': 'http://127.0.0.1:3001',
      '/health': 'http://127.0.0.1:3001',
      '/parse-file': 'http://127.0.0.1:3001',
    },
  },
});
