// orders.ts
import apiClient from '@/modules/api/apiClient'
import { handleError, handleResponse } from '@/modules/api/responseHandlers'
import { GetModalOrderByIdParams, ModalOrder } from './types'

export const getModalOrderById = (
  orderId: GetModalOrderByIdParams['orderId'],
  type: GetModalOrderByIdParams['type'],
  module: GetModalOrderByIdParams['module']
): Promise<ModalOrder> => {
  return apiClient
    .get<ModalOrder>('nom_info', {
      params: { id: orderId, type, module: module },
    })
    .then(handleResponse)
    .catch(handleError)
}
