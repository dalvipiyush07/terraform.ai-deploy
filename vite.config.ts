import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      preview: {
        port: 3000,
        host: true,
        strictPort: true,
      },
      plugins: [react()],
      define: {
        'import.meta.env.VITE_GROQ_API_KEY': JSON.stringify(env.VITE_GROQ_API_KEY),
        'import.meta.env.VITE_GROQ_API_URL': JSON.stringify(env.VITE_GROQ_API_URL),
        'import.meta.env.VITE_GROQ_MODEL': JSON.stringify(env.VITE_GROQ_MODEL)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
