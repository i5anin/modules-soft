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

export const getOrders = (
  page,
  limit,
  search,
  sortCol,
  sortDir,
  date1,
  date2
) => {
  return api
    .get('list', {
      params: {
        type: 'orders',
        module: 'metrolog',
        page,
        limit,
        search,
        sortCol,
        sortDir,
        date1,
        date2,
      },
    })
    .then(handleResponse)
    .catch(handleError)
}
