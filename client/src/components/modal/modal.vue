<template>
  <div class="modal fade" id="orderModal" tabindex="-1" aria-labelledby="orderModalLabel" aria-hidden="true"
       ref="modalContainer">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="orderModalLabel">Детали заказа</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
                  @click="closeModal"></button>
        </div>
        <div class="modal-body">
          <div v-if="selectedOrder">
            <p v-for="item in formattedOrder" :key="item.key">
              <strong>{{ item.label }}:</strong> {{ item.value }}
            </p>
          </div>
          <div v-else>
            <p>Загрузка данных...</p>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" @click="closeModal">Закрыть</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from 'vue';
import {Modal} from 'bootstrap';
import {getModalOrderById} from '../../api/orders';

const props = defineProps({
  orderId: {type: Number, required: true}
});

const emit = defineEmits(['close']);

const modalContainer = ref(null);
let modalInstance = null;
const selectedOrder = ref(null);

onMounted(() => {
  modalInstance = new Modal(modalContainer.value);
});

watch(
    () => props.orderId,
    async (newOrderId) => {
      if (newOrderId) {
        selectedOrder.value = await getModalOrderById(newOrderId);
        modalInstance.show();
      }
    },
    {immediate: true}
);

const closeModal = () => {
  modalInstance.hide();
  emit('close');
};

const formattedOrder = computed(() => {
  if (!selectedOrder.value) return [];

  const {
    name,
    description,
    instr_info,
    comments,
    zag_comments,
    tech_fio,
    tech_id,
    p_info_orders
  } = selectedOrder.value;

  return [
    {label: 'Наименование', key: 'name', value: name},
    {label: 'Обозначение', key: 'description', value: description},
    {label: 'Изм инструмента для заказа', key: 'instr_info', value: instr_info},
    {label: 'Комментарий по изм инструменту (технологи)', key: 'comments', value: comments},
    {label: 'Комментарий по изм инструменту (ОТК)', key: 'zag_comments', value: zag_comments},
    {label: 'Комментарий заготовки', key: 'zag_comments', value: zag_comments},
    {label: 'Для слесаря', key: 'tech_fio', value: tech_fio},
    {label: '№ тех процесса', key: 'tech_id', value: tech_id},
    {label: '№ чертежа', key: 'tech_id', value: tech_id},
    {label: 'ФИО ТП', key: 'tech_fio', value: tech_fio},
    {label: 'Технологическая заготовка', key: 'p_info_orders', value: p_info_orders},
    {label: 'Примечания', key: 'comments', value: comments}
  ];
});
</script>