// orders.js
import apiClient from '@/modules/api/apiClient'
import { handleResponse, handleError } from '@/modules/api/responseHandlers'

/**
 * Получение заказа по ID
 * @param {Object} params - параметры для запроса
 * @param {string} params.orderId - ID заказа
 * @param {string} params.type - тип заказа
 * @param {string} params.role - модуль или роль
 * @returns {Promise<Object>} - Объект заказа
 */
export const getOrderById = (params) => {
  return apiClient
    .get('nom_list', {
      params: { id: params.orderId, type: params.type, module: params.role },
    })
    .then(handleResponse)
    .catch(handleError)
}
