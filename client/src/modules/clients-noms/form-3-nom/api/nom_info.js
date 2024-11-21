import apiClient from '@/modules/api/apiClient'
import { handleError, handleResponse } from '@/modules/api/responseHandlers'

/**
 * Получить модальную информацию о заказе по ID
 * @param {string} id - Идентификатор
 * @param {string} type - Тип заказа
 * @param {string} module - Модуль
 * @returns {Promise<Object>} - Данные модального заказа
 */
export const getModalNomById = (id, type, module) => {
  return apiClient
    .get('nom_info', {
      params: { id, type, module },
    })
    .then(handleResponse)
    .catch(handleError)
}
