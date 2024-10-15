<template>
  <div class="container-fluid">
    <h1>Сборка</h1>
    <div class="row">
      <div class="col-12">
        <!-- Orders Sbors -->
        <div v-for="sbor in ordersSbors" :key="sbor.sbor_orders__id" class="card mb-3">
          <div class="card-header">
            <h5 class="card-title">{{ sbor.name }} (ID: {{ sbor.sbor_orders__id }})</h5>
          </div>
          <div class="card-body">
            <p><strong>Описание:</strong> {{ sbor.description }}</p>
            <p><strong>Количество:</strong> {{ sbor.kolvo }}</p>
            <p><strong>Сборка:</strong> {{ sbor.is_sbor ? 'Да' : 'Нет' }}</p>

            <!-- Sbor Tree -->
            <div v-if="sbor.sbor_tree && sbor.sbor_tree.length">
              <h6>Дерево сборки</h6>
              <div class="row">
                <div v-for="item in sbor.sbor_tree" :key="item.name" class="col-12 col-md-6 col-lg-4">
                  <div class="card mb-2">
                    <div class="card-body">
                      <h6 class="card-title">{{ item.name }}</h6>
                      <p><strong>Количество:</strong> {{ item.kolvo }}</p>
                      <p><strong>В сборке:</strong> {{ item.kolvo_v_sborke }}</p>
                      <p><strong>Сборка:</strong> {{ item.is_sbor ? 'Да' : 'Нет' }}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { onMounted, ref } from 'vue';
import axios from 'axios';

export default {
  setup() {
    const ordersSbors = ref([]);

    const fetchOrders = () => {
      // Здесь используется указанный URL для выполнения запроса
      return axios.get('http://localhost:8002/api/nom_list', {
        params: {
          id: 1840,          // ID заказа
          type: 'orders',     // Тип
          module: 'tech_calc' // Модуль
        }
      })
          .then(response => {
            // Обработка ответа, чтобы сохранить данные с фильтрацией на сборки
            ordersSbors.value = response.data.table.data.filter(item => item.is_sbor);
          })
          .catch(error => {
            console.error('Ошибка при загрузке сборок:', error);
          });
    };

    onMounted(() => {
      fetchOrders(); // Выполняем запрос при монтировании компонента
    });

    return {
      ordersSbors
    };
  }
};
</script>

<style scoped>
/* Можно добавить кастомные стили при необходимости */
</style>
