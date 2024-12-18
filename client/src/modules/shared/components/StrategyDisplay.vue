<template>
  <div
    class="tree-node"
    :style="{ paddingLeft: `${depth * 20}px`, position: 'relative' }"
  >
    <div class="node-content">
      <span v-if="!isExpanded">
        <div class="mini-strategy">
          <span
            v-for="entry in strategyEntries"
            :key="entry[0]"
            :style="{
              backgroundColor: getColor(entry[1]),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '18px',
              height: '18px',
              margin: '0 2px',
              borderRadius: '4px' /* добавим скругление для лучшего визуала */,
            }"
          >
            <div
              :style="{
                fontSize: '8px',
                color: 'white',
                fontWeight: 'bold',
                lineHeight: '8px' /* выравниваем текст */,
              }"
            >
              {{ entry[0] }}
            </div>
          </span>
        </div>
      </span>
      <span v-else v-html="formattedStrategy"></span>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { formatStrategy } from '@/utils/formatters.js'

export default {
  name: 'StrategyDisplay',
  props: {
    strategy: {
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

    const colorMapping = {
      LightGreen: '#198754',
      Red: '#dc3545',
      Orange: '#FFA500',
      LimeGreen: '#90EE90',
      Default: '#aaaaaa',
    }

    const getColor = (entry) => {
      return entry.color in colorMapping
        ? colorMapping[entry.color]
        : entry.color || colorMapping.Default
    }

    const toggle = () => {
      isExpanded.value = !isExpanded.value
    }

    const strategyEntries = computed(() => Object.entries(props.strategy))

    const formattedStrategy = computed(() => formatStrategy(props.strategy))

    return {
      strategyEntries,
      formattedStrategy,
      isExpanded,
      toggle,
      getColor,
    }
  },
}
</script>

<style scoped>
.mini-strategy {
  display: flex;
  flex-wrap: wrap;
}
</style>
