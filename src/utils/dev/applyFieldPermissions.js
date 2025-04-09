/**
 * Конфигурация исключений:
 * - excludedKeys: Точные ключи, которые нужно исключить.
 * - patterns: Шаблоны для частичного совпадения ключей.
 */
const exclusionConfig = {
  excludedKeys: [],
  patterns: [], // Регулярные выражения для поиска в ключах
}

/**
 * Обрабатывает массив объектов fields, изменяя permissions.read на true
 * для всех объектов, кроме указанных в исключениях.
 *
 * @param {Array} fields - Массив объектов с полями.
 * @param {Object} config - Конфигурация исключений.
 * @returns {Array} - Новый массив объектов с изменениями.
 */
export function processFields(fields, config = exclusionConfig) {
  const { excludedKeys, patterns } = config

  if (!Array.isArray(fields)) {
    console.error(
      'processFields: Ожидается массив объектов, но получено:',
      fields
    )
    throw new Error('processFields: Expected an array of fields')
  }

  return fields.map((field) => {
    if (typeof field !== 'object' || field === null) {
      console.error('Некорректное поле:', field)
      throw new Error('processFields: Field is not a valid object')
    }

    // Проверка на точное совпадение ключа
    if (excludedKeys.includes(field.key)) {
      return { ...field, modified: false }
    }

    // Проверка на совпадение с шаблонами
    if (patterns.some((pattern) => pattern.test(field.key))) {
      return { ...field, modified: false }
    }

    // Если поле содержит permissions, изменяем read и помечаем как modified
    if (field.permissions) {
      return {
        ...field,
        permissions: {
          ...field.permissions,
          read: true,
        },
        modified: true,
      }
    }
    return { ...field, modified: false }
  })
}
