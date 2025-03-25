import axios from 'axios'
import { getToken } from '@/modules/api/tokenService.js'

const authClient = axios.create({
  baseURL: 'http://auth.pfforum/api/v1',
  timeout: 5000,
})

// 📌 Интерцептор запросов: автоматически добавляет токен
authClient.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default authClient
