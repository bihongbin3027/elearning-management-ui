import * as types from './types'

// 读取字典
export const getDictionary = (
  data: types.GetDictionaryPayloadType,
): types.GetDictionaryAction => ({
  type: types.GET_DICTIONARY_DATA,
  payload: data,
})

// 设置字典
export const setDictionary = (
  data: types.SetDictionaryPayloadType,
): types.SetDictionaryAction => ({
  type: types.SET_DICTIONARY_DATA,
  payload: data,
})

// 设置左侧菜单展开收缩
export const setLeftSiderOpen = (
  data: boolean,
): types.SetLeftSiderOpenAction => ({
  type: types.SET_LEFT_SIDER_OPEN,
  payload: data,
})

// 设置修改密码弹窗相关数据
export const setPasswordModal = (
  data: types.SetPassWordModalPayloadType,
): types.SetPasswordModalAction => ({
  type: types.SET_PASSWORD_MODAL,
  payload: data,
})
