<template>
  <div>
    <table class="table table-striped">
      <thead>
      <tr>
        <th></th>
        <th>К</th>
        <th>И</th>
        <th>Ч</th>
        <th>М</th>
        <th>П</th>
        <th>№</th>
        <th>Дата</th>
        <th class="bg-light">Контрагент</th>
        <th>Срок</th>
        <th>Менеджер</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="order in orders" :key="order.id">
        <td>
          <input type="checkbox" :checked="order.status_ready" disabled>
        </td>
        <td :class="{ 'table-danger': order.status_cal }" class="text-center">
          {{ order.status_cal }}
        </td>
        <td :class="{ 'table-warning': order.status_instr }" class="text-center">
          {{ order.status_instr }}
        </td>
        <td :class="{ 'table-secondary': order.status_draft }" class="text-center">
          {{ order.status_draft }}
        </td>
        <td :class="{ 'table-dark': order.status_metall }" class="text-center">
          {{ order.status_metall }}
        </td>
        <td :class="{ 'table-success': order.status_kp }" class="text-center">
          {{ order.status_kp }}
        </td>
        <td>{{ order.id }}</td>
        <td>{{ formatDate(order.date) }}</td>
        <td :class="{ 'table-success': order.goz }">
          {{ order.name }}
        </td>
        <td>{{ order.cal_buy_time }}</td>
        <td>{{ order.order_manager }}</td>
      </tr>
      </tbody>
    </table>

    <nav aria-label="Page navigation">
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="prevPage">Предыдущая</button>
        </li>
        <li class="page-item active" aria-current="page">
          <span class="page-link">{{ currentPage }}</span>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="nextPage">Следующая</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { computed, onMounted, ref, watch } from 'vue';
import { useHomeStore } from '../store/home.module';
import { getOrders } from '../api/orders';
import { format } from 'date-fns'; // Импортируем format из date-fns
import { ru } from 'date-fns/locale/ru'; // Импортируем русскую локаль

export default {
  setup() {
    const homeStore = useHomeStore();
    const orders = ref([]); // Реактивный массив для хранения заказов
    const totalOrders = ref(0); // Реактивная переменная для общего количества заказов

    // Вычисляемые свойства для текущей страницы и общего количества страниц
    const currentPage = computed(() => homeStore.currentPage);
    const totalPages = computed(() => Math.ceil(totalOrders.value / homeStore.itemsPerPage));

    // Функция для загрузки заказов
    const fetchOrders = async () => {
      try {
        const data = await getOrders(homeStore.currentPage, homeStore.itemsPerPage, homeStore.searchQuery);
        orders.value = data.orders;
        totalOrders.value = data.totalCount;
      } catch (error) {
        console.error('Ошибка при загрузке заказов:', error);
      }
    };

    // Функция для форматирования даты с помощью date-fns
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return format(date, 'dd.MM.yyyy', { locale: ru }); // Форматируем в "ДД.ММ.ГГГГ"
    };

    // Следим за изменениями currentPage и searchQuery для загрузки заказов
    watch([currentPage, () => homeStore.searchQuery], fetchOrders);

    // Функции для перехода на следующую и предыдущую страницы
    const nextPage = () => {
      if (homeStore.currentPage < totalPages.value) {
        homeStore.nextPage();
      }
    };

    const prevPage = () => {
      if (homeStore.currentPage > 1) {
        homeStore.prevPage();
      }
    };

    // Загружаем заказы при монтировании компонента
    onMounted(fetchOrders);

    return {
      orders,
      currentPage,
      totalPages,
      nextPage,
      prevPage,
      formatDate // Добавляем formatDate в возвращаемый объект
    };
  },
};
</script>