// clients.js

import apiClient from '@/shared/api/base/apiClient.js'
import {
  handleResponse,
  handleError,
} from '@/shared/api/base/responseHandlers.js'
import { getToken } from '@/shared/api/base/tokenService.js'

export const getClients = (params) =>
  apiClient
    .get('clients', {
      params,
      headers: { Authorization: `Bearer ${getToken()}` },
    })
    .then(handleResponse)
    .catch(handleError)
