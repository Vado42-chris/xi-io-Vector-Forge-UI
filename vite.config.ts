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
      plugins: [react({
        jsxRuntime: 'automatic',
      })],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_XIBALBA_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'import.meta.env.VITE_XIBALBA_MCP_URL': JSON.stringify(env.VITE_XIBALBA_MCP_URL || 'http://localhost:8000'),
        'import.meta.env.VITE_XIBALBA_API_KEY': JSON.stringify(env.VITE_XIBALBA_API_KEY || ''),
        'import.meta.env.VITE_XIBALBA_MODEL': JSON.stringify(env.VITE_XIBALBA_MODEL || 'xibalba-local'),
        'import.meta.env.VITE_XIBALBA_ENDPOINT': JSON.stringify(env.VITE_XIBALBA_ENDPOINT || '/api/v1/chat/completions')
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
    };
});
