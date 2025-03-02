// clients.js

import apiClient from '@/modules/api/apiClient.js'
import { handleResponse, handleError } from '@/modules/api/responseHandlers.js'
import { getToken } from '@/modules/api/tokenService.js'


export const getClients = (params) =>
  apiClient
    .get('clients', {
      params,
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    .then(handleResponse)
    .catch(handleError)
