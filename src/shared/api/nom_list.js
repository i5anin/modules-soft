// nom_list.js

import authClient from '@/shared/api/base/apiClient.js'
import {
  handleError,
  handleResponse,
} from '@/shared/api/base/responseHandlers.js'
import { getToken } from '@/shared/api/base/tokenService.js'

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
