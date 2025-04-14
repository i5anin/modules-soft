import apiClient from '@/shared/api/base/apiClient.js'
import {
  handleResponse,
  handleError,
} from '@/shared/api/base/responseHandlers.js'
import { getToken } from '@/shared/api/base/tokenService.js'

/**
 * Получение списка заказов с использованием API.
 * @param {Object} params - параметры для запроса.
 * @returns {Promise<Object>} - Промис с данными заказа.
 */
export const getItems = (params = {}) => {
  const token = getToken()

  return apiClient
    .get('list', {
      params: { ...params, token }, // 🔹 Добавлен токен в параметры
      headers: { Authorization: `Bearer ${token}` }, // 🔹 Оставлен в заголовке
    })
    .then(handleResponse)
    .catch(handleError)
}
