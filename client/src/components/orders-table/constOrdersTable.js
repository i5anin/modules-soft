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
                {status: 'ordersnom__status_cal', badgeClass: 'bg-danger', label: 'К'},
                {status: 'ordersnom__status_instr', badgeClass: 'bg-warning', label: 'И'},
                {status: 'ordersnom__status_draft', badgeClass: 'bg-secondary', label: 'Ч'},
                {status: 'ordersnom__status_metall', badgeClass: 'bg-dark', label: 'М'},
                {status: 'ordersnom__status_kp', badgeClass: 'bg-success', label: 'КП'}
            ];

            return statuses
                .filter(s => row[s.status]?.trim())
                .map(s => `<span class="badge ${s.badgeClass} me-1">${s.label}</span>`)
                .join('');
        }
    },
    {data: 'id', title: '№', render: data => data || '', type: 'number'},
    {
        data: 'date',
        title: 'Дата',
        render: data => data ? format(new Date(data), DATE_FORMAT, {locale: ru}) : '',
        type: 'date'
    },
    {
        data: 'clients__name', // Исправлено на 'clients__name'
        title: 'Контрагент',
        render: (data, type, row) => `<span style="${row.goz ? 'background-color: lightgreen;' : ''}">${data || ''}</span>`
    },
    {title: 'Срок', data: 'metall_buy_time', render: data => data || '', type: 'number', orderable: false}, // Исправлено на 'metall_buy_time'
    {title: 'Менеджер', data: 'order_manager', render: data => data || '', type: 'string'}
];

export const LANG_CONFIG = {url: 'Russian.json'};