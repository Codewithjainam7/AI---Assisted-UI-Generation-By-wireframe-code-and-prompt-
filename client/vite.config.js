import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,
    fs: {
      strict: false
    },
    watch: {
      ignored: ['**/src/sections/generated/**']
    }
  },
  define: { 'process.env': {} }
});
