import { SelectType } from '@/typings'

// 读取字典数据
export const GET_DICTIONARY_DATA = '[GetDictionaryData] Action'

// 设置字典数据
export const SET_DICTIONARY_DATA = '[SetDictionaryData] Action'

// 设置菜单展开收缩
export const SET_LEFT_SIDER_OPEN = '[SetLeftSiderOpen] Action'

// 设置修改密码弹窗
export const SET_PASSWORD_MODAL = '[SetPasswordModal Action]'

export interface SetDictionaryPayloadType {
  name: string
  value: SelectType[]
}

export interface GetDictionaryPayloadType {
  saveName: string
  code: string
}

export interface SetPassWordModalPayloadType {
  visible?: boolean
  saveLoading?: boolean
}

// 默认数据类型
export type InitDictionaryType = {
  openSider: boolean
  passwordModal: SetPassWordModalPayloadType
  [key: string]: any
}

export interface GetDictionaryAction {
  type: typeof GET_DICTIONARY_DATA
  payload: GetDictionaryPayloadType
}

export interface SetDictionaryAction {
  type: typeof SET_DICTIONARY_DATA
  payload: SetDictionaryPayloadType
}

export interface SetLeftSiderOpenAction {
  type: typeof SET_LEFT_SIDER_OPEN
  payload: boolean
}

export interface SetPasswordModalAction {
  type: typeof SET_PASSWORD_MODAL
  payload: SetPassWordModalPayloadType
}

// 导出action类型
export type DictionaryActionType =
  | GetDictionaryAction
  | SetDictionaryAction
  | SetLeftSiderOpenAction
  | SetPasswordModalAction
