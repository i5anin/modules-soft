// types.ts или ModalOrder.ts

export interface Field {
  name: string
  title: string
  update: boolean
}

export type FieldValues = Record<string, string | boolean>

export interface Header {
  fields: Record<string, Field>
  data: Array<Record<string, any>>
}

export interface TableData {
  fields: Record<string, Field>
  data: Array<Record<string, any>>
  title: string
  error?: boolean
}

export interface ModalOrder {
  header: Header
  table_cal?: TableData
  strat?: TableData
  tpd?: TableData
}
