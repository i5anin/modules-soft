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

export const fetchOrders = (id) => {
  return api
    .get('nom_list', {
      params: {
        id: id,
        type: 'orders',
        module: 'tech_calc',
      },
    })
    .then((response) => {
      return response.data // Возвращаем только данные, без изменения внешних переменных
    })
    .catch(handleError)
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

export const getOrderById = (orderId) => {
  return api
    .get('nom_list', {
      params: { id: orderId, type: 'orders', module: 'metrolog' },
    })
    .then(handleResponse)
    .catch(handleError)
}

export const getModalOrderById = (orderId) => {
  return api
    .get('nom_info', {
      params: { id: orderId, type: 'orders', module: 'metrolog' },
    })
    .then(handleResponse)
    .catch(handleError)
}
