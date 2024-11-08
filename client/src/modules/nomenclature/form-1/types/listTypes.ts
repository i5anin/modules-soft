// types.ts
export interface GetOrdersParams {
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

export interface Order {
  id: number
  name: string
  description: string
  price: number
  quantity: number
  status: string
  createdAt: string
  updatedAt: string
  type: string
}
