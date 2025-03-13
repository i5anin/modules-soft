import { defineStore } from 'pinia'
import { login, getUser } from '@/modules/api/authApi.js'
import { getToken, setToken, removeToken } from '@/modules/api/tokenService.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: getToken(),
  }),

  getters: {
    isAuthenticated: state => !!state.token,
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
        this.token = token
        this.user = user
        setToken(token)
      } catch (error) {
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
        this.user = response.user
        return this.user
      } catch (error) {
        console.error('Ошибка получения пользователя:', error)
        return null
      }
    },

    /**
     * Выход из системы
     */
    logout() {
      this.token = null
      this.user = null
      removeToken()
    },
  },
})
