// types.ts
export interface ModalOrderHeader {
  fields: Record<string, { label: string; type: string; edit: boolean }>
  data: Array<Record<string, any>>
}

export interface ModalOrderTable {
  title: string
  fields: Record<string, { label: string; type: string }>
  data: Array<Record<string, any>>
}

export interface ModalOrder {
  header: ModalOrderHeader
  table_cal?: ModalOrderTable
  strat?: ModalOrderTable
}

export interface GetModalOrderByIdParams {
  orderId: number | string
  type: string
  role: string
}
