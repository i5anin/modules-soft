// orders.ts
import apiClient from '@/modules/api/apiClient'
import { handleResponse, handleError } from '@/modules/api/responseHandlers'
import { Order, GetOrderByIdParams } from './types'

export const getOrderById = (params: GetOrderByIdParams): Promise<Order> => {
  return apiClient
    .get<Order>('nom_list', {
      params: { id: params.orderId, type: params.type, module: params.role },
    })
    .then(handleResponse)
    .catch(handleError)
}
