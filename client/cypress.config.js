import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'ex3fvh',
  e2e: {
    baseUrl: 'http://localhost:5173', // Замените на ваш адрес
    supportFile: false, // Если вы не используете support файлы
  },
})
