import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const buildTimestamp = Date.now();
    const buildVersion = process.env.BUILD_VERSION || `v${new Date().toISOString().split('T')[0]}-${buildTimestamp.toString().slice(-6)}`;
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.BUILD_VERSION': JSON.stringify(buildVersion),
        'process.env.BUILD_TIMESTAMP': JSON.stringify(buildTimestamp)
      },
      build: {
        rollupOptions: {
          output: {
            entryFileNames: `assets/[name]-[hash].js`,
            chunkFileNames: `assets/[name]-[hash].js`,
            assetFileNames: `assets/[name]-[hash].[ext]`
          }
        }
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
