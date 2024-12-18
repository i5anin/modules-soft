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
              backgroundColor: entry[1].color || '#aaaaaa',
              display: 'inline-block',
              width: '16px',
              height: '16px',
              margin: '0 2px',
            }"
          >
            <div
              :style="{
                fontSize: '8px',
                color: 'white',
                transform: 'translate(5%, 11%)',
                fontWeight: 'bold',
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
