<template>
  <div class="container p-4 border rounded">
    <h3 class="mb-3">Информация о компоненте</h3>
    <p><strong>Имя компонента:</strong> {{ componentName || 'Неизвестно' }}</p>

    <section v-if="componentProps.length" class="mb-4">
      <h4 class="mb-2">Пропсы:</h4>
      <ul class="list-group">
        <li v-for="prop in componentProps" :key="prop.name" class="list-group-item">
          <strong>{{ prop.name }}</strong>
          <span v-if="prop.type">(тип: {{ prop.type }})</span>
          <span v-if="prop.default" class="text-muted"> - значение по умолчанию: {{ prop.default }}</span>
        </li>
      </ul>
    </section>

    <section v-if="componentMethods.length" class="mb-4">
      <h4 class="mb-2">Методы:</h4>
      <ul class="list-group">
        <li v-for="method in componentMethods" :key="method" class="list-group-item">
          {{ method }}
        </li>
      </ul>
    </section>

    <section v-if="componentEmits.length" class="mb-4">
      <h4 class="mb-2">События:</h4>
      <ul class="list-group">
        <li v-for="event in componentEmits" :key="event" class="list-group-item">
          {{ event }}
        </li>
      </ul>
    </section>

    <section v-if="componentChildren.length" class="mb-4">
      <h4 class="mb-2">Дочерние компоненты:</h4>
      <ul class="list-group">
        <li v-for="child in componentChildren" :key="child.name || child.__file" class="list-group-item">
          <InfoComponent :targetComponent="child" />
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import { computed } from 'vue';

export default {
  name: 'InfoComponent',
  props: {
    targetComponent: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const componentName = computed(() => props.targetComponent.name || 'Неизвестно');

    const componentProps = computed(() => {
      const rawProps = props.targetComponent.props || {};
      return Object.entries(rawProps).map(([key, value]) => ({
        name: key,
        type: value?.type?.name || 'unknown',
        default: value?.default || null,
      }));
    });

    const componentMethods = computed(() => {
      const rawMethods = props.targetComponent.methods || {};
      return Object.keys(rawMethods);
    });

    const componentEmits = computed(() => {
      return Array.isArray(props.targetComponent.emits)
        ? props.targetComponent.emits
        : [];
    });

    const componentChildren = computed(() => {
      const rawComponents = props.targetComponent.components || {};
      return Object.values(rawComponents);
    });

    return {
      componentName,
      componentProps,
      componentMethods,
      componentEmits,
      componentChildren,
    };
  },
};
</script>


