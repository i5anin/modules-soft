export interface Field {
  name: string
  title: string
  edit: boolean
}

export type FieldValues = Record<string, string | boolean>
