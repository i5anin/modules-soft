// Список исключённых полей
const excludedFields = [
  'zag_tech_material_id',
  'ordersnom__id',
  'zag_buy_p1',
  'zag_buy_p2',
  'zag_buy_p3',
  'zag_buy_p4',
  'zag_buy_weight',
  'nom_id_nom',
]

/**
 * Функция фильтрации прав доступа к полям
 * @param {Object} fields - Объект с полями и их метаданными
 * @returns {Object} - Обновлённый объект полей с изменёнными permissions
 */
export function filterFieldPermissions(fields) {
  if (!fields || typeof fields !== 'object') {
    throw new Error('Поля должны быть объектом')
  }

  return Object.entries(fields).reduce((updatedFields, [key, value]) => {
    if (!value.permissions) {
      console.warn(`Поле "${key}" не имеет раздела permissions`)
      return updatedFields
    }

    // Если поле в excludedFields, устанавливаем read: false
    if (excludedFields.includes(key)) {
      updatedFields[key] = {
        ...value,
        permissions: {
          ...value.permissions,
          read: false,
        },
      }
    } else {
      // Для всех остальных устанавливаем read: true
      updatedFields[key] = {
        ...value,
        permissions: {
          ...value.permissions,
          read: true,
        },
      }
    }

    return updatedFields
  }, {})
}
