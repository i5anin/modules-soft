<template>
  <div class="container p-4 border rounded">
    <h3 class="mb-3">Информация о компоненте</h3>
    <p><strong>Имя компонента:</strong> {{ componentName || 'Неизвестно' }}</p>
    <p><strong>API компонента:</strong> {{ apiStyle }}</p>

    <!-- Сворачиваемая секция: Пропсы -->
    <section v-if="componentProps.length" class="mb-4">
      <h4 class="mb-2 d-flex justify-content-between align-items-center">
        Пропсы:
        <button class="btn btn-link" @click="toggleSection('props')">
          {{ collapsedSections.props ? 'Развернуть' : 'Свернуть' }}
        </button>
      </h4>
      <ul v-show="!collapsedSections.props" class="list-group">
        <li v-for="prop in componentProps" :key="prop.name" class="list-group-item">
          <strong :title="JSON.stringify(prop)">{{ prop.name }}</strong>
          <span v-if="prop.type">(тип: {{ prop.type }})</span>
          <span v-if="prop.default" class="text-muted"> - значение по умолчанию: {{ prop.default }}</span>
        </li>
      </ul>
    </section>

    <!-- Сворачиваемая секция: Методы -->
    <section v-if="componentMethods.ownMethods.length || componentMethods.externalMethods.length" class="mb-4">
      <h4 class="mb-2 d-flex justify-content-between align-items-center">
        Методы:
        <button class="btn btn-link" @click="toggleSection('methods')">
          {{ collapsedSections.methods ? 'Развернуть' : 'Свернуть' }}
        </button>
      </h4>

      <div v-show="!collapsedSections.methods">
        <!-- Собственные методы -->
        <div v-if="componentMethods.ownMethods.length" class="mb-3">
          <h5>Собственные методы</h5>
          <ul class="list-group">
            <li v-for="method in componentMethods.ownMethods" :key="method" class="list-group-item">
              {{ method }}
            </li>
          </ul>
        </div>

        <!-- Внешние методы -->
        <div v-if="componentMethods.externalMethods.length" class="mb-3">
          <h5>Внешние методы</h5>
          <ul class="list-group">
            <li v-for="method in componentMethods.externalMethods" :key="method" class="list-group-item">
              {{ method }}
            </li>
          </ul>
        </div>
      </div>
    </section>

    <!-- Сворачиваемая секция: События -->
    <section v-if="componentEmits.length" class="mb-4">
      <h4 class="mb-2 d-flex justify-content-between align-items-center">
        События:
        <button class="btn btn-link" @click="toggleSection('emits')">
          {{ collapsedSections.emits ? 'Развернуть' : 'Свернуть' }}
        </button>
      </h4>
      <ul v-show="!collapsedSections.emits" class="list-group">
        <li v-for="event in componentEmits" :key="event" class="list-group-item">
          {{ event }}
        </li>
      </ul>
    </section>

    <!-- Сворачиваемая секция: Дочерние компоненты -->
    <section v-if="componentChildren.length" class="mb-4">
      <h4 class="mb-2 d-flex justify-content-between align-items-center">
        Дочерние компоненты:
        <button class="btn btn-link" @click="toggleSection('children')">
          {{ collapsedSections.children ? 'Развернуть' : 'Свернуть' }}
        </button>
      </h4>
      <ul v-show="!collapsedSections.children" class="list-group">
        <li v-for="child in componentChildren" :key="child.name || child.__file" class="list-group-item">
          <InfoComponent :targetComponent="child" />
        </li>
      </ul>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import InfoComponent from './InfoComponent.vue';

// Используем defineProps для получения пропсов
const props = defineProps({
  targetComponent: {
    type: Object,
    required: true,
  },
});

const collapsedSections = ref({
  props: false,
  methods: false,
  emits: false,
  children: false,
});

const toggleSection = (section) => {
  collapsedSections.value[section] = !collapsedSections.value[section];
};

const componentName = computed(() => props.targetComponent?.name || 'Неизвестно');

const apiStyle = computed(() => {
  if (props.targetComponent?.setup) return 'Composition API';
  if (
    props.targetComponent?.data ||
    props.targetComponent?.methods ||
    props.targetComponent?.computed
  ) return 'Options API';
  return 'Неизвестно';
});

const componentProps = computed(() => {
  const rawProps = props.targetComponent?.props || {};
  if (!rawProps || typeof rawProps !== 'object') return [];
  return Object.entries(rawProps).map(([key, value]) => ({
    name: key,
    type: value?.type?.name || 'unknown',
    default: value?.default || null,
  }));
});

const componentMethods = computed(() => {
  let ownMethods = [];
  let externalMethods = [];

  if (props.targetComponent?.$options) {
    const setupResult = props.targetComponent;
    ownMethods = Object.keys(setupResult).filter(
      (key) => typeof setupResult[key] === 'function'
    );
    if (setupResult.$options.methods) {
      externalMethods = Object.keys(setupResult.$options.methods);
    }
  } else if (props.targetComponent?.setup) {
    try {
      const setupResult = props.targetComponent.setup();
      ownMethods = Object.keys(setupResult).filter(
        (key) => typeof setupResult[key] === 'function'
      );
    } catch (error) {
      console.error('Ошибка при вызове setup:', error);
    }
  }

  return { ownMethods, externalMethods };
});

const componentEmits = computed(() => {
  return Array.isArray(props.targetComponent?.emits)
    ? props.targetComponent.emits
    : [];
});

const componentChildren = computed(() => {
  const rawComponents = props.targetComponent?.components || {};
  return rawComponents ? Object.values(rawComponents) : [];
});
</script>

<style>
.map-container {
  width: 100%;
  height: 100%;
}
</style>
