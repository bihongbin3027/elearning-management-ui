import * as types from './types'

// 设置登录页面loading
export const setLoginLoading = (
  data: types.SetLoginLoadingPayloadType,
): types.SetLoginLoadingAction => ({
  type: types.SET_LOGIN_LOADING,
  payload: data,
})

// 设置验证码和uuid
export const setVerificationCode = () => ({
  type: types.SET_VERIFICATION_CODE,
})

// 设置用户数据
export const setUser = (
  data: types.SetUserPayloadType,
): types.SetUserAction => ({
  type: types.SET_USER,
  payload: data,
})

// 设置菜单数据
export const setUserMenu = (
  data: types.SetUserMenuPayloadType[],
): types.SetUserMenuAction => ({
  type: types.SET_USER_MENU,
  payload: data,
})

// 设置tab数据
export const setTopTab = (
  data: types.LayoutTabType,
): types.SetTopTabAction => ({
  type: types.SET_TOP_TAB,
  payload: data,
})

// 登录
export const login = (data: types.LoginParamsType) => ({
  type: types.LOGIN,
  payload: data,
})

// 退出
export const logout = () => ({ type: types.LOGOUT })
