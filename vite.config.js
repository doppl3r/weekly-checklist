import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  build: {
    emptyOutDir: true,
    outDir: './build',
    target: "ES2022"
  },
  css: {
    preprocessorOptions : {
      scss: {
        api: "modern",
      }        
    } 
  },
  plugins: [
    vue()
  ],
  server: {
    hmr: false, // Disable hot reload on save,
  }
})
