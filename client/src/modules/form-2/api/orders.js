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

export const getOrderById = (orderId, type, role) => {
  return api
    .get('nom_list', {
      params: { id: orderId, type: type, module: role },
    })
    .then(handleResponse)
    .catch(handleError)
}
