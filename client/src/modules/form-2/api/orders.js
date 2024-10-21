import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
})

const handleResponse = (response) => {
  return response.data
}

const handleError = (error) => {
  throw error
}

export const getOrderById = (orderId) => {
  return api
    .get('nom_list', {
      params: { id: orderId, type: 'orders', module: 'metrolog' },
    })
    .then(handleResponse)
    .catch(handleError)
}
