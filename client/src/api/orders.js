import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

export const getOrders = (page, limit, search) =>
    api.get('/order_metrologist_calc/table', {
        params: {page, limit, search},
    })
        .then(response => response.data)
        .catch(error => {
            console.error('Ошибка при получении заказов:', error)
            throw error;
        });