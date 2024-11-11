// nom_dir.ts
import apiClient from '@/modules/api/apiClient'
import { handleResponse, handleError } from '@/modules/api/responseHandlers'
import { GetOrdersParams, Order } from './types'

export const getOrders = (params: GetOrdersParams): Promise<Order[]> => {
  return apiClient
    .get<Order[]>('nom_dir', { params }) // Убрано жестко прописанное client_id
    .then(handleResponse)
    .catch(handleError)
}
