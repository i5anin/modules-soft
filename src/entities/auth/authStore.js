import { defineStore } from 'pinia'
import { login, getUser } from '@/shared/api/base/authApi.js'
import {
  getToken,
  setToken,
  removeToken,
} from '@/shared/api/base/tokenService.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: getToken() || null, // ✅ Добавил проверку, если токена нет
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token), // ✅ Упрощённый вариант
  },

  actions: {
    /**
     * Авторизация пользователя
     * @param {string} email - Почта пользователя
     * @param {string} password - Пароль пользователя
     */
    async loginUser(email, password) {
      try {
        const { token, user } = await login(email, password)
        if (!token) throw new Error('Ошибка: токен не получен')

        setToken(token) // ✅ Сначала сохраняем токен
        this.token = token // ✅ Затем обновляем `state`
        this.user = user
      } catch (error) {
        console.error('Ошибка авторизации:', error)
        throw new Error('Ошибка авторизации')
      }
    },

    /**
     * Получение данных текущего пользователя
     * @returns {Promise<Object|null>} - Данные пользователя или null
     */
    async getUser() {
      if (!this.token) return null

      try {
        const response = await getUser()
        if (!response.user) throw new Error('Ошибка: user не получен')

        this.user = response.user
        return this.user
      } catch (error) {
        console.error('Ошибка получения пользователя:', error)
        this.logout() // ✅ Если ошибка — сбрасываем данные
        return null
      }
    },

    /**
     * Выход из системы
     */
    logout() {
      removeToken() // ✅ Сначала убираем токен из хранилища
      this.token = null
      this.user = null
    },
  },
})
