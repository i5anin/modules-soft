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
          :detail="{ route: 'OrderDetails', idKey: 'ordersnom_id' }"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, defineProps, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { getOrderById } from '../../modules/form-2-card-noms/api/nom_list.js'
import OrderInfoCard from '../../modules/form-2-card-noms/components/form2Card.vue'
import { useRoleStore } from '@/modules/_main/store/index.js'
import SborMain from '@/modules/shared/tables/sborka/SborMain.vue'

const props = defineProps({
  type: { type: String, required: true },
})

const router = useRouter()
const roleStore = useRoleStore()

const nomTableData = ref([])
const headerData = ref({})
const tableFields = ref({})
const isCollapsed = ref(false)

const selectedRole = computed(() => roleStore.selectedRole)

const fetchOrderData = async () => {
  const id = router.currentRoute.value.params.id
  const type = props.type
  const role = selectedRole.value

  try {
    const { header, table } = await getOrderById({ id, type, role })
    headerData.value = header
    tableFields.value = table.fields
    nomTableData.value = table.data
  } catch (error) {
    console.error('Ошибка при загрузке заказа:', error)
    showErrorNotification('Ошибка при загрузке заказа. Попробуйте позже.')
  }
}

const filterTableFields = (fields) => {
  return Object.entries(fields)
    .filter(([key]) => !key.startsWith('status_'))
    .map(([key, field]) => ({
      name: key,
      ...field,
    }))
}

const filteredTableFields = computed(() => filterTableFields(tableFields.value))

onMounted(fetchOrderData)

watch(selectedRole, fetchOrderData)
</script>

<style scoped>
.grid-container {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 16px;
}

.order-info-card,
.sbor-main {
  width: 100%;
  background-color: var(--background-color, #f8f9fa);
  border-radius: 8px;
}

.toggle-btn {
  position: absolute;
  bottom: 10px;
  right: 10px;
}
</style>
