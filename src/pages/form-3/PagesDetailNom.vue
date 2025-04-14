<!-- Родительский шаблон -->
<template>
  <div class="grid-container bg mb-3 my-3">
    <div>
      <Card
        v-if="hasAnyFields"
        :update-form-fields="updateFormFields"
        :readonly-form-fields="readonlyFormFields"
        :field-values="fieldValues"
      />
    </div>

    <div class="table-section">
      <CaliberTable
        v-if="selectedItem?.table_cal?.data?.length"
        :fields="readAndUpdateFields(selectedItem.table_cal?.fields)"
        :data="selectedItem.table_cal?.data"
        :table-title="selectedItem.table_cal?.title"
      />
      <StrategyTable
        v-if="selectedItem?.strat?.data?.length"
        :fields="readAndUpdateFields(selectedItem.strat?.fields)"
        :data="selectedItem.strat?.data"
        :table-title="selectedItem.strat?.title"
      />
      <TpdTable
        v-if="selectedItem?.tpd?.data?.length"
        :fields="readAndUpdateFields(selectedItem.tpd?.fields)"
        :data="selectedItem.tpd?.data"
        :table-title="selectedItem.tpd?.title"
      />
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import { useRoute } from 'vue-router'
  import { getNomDetailsById } from '@/shared/api/nom_info.js'
  import Card from '@/features/form-3-nom/components/Form3Card.vue'
  import BaseTable from '@/shared/tables/table/BaseTable.vue'

  const CaliberTable = BaseTable
  const StrategyTable = BaseTable
  const TpdTable = BaseTable

  const route = useRoute()
  const id = ref(route.params.nom_id)
  const selectedItem = ref(null)
  const routeProps = defineProps(['type'])

  onMounted(async () => {
    if (!id.value) return
    try {
      selectedItem.value = await getNomDetailsById(id.value, routeProps.type)
    } catch (error) {
      console.error('Ошибка при загрузке деталей заказа:', error)
      selectedItem.value = null
    }
  })

  const filterFields = (fields, condition) =>
    Object.entries(fields || {}).filter(([, f]) => condition(f))

  const readAndUpdateFields = (fields) =>
    filterFields(
      fields,
      (f) => f.permissions?.read || f.permissions?.update
    ).map(([key, field]) => ({ key, ...field }))

  const filteredHeaderFields = computed(() =>
    readAndUpdateFields(selectedItem.value?.header?.fields || {})
  )

  const updateFormFields = computed(() =>
    filteredHeaderFields.value.filter((f) => f.permissions?.update)
  )

  const readonlyFormFields = computed(() =>
    filteredHeaderFields.value.filter((f) => !f.permissions?.update)
  )

  const fieldValues = computed(() => {
    const fields = selectedItem.value?.header?.fields || {}
    const data = selectedItem.value?.header?.data || {}
    return Object.fromEntries(
      Object.keys(fields).map((key) => [key, data[key] ?? ''])
    )
  })

  const hasAnyFields = computed(
    () =>
      (updateFormFields.value?.length || 0) > 0 ||
      (readonlyFormFields.value?.length || 0) > 0
  )
</script>

<style scoped>
  .grid-container {
    display: grid;
    grid-template-columns: 400px 1fr;
    gap: 4px;
  }

  .table-section {
    width: 100%;
  }
</style>
