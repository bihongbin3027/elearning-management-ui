import { SelectType } from '@/typings'

// 读取字典数据
export const GET_DICTIONARY_DATA = '[GetDictionaryData] Action'

// 设置字典数据
export const SET_DICTIONARY_DATA = '[SetDictionaryData] Action'

// 获取公司数据
export const GET_ESTIMATES_COMPANY_SELECT_DATA =
  '[GetEstimatesCompanySelectData] Action'

// 设置公司数据
export const SET_ESTIMATES_COMPANY_SELECT_DATA =
  '[SetEstimatesCompanySelectData] Action'

// 设置菜单展开收缩
export const SET_LEFT_SIDER_OPEN = '[SetLeftSiderOpen] Action'

// 设置修改密码弹窗
export const SET_PASSWORD_MODAL = '[SetPasswordModal Action]'

export interface SetPassWordModalPayloadType {
  visible?: boolean
  saveLoading?: boolean
}

export type SetCompanyPayloadType = SelectType[]

// 默认数据类型
export type InitDictionaryType = {
  companyData: SetCompanyPayloadType
  openSider: boolean
  passwordModal: SetPassWordModalPayloadType
  useLevelSelectList: SelectType[]
  orgCategorySelectList: SelectType[]
  dutyCategorySelectList: SelectType[]
  appTypesSelectList: SelectType[]
  resourceClassSelectList: SelectType[]
  requestMethodSelectList: SelectType[]
  contentSelectList: SelectType[]
  [key: string]: any
}

export interface GetDictionaryAction {
  type: typeof GET_DICTIONARY_DATA
  payload: {
    saveName: string
    code: string
  }
}

export interface SetDictionaryAction {
  type: typeof SET_DICTIONARY_DATA
  payload: {
    name: string
    value: SelectType[]
  }
}

export interface GetCompanyAction {
  type: typeof GET_ESTIMATES_COMPANY_SELECT_DATA
}

export interface SetCompanyAction {
  type: typeof SET_ESTIMATES_COMPANY_SELECT_DATA
  payload: SetCompanyPayloadType
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
  | GetCompanyAction
  | SetCompanyAction
  | SetLeftSiderOpenAction
  | SetPasswordModalAction
