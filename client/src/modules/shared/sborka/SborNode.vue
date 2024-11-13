<template>
  <tr
    @click="toggle"
    :class="{ 'table-info': isExpanded, 'fw-bold': isExpanded }"
    style="table-layout: fixed"
  >
    <!-- Иконка разворачивания/сворачивания -->
    <td :style="{ width: '40px', textAlign: 'center' }">
      <span v-if="hasChildren" title="Развернуть/Свернуть">
        <font-awesome-icon
          :icon="isExpanded ? ['fas', 'minus'] : ['fas', 'plus']"
          class="icon-sm"
        />
      </span>
    </td>

    <!-- Статусы -->
    <td :style="{ width: '40px', textAlign: 'center' }">
      <span v-html="combinedStatuses" style="display: inline-flex"></span>
    </td>

    <!-- Поля -->
    <td v-for="field in fieldsArray" :key="field.name" style="font-size: 12px">
      <div
        v-if="field === firstField"
        class="tree-node"
        :style="{ paddingLeft: `${depth * 20}px`, position: 'relative' }"
      >
        <!-- Ветвь связей -->
        <div
          v-if="depth > 0"
          class="branch-line"
          :class="{ 'last-child': isLastChild }"
          :style="{ left: `${(depth - 1) * 20}px` }"
        ></div>

        <!-- Содержимое узла -->
        <div class="node-content">
          <font-awesome-icon
            :icon="sbor.is_sbor ? ['fas', 'cubes'] : ['fas', 'cube']"
            :style="{ color: sbor.is_sbor ? '#dc6611' : '#cfa614' }"
            class="icon-sm me-2"
          />
          <span>{{ formatValue(sbor[field.name], field.type) }}</span>
          <font-awesome-icon
            :icon="['fas', 'circle-info']"
            :style="{ color: 'green' }"
            class="icon-sm ms-2 me-2"
            @click.stop="handleRowClick"
          />
        </div>
      </div>
      <span v-else :title="generateTitle(field)" style="font-size: 13px">
        {{ formatValue(sbor[field.name], field.type) }}
      </span>
    </td>
  </tr>

  <!-- Рекурсивный вызов для дочерних узлов -->
  <template v-if="isExpanded && hasChildren">
    <SborNode
      v-for="(child, index) in sbor.sbor_tree"
      :key="child.ordersnom_id"
      :sbor="child"
      :fields="fields"
      :depth="depth + 1"
      :isLastChild="index === sbor.sbor_tree.length - 1"
    />
  </template>
</template>

<script>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { store } from './store.js'
import { FontAwesomeIcon } from '@/utils/icons.ts'
import { formatValue } from '@/utils/formatters-2.ts'
import { statuses } from '@/modules/shared/statuses.js'

export default {
  name: 'SborNode',
  components: { FontAwesomeIcon },
  props: {
    sbor: { type: Object, required: true },
    depth: { type: Number, default: 0 },
    fields: { type: Array, default: () => [] },
    isLastChild: { type: Boolean, default: false },
  },
  setup(props) {
    const sborStore = store()
    const router = useRouter()
    const isExpanded = ref(false)

    const toggle = () => {
      if (hasChildren.value) {
        isExpanded.value = !isExpanded.value
      }
    }

    const handleRowClick = () => {
      sborStore.selectSbor(props.sbor)
      router.push({
        name: 'OrderDetailsDetails',
        params: { id: props.sbor.sbor_orders__id },
      })
    }

    const hasChildren = computed(
      () => props.sbor.sbor_tree && props.sbor.sbor_tree.length > 0
    )
    const fieldsArray = computed(() => sborStore.filteredFields)
    const firstField = computed(() => fieldsArray.value[0])
    const combinedStatuses = computed(() => {
      const activeStatuses = statuses.filter(
        (status) =>
          props.sbor[status.status] && props.sbor[status.status].trim()
      )
      return activeStatuses.length > 0
        ? activeStatuses
            .map(
              (s) =>
                `<span class="badge ${s.badgeClass} me-1">${s.label}</span>`
            )
            .join('')
        : ''
    })

    const generateTitle = (field) => `Поле: ${field.title || 'Нет данных'}`

    return {
      isExpanded,
      toggle,
      handleRowClick,
      fieldsArray,
      firstField,
      combinedStatuses,
      hasChildren,
      formatValue,
      generateTitle,
    }
  },
}
</script>

<style scoped>
.tree-node {
  display: flex;
  align-items: center;
  position: relative;
}

.branch-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 20px;
}

.branch-line::before {
  content: '';
  position: absolute;
  left: 10px;
  top: 0;
  bottom: 0;
  width: 1px;
  background-color: #989898;
}

.branch-line::after {
  content: '';
  position: absolute;
  left: 10px;
  top: 50%;
  width: 10px;
  height: 1px;
  background-color: #989898;
}

.last-child .branch-line::before {
  height: 50%;
}

.node-content {
  display: flex;
  align-items: center;
}
</style>
