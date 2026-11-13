import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative asset paths, so the same build works at a domain root and under /rewindo/ on GitHub Pages.
  base: './',
  plugins: [react()],
  server: { port: 5173, strictPort: true },
});
