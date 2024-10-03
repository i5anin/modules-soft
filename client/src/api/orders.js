import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
});

const handleResponse = (response) => {
    return response.data;
};

const handleError = (error) => {
    throw error;
};

export const getOrders = (page, limit, search, sortCol, sortDir, date1, date2) => {
    return api.get('orders', {
        params: {
            type: "metrolog",
            page,
            limit,
            search,
            sortCol,
            sortDir,
            date1,
            date2
        }
    }).then(handleResponse).catch(handleError);
};

export const getOrderById = (orderId) => {
    return api.get('order_nom_list', {
        params: {order_id: orderId, type: "metrolog", flat: 1},
    }).then(handleResponse).catch(handleError);
};

export const getModalOrderById = (orderId) => {
    return api.get('order_nom_info', {
        params: {orders_nom_id: orderId},
    }).then(handleResponse).catch(handleError);
};


