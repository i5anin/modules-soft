<template>
  <div>
    <div v-if="header" class="card mb-2">
      <div class="card-header p-2">
        <span class="mdi mdi-format-list-bulleted-type"></span>
        <svg-icon type="mdi" :path="mdiFormatListBulletedType" color="red" />
        Информация о заказе
      </div>
      <div class="card-body p-2">
        <table class="table table-sm">
          <tbody>
            <tr v-for="field in allFields" :key="field.name">
              <td class="p-1">
                <strong>{{ field.title }}</strong>
              </td>
              <td class="p-1" :title="fieldValues[field.name]">
                <input
                  type="text"
                  v-model="fieldValues[field.name]"
                  :placeholder="field.title"
                  class="form-control form-control-sm"
                  disabled
                />
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Компонент для отображения комментариев -->
        <CommentSection
          :commentFields="commentFields"
          :fieldValues="fieldValuesComputed"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { computed, defineComponent, ref, reactive, watch } from 'vue'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiFormatListBulletedType } from '@mdi/js'
import { formatValue as formatterFormatValue } from '@/utils/formatters.js'
import CommentSection from './CommentSection.vue'

export default defineComponent({
  components: { SvgIcon, CommentSection },
  props: {
    header: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const mdiFormatListBulletedTypeRef = ref(mdiFormatListBulletedType)

    const commentFields = computed(() =>
      props.header.fields
        ? props.header.fields.filter((field) => field.name.includes('comments'))
        : []
    )

    const allFields = computed(() =>
      props.header.fields
        ? props.header.fields.filter(
            (field) => !field.name.includes('comments')
          )
        : []
    )

    // Инициализация fieldValues как пустой объект, чтобы его можно было обновлять
    const fieldValues = reactive({})

    // Функция для обновления fieldValues
    const updateFieldValues = () => {
      Object.assign(
        fieldValues,
        Object.fromEntries(
          [...allFields.value, ...commentFields.value].map((field) => [
            field.name,
            formatterFormatValue(props.header.data[field.name], field.name),
          ])
        )
      )
    }

    // Вызываем updateFieldValues при изменении header
    watch(
      () => props.header,
      () => {
        updateFieldValues()
      },
      { immediate: true } // Запуск при первой загрузке
    )

    const fieldValuesComputed = computed(() => fieldValues)

    return {
      mdiFormatListBulletedType: mdiFormatListBulletedTypeRef,
      allFields,
      commentFields,
      fieldValues,
      fieldValuesComputed,
    }
  },
})
</script>
