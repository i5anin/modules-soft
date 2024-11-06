// responseHandlers.ts
import { AxiosResponse } from 'axios'

// Обработчик успешного ответа
export const handleResponse = <T>(response: AxiosResponse<T>): T => {
  return response.data
}

// Обработчик ошибок
export const handleError = (error: unknown): never => {
  throw error
}
