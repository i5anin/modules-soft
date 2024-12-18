<template>
  <tr
    @click="toggle"
    :class="{ 'table-info': isExpanded, 'fw-bold': isExpanded }"
    style="table-layout: fixed"
  >
    <!-- Иконка разворачивания/сворачивания -->
    <td
      :style="{ width: '40px', textAlign: 'center', verticalAlign: 'middle' }"
    >
      <span v-if="hasChildren" title="Развернуть/Свернуть">
        <font-awesome-icon
          :icon="isExpanded ? ['fas', 'minus'] : ['fas', 'plus']"
          class="icon-sm"
        />
      </span>
    </td>

    <!-- Статусы -->
    <td
      :style="{ width: '40px', textAlign: 'center', verticalAlign: 'middle' }"
    >
      <StatusDisplay :row="sbor" @statusFound="handleStatusFound" />
    </td>

    <!-- Поля -->
    <td
      v-for="field in fieldsArray"
      :key="field.name"
      :style="{
        fontSize: '12px',
        verticalAlign: 'middle',
        textAlign: getTextAlignment(field.type, field.name),
      }"
    >
      <div
        v-if="field.name === 'name' || field.name === 'description'"
        :style="{
          textDecoration:
            otgruzkaAccepted &&
            (field.name === 'name' || field.name === 'description')
              ? 'line-through'
              : 'none',
        }"
      >
        <span v-html="formatValue(sbor[field.name], field.type, field.name)" />
      </div>

      <StrategyDisplay
        v-else-if="field.name === 'strat'"
        :strategy="sbor[field.name]"
        :depth="depth"
      />

      <span
        v-else
        v-html="formatValue(sbor[field.name], field.type, field.name)"
        :title="generateTitle(field)"
        style="font-size: 13px"
      />
    </td>
  </tr>

  <!-- Рекурсивный вызов для дочерних узлов -->
  <template v-if="isExpanded && hasChildren">
    <SborNode
      v-for="(child, index) in sbor.sbor_tree"
      :key="child[detail.idKey]"
      :sbor="child"
      :fields="fields"
      :depth="depth + 1"
      :isLastChild="index === sbor.sbor_tree.length - 1"
      :detail="detail"
    />
  </template>
</template>

<script setup>
import { computed, ref, toRefs, watch } from 'vue'
import { useRouter } from 'vue-router'
import { store } from './store.js'
import { FontAwesomeIcon } from '@/utils/icons.js'
import { formatValue, getTextAlignment } from '@/utils/formatters.js'
import StatusDisplay from '@/modules/shared/components/StatusDisplay.vue'
import StrategyDisplay from '@/modules/shared/components/StrategyDisplay.vue'
import './SborNode.css'

const props = defineProps({
  sbor: { type: Object, required: true },
  depth: { type: Number, default: 0 },
  fields: { type: Array, default: () => [] },
  isLastChild: { type: Boolean, default: false },
  detail: {
    type: Object,
    required: true,
    default: () => ({ route: '', idKey: '' }),
  },
})

const { sbor, detail } = toRefs(props)
const sborStore = store()
const router = useRouter()
const isExpanded = ref(false)
const otgruzkaAccepted = ref(false)

watch(
  detail,
  (newDetail) => {
    if (!newDetail.route || !newDetail.idKey) {
      console.warn(
        'Detail prop is missing or incomplete. Expected { route: "", idKey: "" }.',
        newDetail
      )
    }
  },
  { immediate: true }
)

const toggle = () => {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value
  }
}

const handleRowClick = () => {
  const idKey = detail.value.idKey
  const id = sbor.value[idKey]

  if (!id) {
    console.error('Missing required parameter: id', {
      id,
      sbor: sbor.value,
    })
    return
  }

  router
    .push({
      name: detail.value.route,
      params: { [idKey]: id, nom_id: id },
    })
    .catch((error) => {
      console.error('Error navigating to route:', error)
    })
}

const hasChildren = computed(
  () => sbor.value.sbor_tree && sbor.value.sbor_tree.length > 0
)

const fieldsArray = computed(() => sborStore.filteredFields)

const generateTitle = (field) =>
  `Поле: ${field.title || 'Нет данных'}\nПеременная: ${field.name || 'Нет данных'}`

const handleStatusFound = (status) => {
  if (status.suffix === '_otgruzka' && status.value === true) {
    otgruzkaAccepted.value = true
    console.log(otgruzkaAccepted)
  }
}
</script>

<style scoped>
.table-info {
  background-color: #f8f9fa;
}

.fw-bold {
  font-weight: bold;
}
</style>
