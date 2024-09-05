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
            const statuses = [
                {status: 'cal', badgeClass: 'bg-danger', label: 'К'},
                {status: 'instr', badgeClass: 'bg-warning', label: 'И'},
                {status: 'draft', badgeClass: 'bg-secondary', label: 'Ч'},
                {status: 'metall', badgeClass: 'bg-dark', label: 'М'},
                {status: 'kp', badgeClass: 'bg-success', label: 'КП'}
            ];

            return statuses
                .filter(s => row[`status_${s.status}`])
                .map(s => `<span class="badge ${s.badgeClass} me-1">${s.label}</span>`)
                .join('');
        }
    },
    {data: 'id', title: '№', render: data => data || '', type: 'number'},
    {
        data: 'date',
        title: 'Дата',
        render: data => data ? format(new Date(data), DATE_FORMAT, {locale: ru}) : '',
        type: 'date' // Исправлено на 'date'
    },
    {
        data: 'name',
        title: 'Контрагент',
        render: (data, type, row) => `<span style="${row.goz ? 'background-color: lightgreen;' : ''}">${data || ''}</span>`
        // Удален ненужный type: 'number'
    },
    {title: 'Срок', data: 'cal_buy_time', render: data => data || '', type: 'number'},
    {title: 'Менеджер', orderable: false, data: 'order_manager', render: data => data || '', type: 'string'}
];

export const LANGUAGE_CONFIG = {url: 'Russian.json'};