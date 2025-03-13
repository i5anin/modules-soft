import authClient from '@/modules/api/authClient.js'
import { handleError, handleResponse } from '@/modules/api/responseHandlers.js'

/**
 * Аутентификация пользователя
 * @param {string} email - Почта пользователя
 * @param {string} password - Пароль пользователя
 * @returns {Promise<Object>} - Токен авторизации и данные пользователя
 */
export const login = (email, password) =>
  authClient
    .post('/auth/login', { email, password })
    .then(handleResponse)
    .catch(handleError)

/**
 * Получение данных текущего пользователя
 * @returns {Promise<Object>} - Данные пользователя
 */
export const getUser = () =>
  authClient
    .get('/user') // Токен добавляется автоматически через интерцептор
    .then(handleResponse)
    .catch(handleError)

/**
 * Получение меню пользователя
 * @returns {Promise<Object>} - Данные меню
 */
export const getMenu = () =>
  authClient
    .get('/menu') // Токен добавляется автоматически через интерцептор
    .then(handleResponse)
    .catch(handleError)
