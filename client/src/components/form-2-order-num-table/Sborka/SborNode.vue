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
        v-if="field.name === 'name'"
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
      <!--      {{ console.log(sbor.strat) }}-->
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
import { ref } from 'vue'
import { FontAwesomeIcon } from '@/components/shared/fontawesome.js'
import formatters, { formatBoolean } from '@/components/shared/formatters.js'

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

    return { isExpanded, toggle, hasChildren, formatValue, generateTitle }
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
