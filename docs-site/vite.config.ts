import path from 'path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/',
      build: {
        target: 'es2018',
        cssCodeSplit: true,
        rollupOptions: {
          output: {
            manualChunks: (id) => {
              if (id.includes('node_modules')) {
                if (id.includes('react')) {
                  return 'vendor';
                }
                if (id.includes('prism')) {
                  return 'prism';
                }
                return 'vendor';
              }
            },
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]'
          },
        },
        minify: 'esbuild',
        sourcemap: false,
        reportCompressedSize: false,
        chunkSizeWarningLimit: 1000
      },
      esbuild: {
        drop: mode === 'production' ? ['console', 'debugger'] : [],
      },
      css: {
        postcss: './postcss.config.js',
        devSourcemap: false
      },
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      // Performance optimizations
      optimizeDeps: {
        include: ['react', 'react-dom', 'react-router-dom'],
        exclude: []
      },
      // SSG specific configuration
      ssgOptions: {
        script: 'async',
        dirStyle: 'nested',
        includeAllRoutes: true,
        format: 'esm'
      },
    };
});
