// nom_dir.js

import apiClient from '@/modules/api/apiClient.js'
import { handleResponse, handleError } from '@/modules/api/responseHandlers.js'
import { getToken } from '@/modules/api/tokenService.js'

/**
 * Получение номенклатуры клиента
 * @param {Object} params - Параметры запроса
 * @returns {Promise<Array>} - Список номенклатуры клиента
 */
export const getClientNom = (params) =>
  apiClient
    .get('nom_dir', {
      params,
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    .then(handleResponse)
    .catch(handleError)
