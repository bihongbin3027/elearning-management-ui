import { AnyObjectType } from '@/typings'

export interface EditorCallType {
  getEditorObject: () => AnyObjectType
  setEditorValue: (value: string) => void
  getEditorValue: () => string
}
