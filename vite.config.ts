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
      plugins: [react()],
      // SECURITY: Do NOT expose API keys to client-side
      // API keys should only be used server-side
      // If you need to use API keys, create a backend proxy endpoint
      define: {
        // Only expose non-sensitive configuration
        // Remove API key exposure - these should be server-side only
        // 'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY), // REMOVED - Security risk
        // 'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY) // REMOVED - Security risk
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
