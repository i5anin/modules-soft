// apiClient.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL as string,
})

export default apiClient
