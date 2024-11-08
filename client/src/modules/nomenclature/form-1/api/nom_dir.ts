// nom_dir.ts
import apiClient from '@/modules/api/apiClient'
import { handleResponse, handleError } from '@/modules/api/responseHandlers'
import { GetOrdersParams, Order } from './types'

export const getOrders = (params: GetOrdersParams): Promise<Order[]> => {
  // Включаем client_id в параметры запроса
  return apiClient
    .get<Order[]>('nom_dir', { params: { ...params, client_id: 418 } })
    .then(handleResponse)
    .catch(handleError)
}
