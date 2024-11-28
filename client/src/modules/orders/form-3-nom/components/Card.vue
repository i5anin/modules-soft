<template>
  <div class="card mb-2">
    <div class="card-body p-2">
      <div class="row">
        <!-- Поля для редактирования -->
        <div class="col-12">
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

        <!-- Только для чтения -->
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
                  @field-click="handleFieldClick"
                  @icon-click="handleIconClick"
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
import { ref, computed } from 'vue'
import { formatValueCard } from '@/utils/formatters'
import EditableField from './card/EditableField.vue'
import ReadonlyField from './card/ReadonlyField.vue'

export default {
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
  components: {
    EditableField,
    ReadonlyField,
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

    const handleFieldClick = (name) => {
      if (['zag_nom', 'zag_tech'].includes(name)) {
        console.log('Field clicked:', name)
        console.log('nom_id_nom:', formattedFieldValues.value.nom_id_nom)
        console.log('kolvo_add:', formattedFieldValues.value.kolvo_add)
        console.log('ordersnom__id:', formattedFieldValues.value.ordersnom__id)
      }
    }

    const handleIconClick = (name) => {
      console.log('Icon clicked:', name)
      // Можно добавить дополнительные действия
    }

    return {
      localFieldValues,
      formattedFieldValues,
      getFieldComponent,
      handleFieldClick,
      handleIconClick,
    }
  },
}
</script>
