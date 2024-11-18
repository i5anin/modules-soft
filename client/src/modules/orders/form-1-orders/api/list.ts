import apiClient from '@/modules/api/apiClient'
import { handleResponse, handleError } from '@/modules/api/responseHandlers'
import { GetOrdersParams, Order } from './types'

export const getOrders = (params: GetOrdersParams): Promise<Order[]> => {
  console.log('Request params:', params) // Выводим параметры запроса
  return apiClient
    .get<Order[]>('list', { params })
    .then(handleResponse)
    .catch(handleError)
}
