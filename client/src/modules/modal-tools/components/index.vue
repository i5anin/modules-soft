<template>
  <div
    class="modal fade"
    id="orderModal"
    tabindex="-1"
    aria-labelledby="orderModalLabel"
    aria-hidden="true"
    ref="modalContainer"
  >
    <div class="modal-dialog modal-fullscreen">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="orderModalLabel">
            Инструмент (операция {{ no }}, уникальный id операции {{ nomId }})
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
            <div class="row">
              <div class="col-md-6">
                <!-- Временная таблица добавленного инструмента -->
                <div v-if="addedInstruments.length > 0">
                  <h5>Добавленные инструменты:</h5>
                  <table
                    class="table table-sm table-bordered table-hover table-striped mt-3"
                  >
                    <thead>
                      <tr class="text-center">
                        <th style="width: 1%">#</th>
                        <th style="width: 1%">Т шт.</th>
                        <th style="width: 20%">
                          Расположение в дереве инструмента
                        </th>
                        <th style="width: 20%">Характеристики</th>
                        <th style="width: 1%">Удалить</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="(item, index) in addedInstruments"
                        :key="generateUniqueId(item)"
                      >
                        <td class="text-center align-middle">
                          {{ index + 1 }}
                        </td>
                        <td class="text-center align-middle">
                          {{ item.t_op }}
                        </td>
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
                            class="list-group list-group-flush list-group-item-success"
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
                        <td class="text-center align-middle">
                          <button
                            type="button"
                            class="btn btn-circle"
                            @click="removeInstrument(item)"
                          >
                            <svg-icon
                              type="mdi"
                              :path="mdiDelete"
                              color="red"
                            />
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="col-md-6">
                <!-- Исходная таблица инструментов -->
                <h5>Предложенный инструмент:</h5>
                <table
                  class="table table-sm table-bordered table-hover table-striped mt-4"
                >
                  <thead>
                    <tr class="text-center">
                      <th style="width: 1%">#</th>
                      <th style="width: 1%">Т шт.</th>
                      <th style="width: 30%">Комментарии оператора</th>
                      <th style="width: 20%">
                        Расположение в дереве инструмента
                      </th>
                      <th style="width: 20%">Характеристики</th>
                      <th style="width: 1%">Добавить</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in filteredInstruments"
                      :key="generateUniqueId(item)"
                    >
                      <td class="text-center align-middle">{{ index + 1 }}</td>
                      <td class="text-center align-middle">{{ item.t_op }}</td>
                      <td>
                        <ul class="list-group list-group-flush mt-2">
                          <!-- Показываем первые три комментария по умолчанию -->
                          <li
                            class="list-group-item"
                            v-for="(
                              comment, cIndex
                            ) in item.comments_operators.slice(0, 3)"
                            :key="cIndex"
                            style="font-size: 12px; padding: 2px"
                          >
                            {{ comment }}
                          </li>
                        </ul>

                        <!-- Кнопка для раскрытия оставшихся комментариев -->
                        <div
                          v-if="item.comments_operators.length > 3"
                          class="text-center mt-2"
                        >
                          <button
                            class="btn btn-sm btn-outline-secondary"
                            type="button"
                            data-bs-toggle="collapse"
                            :data-bs-target="
                              '#collapseComments' + generateUniqueId(item)
                            "
                            aria-expanded="false"
                            :aria-controls="
                              'collapseComments' + generateUniqueId(item)
                            "
                          >
                            Показать остальные
                          </button>
                          <div
                            :id="'collapseComments' + generateUniqueId(item)"
                            class="collapse mt-2"
                          >
                            <ul class="list-group list-group-flush">
                              <li
                                class="list-group-item"
                                v-for="(
                                  comment, subIndex
                                ) in item.comments_operators.slice(3)"
                                :key="subIndex"
                                style="font-size: 13px"
                              >
                                {{ comment }}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </td>

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
                      <td class="text-center align-middle">
                        <button
                          type="button"
                          class="btn btn-circle"
                          @click="addInstrument(item)"
                        >
                          <svg-icon
                            type="mdi"
                            :path="mdiPlusCircle"
                            color="green"
                          />
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
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
import { onMounted, ref, computed } from 'vue'
import { Modal } from 'bootstrap'
import { fetchInstrumentData } from '../api/tools.js'
import { useRoute } from 'vue-router'
import SvgIcon from '@jamescoyle/vue-icon'
import { mdiPlusCircle, mdiDelete } from '@mdi/js'

const route = useRoute()

const no = ref(route.params.no)
const nomId = ref(route.params.nomId)
const emit = defineEmits(['close'])

const modalContainer = ref(null)
let modalInstance = null
const instrumentData = ref(null)
const addedInstruments = ref([]) // Массив для хранения добавленных инструментов

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

// Функция для генерации уникального идентификатора
const generateUniqueId = (item) => {
  return `${item.tool_group_id}-${JSON.stringify(item.property_description)}`
}

// Вычисляемое свойство для фильтрации инструментов
const filteredInstruments = computed(() => {
  if (!instrumentData.value) return []
  return instrumentData.value.data.filter((item) => {
    const itemId = generateUniqueId(item)
    return !addedInstruments.value.some(
      (addedItem) => generateUniqueId(addedItem) === itemId
    )
  })
})

// Функция для добавления инструмента
const addInstrument = (item) => {
  addedInstruments.value.push(item)
}

// Функция для удаления инструмента
const removeInstrument = (item) => {
  addedInstruments.value = addedInstruments.value.filter(
    (addedItem) => generateUniqueId(addedItem) !== generateUniqueId(item)
  )
}

// Функция для закрытия модального окна
const closeModal = () => {
  emit('close')
  modalInstance.hide()
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

.btn-circle {
  background-color: transparent;
  border: none;
}

.btn-circle:hover {
  background-color: transparent;
}

@media (max-width: 767px) {
  .col-md-6 {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

.modal-fullscreen {
  max-width: 100%;
  margin: 0;
}

.modal-content {
  height: 100vh;
}
</style>
