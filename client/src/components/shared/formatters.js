import moment from 'moment';
import 'moment/locale/ru';

moment.locale('ru');

export function formatDate(dateString) {
    return moment(dateString).format('DD.MM.YYYY');
}

export function formatTime(dateString) {
    return `${dateString} дней`;
}

export function formatPrice(price) {
    const formatter = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
    return formatter.format(price);
}

// Экспортируем объект formatters по умолчанию
export default {
    formatTime,
    formatDate,
    formatPrice,
};