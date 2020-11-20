import * as types from './types'

// 读取字典
export const getDictionary = (
  data: types.GetDictionaryAction['payload'],
): types.GetDictionaryAction => ({
  type: types.GET_DICTIONARY_DATA,
  payload: data,
})

// 设置字典
export const setDictionary = (
  data: types.SetDictionaryAction['payload'],
): types.SetDictionaryAction => ({
  type: types.SET_DICTIONARY_DATA,
  payload: data,
})

// 获取公司数据
export const getCompanyData = (): types.GetCompanyAction => ({
  type: types.GET_ESTIMATES_COMPANY_SELECT_DATA,
})

// 设置公司数据
export const setCompanyData = (
  data: types.SetCompanyAction['payload'],
): types.SetCompanyAction => ({
  type: types.SET_ESTIMATES_COMPANY_SELECT_DATA,
  payload: data,
})

// 设置左侧菜单展开收缩
export const setLeftSiderOpen = (
  data: types.SetLeftSiderOpenAction['payload'],
): types.SetLeftSiderOpenAction => ({
  type: types.SET_LEFT_SIDER_OPEN,
  payload: data,
})

// 设置修改密码弹窗相关数据
export const setPasswordModal = (
  data: types.SetPasswordModalAction['payload'],
): types.SetPasswordModalAction => ({
  type: types.SET_PASSWORD_MODAL,
  payload: data,
})
