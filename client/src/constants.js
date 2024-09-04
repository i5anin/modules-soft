// Файл: src/constants.js
import { format } from 'date-fns';
import { ru } from 'date-fns/locale/ru';

export const DATE_FORMAT = 'dd.MM.yyyy';

export const ORDERS_TABLE_COLUMNS = [
    {
        data: 'status_ready', orderable: false, className: 'text-center',
        render: data => `<input type="checkbox" ${data ? 'checked' : ''} disabled>`
    },
    {
        data: 'status_cal', className: 'text-center',
        render: (data, type, row) => `<td class="${data ? 'table-danger' : ''} text-center">${data || ''}</td>`
    },
    {
        data: 'status_instr', className: 'text-center',
        render: (data, type, row) => `<td class="${data ? 'table-warning' : ''} text-center">${data || ''}</td>`
    },
    {
        data: 'status_draft', className: 'text-center',
        render: (data, type, row) => `<td class="${data ? 'table-secondary' : ''} text-center">${data || ''}</td>`
    },
    {
        data: 'status_metall', className: 'text-center',
        render: (data, type, row) => `<td class="${data ? 'table-dark' : ''} text-center">${data || ''}</td>`
    },
    {
        data: 'status_kp', className: 'text-center',
        render: (data, type, row) => `<td class="${data ? 'table-success' : ''} text-center">${data || ''}</td>`
    },
    {data: 'id', render: data => data || ''},
    {data: 'date', render: data => data ? format(new Date(data), 'dd.MM.yyyy', {locale: ru}) : ''},
    {
        data: 'name',
        render: (data, type, row) => `<td class="${row.goz ? 'table-success' : ''}">${data || ''}</td>`
    },
    {data: 'cal_buy_time', render: data => data || ''},
    {data: 'order_manager', render: data => data || ''}
];

export const LANGUAGE_CONFIG = {
    url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Russian.json'
};