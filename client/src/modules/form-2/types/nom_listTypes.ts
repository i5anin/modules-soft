// types.ts

// Параметры для функции getOrderById
export interface GetOrderByIdParams {
  orderId: number | string
  type: string
  role: string
}

// Структура ответа API для заказа
export interface Order {
  header: {
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
  table: {
    fields: Record<string, { label: string; type: string; [key: string]: any }>
    data: Array<Record<string, any>>
  }
}
