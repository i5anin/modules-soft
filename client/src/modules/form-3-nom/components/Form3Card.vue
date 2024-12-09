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
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Модалка -->
    <ModalZagInfo
      :visible="modalVisible"
      :type="modalType"
      :kolvo-add="modalKolvoAdd"
      :id="modalId"
      @close="modalVisible = false"
    />
  </div>
</template>

<script>
import { computed, ref } from 'vue'
import EditableField from './card/EditableField.vue'
import ReadonlyField from './card/ReadonlyField.vue'
import ModalZagInfo from '@/modules/shared/zagotovka/ModalZagotovka.vue'

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
    ModalZagInfo,
  },
  setup(props) {
    const localFieldValues = ref({ ...props.fieldValues })

    const formattedFieldValues = computed(() =>
      Object.fromEntries(
        Object.entries(props.fieldValues).map(([key, value]) => [
          key,
          value, // Здесь можно использовать форматтеры
        ])
      )
    )

    function getFieldComponent(field) {
      return field.permissions.update ? EditableField : ReadonlyField
    }

    const modalVisible = ref(false)
    const modalType = ref('')
    const modalKolvoAdd = ref('')
    const modalId = ref('')

    const handleFieldClick = (name) => {
      console.log('Field clicked:', name) // Логируем, чтобы отладить клик
      if (['zag_nom', 'zag_tech'].includes(name)) {
        modalType.value = name === 'zag_nom' ? 'nom' : 'tech'
        modalKolvoAdd.value = formattedFieldValues.value.kolvo_add || 0 // Добавляем защиту от undefined
        if (name === 'zag_nom') {
          modalId.value =
            formattedFieldValues.value.nom_id_nom ||
            formattedFieldValues.value.nom__id ||
            '' // Проверка значения
        } else if (name === 'zag_tech') {
          modalId.value = formattedFieldValues.value.ordersnom__id || '' // Проверка значения
        }
        if (modalId.value) {
          modalVisible.value = true
        } else {
          console.warn('Modal ID is missing for field:', name)
        }
      }
    }

    return {
      localFieldValues,
      formattedFieldValues,
      getFieldComponent,
      modalVisible,
      modalType,
      modalKolvoAdd,
      modalId,
      handleFieldClick,
    }
  },
}
</script>
