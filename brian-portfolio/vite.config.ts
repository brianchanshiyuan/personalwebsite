import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: "/",  // IMPORTANT: Required for Vercel deployment
  optimizeDeps: {
    include: ['@fontsource/sora', '@fontsource/inter', '@fontsource/jetbrains-mono'],
  },
});
