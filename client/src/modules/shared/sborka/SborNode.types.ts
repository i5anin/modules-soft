// В файле SborNode.types.ts

export interface Sbor {
  is_sbor: boolean
  ordersnom_id: number
  sbor_tree?: Sbor[]
  [key: string]: string | number | boolean | Sbor | Sbor[]
}

export interface Field {
  name: string
  title: string
  width?: string | null
  edit?: boolean
}
