import axios, { AxiosResponse } from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
})

const handleResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data
}

const handleError = (error: unknown): never => {
  throw error
}

interface GetOrdersParams {
  page: number
  limit: number
  search?: string
  sortCol?: string
  sortDir?: 'asc' | 'desc'
  date1?: string
  date2?: string
  type: string
  role: string
}

interface Order {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  status: string
  createdAt: string
  updatedAt: string
  type: string
  // добавьте другие поля, если они присутствуют в ответе API
}

export const getOrders = (params: GetOrdersParams): Promise<Order[]> => {
  return api
    .get<Order[]>('list', { params })
    .then(handleResponse)
    .catch(handleError)
}
