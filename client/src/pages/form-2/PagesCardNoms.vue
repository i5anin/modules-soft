<template>
  <div>
    <div class="grid-container">
      <div :class="{ collapsed: isCollapsed }">
        <OrderInfoCard :header="headerData" />
      </div>

      <div class="sbor-main">
        <SborMain
          v-if="nomTableData.length > 0"
          :table-data="nomTableData"
          :table-fields="filteredTableFields"
          :detail="detail1.value"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { getNomById } from './api/nom_list.js'
import OrderInfoCard from '@/modules/form-2-card-noms/components/Form2Card.vue'
import { useRoleStore } from '@/modules/_main/store/index.js'
import SborMain from '@/modules/shared/tables/sborka/SborMain.vue'

// Пропсы
const props = defineProps({
  type: { type: String, required: true },
  link: { type: String, required: true },
  edit: { type: Boolean, required: true },
  route: { type: String, required: true },
  routeAccess: { type: Array, required: true },
})

// Маршруты и стор
const router = useRouter()
const roleStore = useRoleStore()

// Реактивные переменные
const nomTableData = ref([])
const headerData = ref({})
const tableFields = ref({})
const isCollapsed = ref(false)

// Вычисляемые свойства
const selectedRole = computed(() => roleStore.selectedRole)

const detail1 = computed(() => ({
  route: props.route,
  idKey: props.link,
}))

console.log('[PagesCardNoms.vue]', detail1.value)

const fetchOrderData = async () => {
  const link_id = router.currentRoute.value.params.id
  const queryParams = {
    id: link_id,
    type: props.type,
    module: selectedRole.value,
  }
  try {
    const { header, table } = await getNomById(queryParams)
    headerData.value = header
    tableFields.value = table.fields
    nomTableData.value = table.data
  } catch (error) {
    console.error('Ошибка при загрузке данных:', error)
  }
}

const filteredTableFields = computed(() => {
  return Object.entries(tableFields.value)
    .filter(([key]) => !key.startsWith('status_'))
    .map(([key, field]) => ({
      name: key,
      ...field,
    }))
})

// Инициализация данных
onMounted(fetchOrderData)
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 270px 1fr;
  gap: 4px;
}
</style>
