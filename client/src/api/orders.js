import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

export const getOrders = (page, limit, search) => {
    return api.get('/order_metrologist_calc/table', {
        params: { page, limit, search },
    })
        .then(response => {
            console.log('Ответ сервера:', response); // Лог ответа сервера
            return response.data;
        })
        .catch(error => {
            console.error('Ошибка при получении заказов:', error);
            throw error;
        });
};

export const getOrderById = (orderId) => {
    return api.get(`/order_metrologist_calc/order?order_id=${orderId}`) // Предполагаемый путь к API
        .then(response => {
            console.log('Ответ сервера:', response);
            return response.data;
        })
        .catch(error => {
            console.error('Ошибка при получении заказа:', error);
            throw error;
        });
};