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
            Модальное окно инструмента {{ no }} {{ nomId }}
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
            <table class="table table-sm table-bordered table-hover">
              <thead>
                <tr class="text-center">
                  <!-- Центрируем заголовки -->
                  <th style="width: 1%">#</th>
                  <th style="width: 10%">Т шт. операции</th>
                  <th style="width: 15%">Комментарии оператора</th>
                  <th style="width: 20%">Расположение в дереве инсрумента</th>
                  <th style="width: 25%">Характеристики</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in instrumentData.data.slice(0, 5)"
                  :key="index"
                >
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.t_op }}</td>
                  <td>{{ item.comments_operators }}</td>
                  <td>
                    <ul class="list-group list-group-flush">
                      <li
                        class="list-group-item"
                        v-for="(segment, segmentIndex) in item.path.split(
                          ' > '
                        )"
                        :key="segmentIndex"
                      >
                        {{ segment }}
                      </li>
                    </ul>
                  </td>
                  <td>
                    <ul
                      class="list-group list-group-flush list-group-item-warning"
                    >
                      <li
                        class="list-group-item"
                        v-for="(value, key) in item.property_description"
                        :key="key"
                      >
                        {{ key }}: <b>{{ value }}</b>
                      </li>
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
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
import { onMounted, ref } from 'vue'
import { Modal } from 'bootstrap'
import { fetchInstrumentData } from '../api/tools.js'
import { useRoute } from 'vue-router'

const route = useRoute()

const no = ref(route.params.no)
const nomId = ref(route.params.nomId)

const emit = defineEmits(['close'])

const modalContainer = ref(null)
let modalInstance = null
const instrumentData = ref(null)

onMounted(() => {
  modalInstance = new Modal(modalContainer.value)
  fetchData()
})

const fetchData = async () => {
  if (no.value && nomId.value) {
    try {
      instrumentData.value = await fetchInstrumentData(no.value, nomId.value)
      modalInstance.show()
    } catch (error) {
      console.error('Ошибка при загрузке данных инструмента:', error)
      instrumentData.value = null
    }
  }
}

const closeModal = () => {
  modalInstance.hide()
  emit('close')
}
</script>

<style scoped>
.table {
  width: 100%;
  margin: 20px 0;
}

.table th {
  text-align: center; /* Центрируем текст в заголовках таблицы */
}
</style>
