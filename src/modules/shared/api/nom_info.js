// nom_info.js

import apiClient from '@/modules/api/apiClient.js'
import { handleError, handleResponse } from '@/modules/api/responseHandlers.js'
import { getToken } from '@/modules/api/tokenService.js'

/**
 * Получение детализации номенклатуры по ID
 * @param {string} id - ID заказа
 * @param {string} type - Тип заказа
 * @param {string} module - Модуль или роль
 * @returns {Promise<Object>} - Объект с детализацией номенклатуры
 */
export const getNomDetailsById = (id, type, module) =>
  apiClient
    .get('nom_info', {
      params: { id, type, module },
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    .then(handleResponse)
    .catch(handleError)
