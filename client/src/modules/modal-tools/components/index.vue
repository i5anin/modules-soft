<template>
  <div
    class="modal fade"
    id="orderModal"
    tabindex="-1"
    aria-labelledby="orderModalLabel"
    aria-hidden="true"
    ref="modalContainer"
  >
    <div class="modal-dialog modal-xl">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="orderModalLabel">
            Модальное окно инструмента
          </h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <div v-if="instrumentData">
            <div class="card">
              <div class="card-body">
                <div class="row">
                  <div
                    class="col-6"
                    v-for="(item, index) in instrumentData.data"
                    :key="index"
                    class="mb-1"
                  >
                    <strong>Группа инструмента:</strong> {{ item.tool_group_id
                    }}<br />
                    <strong>Тип операции:</strong> {{ item.t_op }}<br />
                    <strong>Комментарии:</strong> {{ item.comments_operators
                    }}<br />
                    <strong>Путь:</strong> {{ item.path }}<br />
                    <strong>Описание свойства:</strong>
                    <ul>
                      <li
                        v-for="(value, key) in item.property_description"
                        :key="key"
                      >
                        {{ key }}: {{ value }}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <p>Загрузка данных...</p>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="closeModal"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import { Modal } from 'bootstrap'
import { fetchInstrumentData } from '../api/tools.js'

const props = defineProps({
  no: { type: String, required: true },
  nomId: { type: Number, required: true },
})

const emit = defineEmits(['close'])

const modalContainer = ref(null)
let modalInstance = null
const instrumentData = ref(null)

onMounted(() => {
  modalInstance = new Modal(modalContainer.value)
})

watch(
  () => [props.no, props.nomId],
  async ([no, nomId]) => {
    if (no && nomId) {
      try {
        instrumentData.value = await fetchInstrumentData('005', 39087) //no=005&nom_id=39087 fetchInstrumentData(no, nomId)
        modalInstance.show()
      } catch (error) {
        console.error('Ошибка при загрузке данных инструмента:', error)
        instrumentData.value = null
      }
    }
  },
  { immediate: true }
)

const closeModal = () => {
  modalInstance.hide()
  emit('close')
}
</script>
