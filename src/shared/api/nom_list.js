// nom_list.js

import authClient from '@/modules/api/apiClient.js'
import { handleError, handleResponse } from '@/modules/api/responseHandlers.js'
import { getToken } from '@/modules/api/tokenService.js'

/**
 * Получение данных номенклатурного заказа по параметрам
 * @param {Object} params - параметры запроса (id, type, module)
 * @returns {Promise<Object>} - Объект с данными заказа
 */
export const getNomById = (params) =>
  authClient
    .get('/nom_list', {
      params: { ...params, token: getToken() },
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    .then(handleResponse)
    .catch(handleError)
