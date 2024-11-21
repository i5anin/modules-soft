// nom_dir.js
import apiClient from '@/modules/api/apiClient'
import { handleResponse, handleError } from '@/modules/api/responseHandlers'

export const getClients = (params) => {
  return apiClient
    .get('clients', { params })
    .then(handleResponse)
    .catch(handleError)
}
