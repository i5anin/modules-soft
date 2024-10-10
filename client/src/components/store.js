// Pinia Store Implementation
import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getOrders } from '../api/orders.js';
import _ from 'lodash';

export const useOrdersStore = defineStore('orders', () => {
    const orders = ref([]);
    const tableFields = ref([]);
    const noData = ref(false);
    const statuses = [
        { status: 'ordersnom__status_cal', badgeClass: 'bg-danger', label: 'К' },
        { status: 'ordersnom__status_instr', badgeClass: 'bg-warning', label: 'И' },
        { status: 'ordersnom__status_draft', badgeClass: 'bg-secondary', label: 'Ч' },
        { status: 'ordersnom__status_metall', badgeClass: 'bg-dark', label: 'М' },
        { status: 'ordersnom__status_kp', badgeClass: 'bg-success', label: 'КП' },
    ];

    const fetchOrders = async (page, limit, searchQuery, sortCol, sortDir, startDate, endDate, callback) => {
        try {
            const response = await getOrders(page, limit, searchQuery, sortCol, sortDir, startDate, endDate);
            noData.value = response.table.data.length === 0;
            orders.value = response.table.data;
            tableFields.value = response.table.fields;
            if (callback) {
                callback({
                    data: response.table.data,
                    recordsTotal: response.header.total_count,
                    recordsFiltered: response.header.total_count,
                });
            }
        } catch (error) {
            console.error('Ошибка при загрузке заказов:', error);
            noData.value = true;
        }
    };

    const filteredTableFields = computed(() => {
        const fields = _.filter(tableFields.value, (field) => !field.name.startsWith('ordersnom__status_') && field.name !== 'id' && field.name !== 'goz');
        fields.splice(1, 0, { name: 'statuses', title: 'Статусы' });
        // Переименовываем столбец status_ready в пустую строку
        fields.forEach((field) => {
            if (field.name === 'status_ready') {
                field.title = '';
            }
        });
        return fields;
    });

    const renderStatus = _.memoize((row) => {
        const activeStatuses = _.filter(statuses, (s) => row[s.status] && row[s.status].trim() !== '');

        if (activeStatuses.length > 0) {
            return activeStatuses
                .map((s) => `<span class="badge ${s.badgeClass} me-1">${s.label}</span>`)
                .join('');
        } else {
            return '';
        }
    });

    return { orders, tableFields, noData, fetchOrders, filteredTableFields, renderStatus };
});
