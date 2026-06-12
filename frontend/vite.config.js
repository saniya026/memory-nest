import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://memory-nest-backend.onrender.com', // ✅ Tera actual backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});