import apiClient from '@/shared/api/base/apiClient.js'
import {
  handleResponse,
  handleError,
} from '@/shared/api/base/responseHandlers.js'

/**
 * Получает информацию о заготовке.
 *
 * @param {Object} params - Параметры запроса.
 * @returns {Promise<Object>} - Промис с данными о заготовке.
 */
export const getZagotovkaInfo = async (params) => {
  try {
    const response = await apiClient.get('/zag_info', { params })
    return handleResponse(response)
  } catch (error) {
    return handleError(error)
  }
}
