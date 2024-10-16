<template>
  <tr @click="toggle" :class="{ 'table-info': isExpanded }">
    <td
      v-for="field in fields"
      :key="field.name"
      :style="{ paddingLeft: depth * 40 + 'px', cursor: 'pointer' }"
    >
      <!-- Динамический вывод значения поля -->
      <span
        v-if="field.name === 'name'"
        style="display: inline-flex; align-items: center"
      >
        <span v-if="hasChildren">
          <font-awesome-icon
            :icon="isExpanded ? ['fas', 'minus'] : ['fas', 'plus']"
            class="icon-sm ms-2"
          />
        </span>
        <font-awesome-icon
          :icon="sbor.is_sbor ? ['fas', 'cubes'] : ['fas', 'cube']"
          :style="{ color: sbor.is_sbor ? '#dc6611' : '#cfa614' }"
          class="icon-sm ms-2 me-2"
        />
        <span>{{ formatValue(field.name, sbor[field.name]) }}</span>
      </span>
      <span v-else :title="field.title">
        {{ formatValue(field.name, sbor[field.name]) }}
      </span>
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
import formatters from '@/components/shared/formatters.js'

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

    return { isExpanded, toggle, hasChildren, formatValue }
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
</style>
