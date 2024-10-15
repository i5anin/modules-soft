<!-- SborNode.vue -->
<template>
  <!-- Отображение текущей сборки -->
  <tr @click="toggle" :class="{ 'table-active': isExpanded }">
    <td :style="{ paddingLeft: depth * 20 + 'px', cursor: 'pointer' }">
      <span v-if="hasChildren">
        <i :class="isExpanded ? 'bi bi-dash-square' : 'bi bi-plus-square'"></i>
      </span>
      <span v-else style="padding-left: 16px;"></span>
      {{ sbor.name }}
    </td>
    <td>{{ sbor.description }}</td>
    <td>{{ sbor.kolvo }}</td>
    <td>{{ sbor.is_sbor ? 'Да' : 'Нет' }}</td>
  </tr>

  <!-- Рекурсивное отображение дочерних сборок -->
  <template v-if="isExpanded && hasChildren">
    <SborNode v-for="child in sbor.sbor_tree"
              :key="child.name + '-' + child.description"
              :sbor="child"
              :depth="depth + 1" />
  </template>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'SborNode',
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
    const isExpanded = ref(false);

    const toggle = () => {
      if (hasChildren.value) {
        isExpanded.value = !isExpanded.value;
      }
    };

    const hasChildren = ref(
        props.sbor.sbor_tree && props.sbor.sbor_tree.length > 0
    );

    return { isExpanded, toggle, hasChildren };
  },
};
</script>

<style scoped>
.table-active {
  background-color: #f5f5f5;
}

.bi {
  margin-right: 5px;
}

tr:hover {
  background-color: #f9f9f9;
}
</style>
