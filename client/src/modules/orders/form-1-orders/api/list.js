import apiClient from '@/modules/api/apiClient'
import { handleResponse, handleError } from '@/modules/api/responseHandlers'

/**
 * Получает список заказов с использованием API.
 *
 * @param {Object} params - Параметры запроса.
 * @returns {Promise<Array>} - Промис с массивом заказов.
 */
export const getOrders = async (params) => {
  try {
    const now = new Date()
    const formattedTime = `${now.getFullYear().toString().slice(-2)}:${String(
      now.getMonth() + 1
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
    const response = await apiClient.get('list', { params })
    return handleResponse(response)
  } catch (error) {
    return handleError(error)
  }
}
