<template>
  <div class="card mb-2">
    <div class="card-body p-2">
      <div class="row">
        <div class="col-12">
          <!-- Editable fields with floating labels and form-check switches -->
          <div v-for="field in updateFormFields" :key="field.name" class="mb-3">
            <component
              :is="getFieldComponent(field)"
              :field="field"
              :modelValue="localFieldValues[field.name]"
              @update:modelValue="
                (newValue) => (localFieldValues[field.name] = newValue)
              "
            />
          </div>
        </div>

        <!-- Readonly fields with styling for labels and values -->
        <div class="col-12 mt-3">
          <div class="card-body p-2">
            <div class="row g-3">
              <div
                class="col-md-6"
                v-for="field in readonlyFormFields"
                :key="field.name"
              >
                <ReadonlyField
                  :field="field"
                  :value="formattedFieldValues[field.name]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import { formatValueCard } from '@/utils/formatters'
import EditableField from './card/EditableField.vue'
import ReadonlyField from './card/ReadonlyField.vue'

export default {
  components: {
    EditableField,
    ReadonlyField,
  },
  props: {
    updateFormFields: {
      type: Array,
      required: true,
    },
    readonlyFormFields: {
      type: Array,
      required: true,
    },
    fieldValues: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const localFieldValues = ref({ ...props.fieldValues })

    const formattedFieldValues = computed(() =>
      Object.fromEntries(
        Object.entries(props.fieldValues).map(([key, value]) => [
          key,
          formatValueCard(value, key),
        ])
      )
    )

    function getFieldComponent(field) {
      return field.permissions.update ? EditableField : ReadonlyField
    }

    return {
      localFieldValues,
      formattedFieldValues,
      getFieldComponent,
    }
  },
}
</script>

<style scoped>
.field-label {
  font-size: 0.8rem;
  color: #212529;
  font-weight: 600;
}

.field-value {
  font-size: 1rem;
  color: #495057;
}
</style>
