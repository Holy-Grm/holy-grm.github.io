import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  base: "/holy-grm.github.io/",
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      onwarn(warning, warn) {
        // Suppress warnings about externalized modules
        if (warning.code === 'UNRESOLVED_IMPORT') return;
        warn(warning);
      }
    }
  },
  server: {
    port: 3000,
    open: true,
  },
});
