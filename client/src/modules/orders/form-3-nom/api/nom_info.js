// orders.js
import apiClient from '@/modules/api/apiClient'
import { handleError, handleResponse } from '@/modules/api/responseHandlers'

/**
 * Получение модального заказа по ID
 * @param {string} orderId - ID заказа
 * @param {string} type - Тип заказа
 * @param {string} module - Модуль или роль
 * @returns {Promise<Object>} - Объект модального заказа
 */
export const getModalOrderById = (orderId, type, module) => {
  return apiClient
    .get('nom_info', {
      params: { id: orderId, type, module },
    })
    .then(handleResponse)
    .catch(handleError)
}
