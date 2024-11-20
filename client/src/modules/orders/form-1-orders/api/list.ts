import apiClient from '@/modules/api/apiClient'
import { handleResponse, handleError } from '@/modules/api/responseHandlers'
import { GetOrdersParams, Order } from './types'

export const getOrders = (params: GetOrdersParams): Promise<Order[]> => {
  const now = new Date()
  const formattedTime = `${now.getFullYear().toString().slice(-2)}:${String(now.getMonth() + 1).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`
  console.log(`[${formattedTime}] Request params:`, params)

  return apiClient
    .get<Order[]>('list', { params })
    .then(handleResponse)
    .catch(handleError)
}
