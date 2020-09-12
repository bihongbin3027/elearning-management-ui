import { EnhancedStore } from '@reduxjs/toolkit'
import { Persistor } from 'redux-persist/es/types'

// 从类型 T 中排除是 K 的类型
export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export type AnyObjectType = {
  [key: string]: any
}

export interface AppType {
  store: EnhancedStore
  persistor: Persistor
  basename: string
}

export type RequestPageType =
  | {
      page: number
      size: number
    }
  | AnyObjectType
  | undefined

export interface PaginationType {
  total: number
  current: number
  pageSize: number
}

export interface SelectType {
  label: string
  value: string | number
}

export interface AjaxResultType {
  code?: number
  data?: any
  message?: string | undefined
  total?: number
}

export interface RowStatusType {
  id: string
  status: number
}
