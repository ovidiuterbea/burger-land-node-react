import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './setupTests.ts',
    coverage: {
      reporter: ['text', 'html'],
      exclude: [
        'src/App.tsx',
        'src/main.tsx',
        'src/constants/**',
        'src/context/**',
        './eslint.config.js',
        './vite.config.ts',
        'src/vite-env.d.ts',
      ],
    },
  },
});
