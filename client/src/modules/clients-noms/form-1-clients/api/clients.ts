// nom_dir.ts
import apiClient from '@/modules/api/apiClient'
import { handleResponse, handleError } from '@/modules/api/responseHandlers'
import { GetOrdersParams, Order } from './types'

export const getClients = (params: GetOrdersParams): Promise<Order[]> => {
  return apiClient
    .get<Order[]>('clients', { params }) // Убрано жестко прописанное client_id
    .then(handleResponse)
    .catch(handleError)
}
