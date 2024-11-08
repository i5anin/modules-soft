import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path' // Импортируем модуль path

export default defineConfig({
  server: { host: true, port: 5173 },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), //  указываем путь к папке src
    },
  },
})
