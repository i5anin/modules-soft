import {format} from 'date-fns';
import {ru} from 'date-fns/locale/ru';

export const DATE_FORMAT = 'dd.MM.yyyy';

export const ORDERS_TABLE_COLUMNS = [
    {
        orderable: false,
        data: 'status_ready',
        className: 'text-center',
        render: data => `<input type="checkbox" ${data ? 'checked' : ''} disabled>`
    },
    {
        orderable: false,
        data: 'statuses',
        title: 'Статусы',
        className: 'text-center',
        render: (data, type, row) => {
            let statusesHTML = '';
            if (row.status_cal) {
                statusesHTML += `<span class="badge bg-danger me-1">К</span>`;
            }
            if (row.status_instr) {
                statusesHTML += `<span class="badge bg-warning me-1">И</span>`;
            }
            if (row.status_draft) {
                statusesHTML += `<span class="badge bg-secondary me-1">Ч</span>`;
            }
            if (row.status_metall) {
                statusesHTML += `<span class="badge bg-dark me-1">М</span>`;
            }
            if (row.status_kp) {
                statusesHTML += `<span class="badge bg-success">КП</span>`;
            }
            return `<td class="text-center">${statusesHTML}</td>`;
        }
    },
    {data: 'id', title: '№', render: data => data || '', type: 'number'},
    {
        data: 'date',
        title: 'Дата',
        render: data => data ? format(new Date(data), 'dd.MM.yyyy', {locale: ru}) : '',
        type: 'data'
    },
    {
        data: 'name', title: 'Контрагент',
        render: (data, type, row) => `<td class="${row.goz ? 'table-success' : ''}">${data || ''}</td>`, type: 'number'
    },
    {title: 'Срок', data: 'cal_buy_time', render: data => data || '', type: 'number'},
    {title: 'Менеджер', orderable: false, data: 'order_manager', render: data => data || '', type: 'string'}
];

export const LANGUAGE_CONFIG = {
    url: 'https://cdn.datatables.net/plug-ins/1.10.25/i18n/Russian.json'
};