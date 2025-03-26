require('dotenv').config() // Загружаем переменные из .env
const axios = require('axios')

// Базовый URL и токены из переменных окружения с запасными значениями
const BASE_URL = process.env.VITE_BASE_URL + '/nom_list' // Используем VITE_BASE_URL и добавляем /nom_list
const VALID_TOKEN = process.env.VALID_TOKEN // Валидный токен
const INVALID_TOKEN = process.env.INVALID_TOKEN // Невалидный токен

// Функция для выполнения запроса к API
const fetchNomList = async (params) => {
  try {
    const response = await axios.get(BASE_URL, { params }) // Отправляем GET-запрос с параметрами
    return response.data // Возвращаем данные из ответа
  } catch (error) {
    // Обрабатываем ошибку: возвращаем данные ошибки или сообщение
    throw error.response ? error.response.data : error.message
  }
}

// Описываем тесты для API /nom_list
describe('API /nom_list', () => {
  // Тест успешного запроса с валидными параметрами
  test('должен вернуть данные с валидными id, type и token', async () => {
    const params = {
      id: 15450, // ID для запроса
      type: 'kp', // Тип данных
      token: VALID_TOKEN, // Валидный токен
    }

    const data = await fetchNomList(params) // Выполняем запрос

    // Проверяем, что ответ существует и это объект
    expect(data).toBeDefined() // Данные не undefined
    expect(typeof data).toBe('object') // Данные - объект
    expect(data).not.toBeNull() // Данные не null

    // Проверяем наличие table.data и что это массив
    expect(data.table).toBeDefined() // Поле table существует
    expect(Array.isArray(data.table.data)).toBe(true) // table.data - массив

    // Проверяем, что в table.data есть хотя бы один объект с числовым kp_data__id
    const hasNumericId = data.table.data.some(
      (item) => typeof item.kp_data__id === 'number'
    )
    expect(hasNumericId).toBe(true) // Хотя бы один kp_data__id - число
  })

  // Тест с отсутствующим параметром id
  test('должен завершиться ошибкой при отсутствии параметра id', async () => {
    const params = {
      type: 'kp', // Тип данных
      token: VALID_TOKEN, // Валидный токен
    }

    // Ожидаем, что запрос завершится ошибкой с конкретным сообщением
    await expect(fetchNomList(params)).rejects.toMatchObject({
      error: 'Неверный запрос (ошибка синтаксиса, некорректные данные).',
    })
  })

  // Тест с невалидным токеном
  test('должен завершиться ошибкой с невалидным токеном', async () => {
    const params = {
      id: 15450, // ID для запроса
      type: 'kp', // Тип данных
      token: INVALID_TOKEN, // Невалидный токен
    }

    // Ожидаем, что запрос завершится ошибкой с конкретным сообщением
    await expect(fetchNomList(params)).rejects.toMatchObject({
      error: 'Failed to fetch forms from API',
    })
  })

  // Тест с некорректным типом
  test('должен завершиться ошибкой с некорректным типом', async () => {
    const params = {
      id: 15450, // ID для запроса
      type: 'invalid_type', // Некорректный тип
      token: VALID_TOKEN, // Валидный токен
    }

    // Ожидаем, что запрос завершится ошибкой с конкретным сообщением
    await expect(fetchNomList(params)).rejects.toMatchObject({
      error: 'Неверный запрос (ошибка синтаксиса, некорректные данные).',
    })
  })

  // Тест обработки серверной ошибки (мок ответа)
  test('должен обработать серверную ошибку', async () => {
    // Мокаем axios для симуляции ошибки сервера
    jest.spyOn(axios, 'get').mockRejectedValueOnce({
      response: { status: 500, data: { error: 'Server error' } },
    })

    const params = {
      id: 15450, // ID для запроса
      type: 'kp', // Тип данных
      token: VALID_TOKEN, // Валидный токен
    }

    // Ожидаем, что запрос завершится ошибкой с сообщением от сервера
    await expect(fetchNomList(params)).rejects.toMatchObject({
      error: 'Server error',
    })

    axios.get.mockRestore() // Восстанавливаем оригинальную функцию после теста
  })

  // Тест: проверка наличия любого числового link_id в table.data
  test('должен содержать любой числовой link_id в table.data', async () => {
    const params = {
      id: 15450, // ID для запроса
      type: 'kp', // Тип данных
      token: VALID_TOKEN, // Валидный токен
    }

    const data = await fetchNomList(params) // Выполняем запрос

    // Проверяем структуру ответа
    expect(data.table).toBeDefined() // Поле table существует
    expect(Array.isArray(data.table.data)).toBe(true) // table.data - массив

    // Проверяем, что есть хотя бы один объект с числовым kp_data__id
    const hasNumericId = data.table.data.some(
      (item) => typeof item.kp_data__id === 'number'
    )
    expect(hasNumericId).toBe(true) // Хотя бы один kp_data__id - число
  })
})

// Очистка моков после всех тестов
afterAll(() => {
  jest.restoreAllMocks() // Сбрасываем все моки
})
