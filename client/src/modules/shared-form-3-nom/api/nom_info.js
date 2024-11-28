// orders.js
import apiClient from '@/modules/api/apiClient.js'
import { handleError, handleResponse } from '@/modules/api/responseHandlers.js'

/**
 * Получение модального заказа по ID
 * @param {string} id - ID заказа
 * @param {string} type - Тип заказа
 * @param {string} module - Модуль или роль
 * @returns {Promise<Object>} - Объект модального заказа
 */
export const getModalOrderById = (id, type, module) => {
  return apiClient
    .get('nom_info', {
      params: { id, type, module },
    })
    .then(handleResponse)
    .catch(handleError)
}

// export const getModalNomById = (id, type, module) => {
//   return apiClient
//     .get('nom_info', {
//       params: { id, type, module },
//     })
//     .then(handleResponse)
//     .catch(handleError)
// }
