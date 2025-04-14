// nom_dir.js

import apiClient from '@/shared/api/base/apiClient.js'
import {
  handleResponse,
  handleError,
} from '@/shared/api/base/responseHandlers.js'
import { getToken } from '@/shared/api/base/tokenService.js'

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
