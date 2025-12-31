import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        // File watcher limit is set to 524288 (good)
        // Using optimized polling for large codebase reliability
        watch: {
          usePolling: true,
          interval: 2000, // Increased interval for better performance
          ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/.progress-tracker'],
        },
        // CRITICAL: Block auth redirects in Vite dev server
        // Use middleware to intercept BEFORE proxy
        middlewareMode: false,
        proxy: {
          '/api/auth': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            bypass: (req, res, options) => {
              // Block ALL auth requests - return 404 immediately
              console.log('🚫 Vite: Blocked auth request:', req.url);
              res.statusCode = 404;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ 
                error: 'Auth endpoint not found',
                message: 'This app does not use authentication. If you see this, a browser extension may be redirecting you.',
                redirect: false
              }));
              return false; // Don't proxy
            }
          }
        },
        // Security headers - Allow external resources for fonts, CDNs, etc.
        headers: {
          'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com https://esm.sh https://fonts.googleapis.com https://fonts.gstatic.com", // Required for Vite HMR in dev
            "script-src-elem 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://cdn.jsdelivr.net",
            "style-src-elem 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.gstatic.com https://cdn.jsdelivr.net",
            "img-src 'self' data: https: blob: https://api.dicebear.com",
            "font-src 'self' data: https://fonts.gstatic.com",
            "connect-src 'self' https: ws: wss: http://localhost:*",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "worker-src 'self' blob:",
          ].join('; '),
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'geolocation=(), microphone=(), camera=()',
        },
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
