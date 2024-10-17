<template>
  <tr
    @click="toggle"
    :class="{
      'table-info': isExpanded,
      bold: isExpanded || (sbor.is_sbor && isExpanded),
    }"
  >
    <td
      v-for="field in fields"
      :key="field.name"
      :style="{ cursor: 'pointer', fontSize: '12px' }"
    >
      <!-- Динамический вывод значения поля -->
      <span
        v-if="field === firstField"
        style="display: inline-flex; align-items: center"
        :style="{ paddingLeft: depth * 40 + 'px', fontSize: '15px' }"
      >
        <span v-if="hasChildren">
          <!-- Если есть дочерние элементы, выводим плюс/минус -->
          <font-awesome-icon
            :icon="isExpanded ? ['fas', 'minus'] : ['fas', 'plus']"
            class="icon-sm ms-2"
          />
        </span>
        <span v-else>
          <!-- Если дочерних элементов нет, выводим точку -->
          <font-awesome-icon
            :icon="['fas', 'circle']"
            class="icon-sm ms-2"
            style="opacity: 0"
          />
        </span>
        <!-- Иконка куба/кубов для элементов -->
        <font-awesome-icon
          :icon="sbor.is_sbor ? ['fas', 'cubes'] : ['fas', 'cube']"
          :style="{ color: sbor.is_sbor ? '#dc6611' : '#cfa614' }"
          class="icon-sm ms-2 me-2"
        />
        <span>{{ formatValue(field.name, sbor[field.name]) }}</span>
      </span>

      <span
        v-else
        :title="generateTitle(field, sbor)"
        :style="{ fontSize: '13px' }"
      >
        {{ formatValue(field.name, sbor[field.name]) }}
      </span>
    </td>

    <!-- Новый столбец для статусов -->
    <td>
      <span v-html="combinedStatuses"></span>
    </td>
  </tr>

  <template v-if="isExpanded && hasChildren">
    <SborNode
      v-for="child in sbor.sbor_tree"
      :key="child.sbor_orders__id"
      :sbor="child"
      :fields="fields"
      :depth="depth + 1"
    />
  </template>
</template>

<script>
import { computed, ref } from 'vue'
import { FontAwesomeIcon } from '@/modules/utils/icons.js'
import formatters, { formatBoolean } from '@/modules/utils/formatters.js'

export default {
  name: 'SborNode',
  components: {
    FontAwesomeIcon,
  },
  props: {
    sbor: {
      type: Object,
      required: true,
    },
    fields: {
      type: Array,
      required: true,
    },
    depth: {
      type: Number,
      default: 0,
    },
  },
  setup(props) {
    const isExpanded = ref(false)
    const firstField = ref(props.fields[0])

    const toggle = () => {
      if (hasChildren.value) {
        isExpanded.value = !isExpanded.value
      }
    }

    const hasChildren = ref(
      props.sbor.sbor_tree && props.sbor.sbor_tree.length > 0
    )

    const formatValue = (fieldName, value) => {
      if (typeof value === 'boolean') {
        return formatBoolean(value)
      }
      if (fieldName.toLowerCase().includes('price')) {
        return formatters.formatPrice(value)
      }
      if (fieldName.toLowerCase().includes('date')) {
        return formatters.formatDate(value)
      }
      if (fieldName.toLowerCase().includes('time')) {
        return formatters.formatTime(value)
      }
      return value
    }

    const generateTitle = (field, sbor) => {
      return (
        `Поле: ${field.title || 'Ошибка нет поля'}\n` +
        `Стратегия: ${sbor.strat || 'Нет'}`
      )
    }

    // Статусы с соответствующими классами и метками
    const statuses = [
      { status: 'status_cal', badgeClass: 'bg-danger', label: 'К' },
      { status: 'status_instr', badgeClass: 'bg-warning', label: 'И' },
      { status: 'status_draft', badgeClass: 'bg-secondary', label: 'Ч' },
      { status: 'status_metall', badgeClass: 'bg-dark', label: 'М' },
      { status: 'status_kp', badgeClass: 'bg-success', label: 'КП' },
    ]

    // Комбинирование активных статусов
    const combinedStatuses = computed(() => {
      const activeStatuses = statuses.filter(
        (status) =>
          props.sbor[status.status] && props.sbor[status.status].trim()
      )
      if (activeStatuses.length > 0) {
        return activeStatuses
          .map(
            (s) => `<span class="badge ${s.badgeClass} me-1">${s.label}</span>`
          )
          .join('')
      } else {
        return ''
      }
    })

    return {
      isExpanded,
      toggle,
      hasChildren,
      formatValue,
      generateTitle,
      firstField,
      combinedStatuses,
    }
  },
}
</script>

<style scoped>
.icon-sm {
  font-size: 0.8em;
}

tr:hover {
  background-color: #f9f9f9;
}

td {
  font-size: 13px;
}

.bold {
  font-weight: bold;
}
</style>
