import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    target: 'es2022',
    // Three.js is large; keep it in its own chunk so the first paint stays light.
    rollupOptions: {
      output: {
        manualChunks: { three: ['three'] },
      },
    },
  },
  server: {
    host: false, // use `npm run dev:phone` to expose the dev server on your local network
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
