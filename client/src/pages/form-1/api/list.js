// list.js

import apiClient from '@/modules/api/apiClient.js'
import { handleResponse, handleError } from '@/modules/api/responseHandlers.js'
import { getToken } from '@/modules/api/tokenService.js'

/**
 * Получение списка заказов с использованием API.
 * @param {Object} params - параметры для запроса.
 * @returns {Promise<Object>} - Промис с данными заказа.
 */
export const getItems = (params) =>
  apiClient
    .get('list', {
      params,
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    .then(handleResponse)
    .catch(handleError)
