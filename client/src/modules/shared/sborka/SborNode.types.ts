// SborNode.types.ts

// Интерфейс для данных Sbor
export interface Sbor {
  is_sbor: boolean
  ordersnom_id: number
  sbor_tree?: Sbor[]
  [key: string]: any // Динамическое свойство для других полей
}

// Интерфейс для полей (fields)
export interface Field {
  name: string
  title: string
  width?: string | null
  edit?: boolean
}
