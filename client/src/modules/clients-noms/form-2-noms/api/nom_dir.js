import apiClient from '@/modules/api/apiClient'
import { handleError, handleResponse } from '@/modules/api/responseHandlers'

/**
 * Получение номенклатуры клиента
 * @param {Object} params - Параметры запроса
 * @returns {Promise<Array>} - Список номенклатуры клиента
 */
export const getClientNom = (params) => {
  return apiClient
    .get('nom_dir', { params })
    .then(handleResponse)
    .catch(handleError)
}
