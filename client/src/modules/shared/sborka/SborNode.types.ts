// В файле SborNode.types.ts

export interface Sbor {
  is_sbor: boolean
  ordersnom_id: number
  sbor_tree?: Sbor[] // Рекурсивное определение, чтобы поддерживать вложенные элементы
  [key: string]: any // Разрешаем дополнительные свойства
}

export interface Field {
  name: string
  title: string
  width?: string | null
  edit?: boolean
}
