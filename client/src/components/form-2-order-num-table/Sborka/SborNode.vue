<!-- SborNode.vue -->
<template>
  <!-- Отображение текущей сборки -->
  <tr @click="toggle" :class="{ 'table-info': isExpanded }">
    <td :style="{ paddingLeft: depth * 40 + 'px', cursor: 'pointer' }">
      <span v-if="hasChildren">
        <font-awesome-icon
          :icon="isExpanded ? ['fas', 'minus'] : ['fas', 'plus']"
          class="icon-sm ms-3"
        />
      </span>
      <span v-if="sbor.is_sbor"> </span>

      <span v-else style="padding-left: 27px"></span>
      <font-awesome-icon
        :icon="sbor.is_sbor ? ['fas', 'cubes'] : ['fas', 'cube']"
        :style="{ color: sbor.is_sbor ? '#dc6611' : '#cfa614' }"
        class="icon-sm ms-3 me-2"
      />
      {{ sbor.name }}
    </td>
    <td>{{ sbor.description }}</td>
    <td>{{ sbor.kolvo }}</td>
    <td>{{ sbor.is_sbor ? 'Да' : 'Нет' }}</td>
  </tr>

  <!-- Рекурсивное отображение дочерних сборок -->
  <template v-if="isExpanded && hasChildren">
    <SborNode
      v-for="child in sbor.sbor_tree"
      :key="child.sbor_orders__id"
      :sbor="child"
      :depth="depth + 1"
    />
  </template>
</template>

<script>
import { ref } from 'vue'
import { FontAwesomeIcon } from '@/components/shared/fontawesome.js'

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

    return { isExpanded, toggle, hasChildren }
  },
}
</script>

<style scoped>
.icon-sm {
  font-size: 0.8em; /* Уменьшаем размер иконки */
}

tr:hover {
  background-color: #f9f9f9;
}
</style>
