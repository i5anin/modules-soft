// nom_info.js

import apiClient from '@/shared/api/base/apiClient.js'
import {
  handleError,
  handleResponse,
} from '@/shared/api/base/responseHandlers.js'
import { getToken } from '@/shared/api/base/tokenService.js'

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
