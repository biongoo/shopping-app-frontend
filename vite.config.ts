import react from '@vitejs/plugin-react';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  define: {
    VITE_APP_TITLE: JSON.stringify(process.env.VITE_APP_TITLE),
    VITE_BACKEND_URL: JSON.stringify(process.env.VITE_BACKEND_URL),
  },
  resolve: {
    alias: [
      {
        find: '~',
        replacement: path.resolve(
          path.dirname(fileURLToPath(import.meta.url)),
          'src'
        ),
      },
    ],
  },
});
