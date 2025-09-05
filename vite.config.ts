import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import type { UserConfigExport } from 'vite';

// https://vitejs.dev/config/
const config: UserConfigExport = defineConfig({
  base: './',
  build: {
    emptyOutDir: true,
    outDir: './build',
    target: 'ES2022',
  },
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  plugins: [vue()],
  server: {
    hmr: false, // Disable hot reload on save
  },
});

export default config;
