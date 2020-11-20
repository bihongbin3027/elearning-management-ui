import * as types from './types'

// 设置登录页面loading
export const setLoginLoading = (
  data: types.SetLoginLoadingAction['payload'],
): types.SetLoginLoadingAction => ({
  type: types.SET_LOGIN_LOADING,
  payload: data,
})

// 设置token
export const setAuthToken = (
  data: types.SetAuthTokenAction['payload'],
): types.SetAuthTokenAction => ({
  type: types.SET_AUTH_TOKEN,
  payload: data,
})

// 设置用户信息
export const setUser = (
  data: types.SetUserAction['payload'],
): types.SetUserAction => ({
  type: types.SET_USER,
  payload: data,
})

// 获取菜单数据
export const getUserMenu = (
  callBack?: types.GetUserMenuAction['payload'],
): types.GetUserMenuAction => ({
  type: types.GET_USER_MENU,
  payload: callBack,
})

// 设置菜单数据
export const setUserMenu = (
  data: types.SetUserMenuAction['payload'],
): types.SetUserMenuAction => ({
  type: types.SET_USER_MENU,
  payload: data,
})

// 设置tab数据
export const setTopTab = (
  data: types.SetTopTabAction['payload'],
): types.SetTopTabAction => ({
  type: types.SET_TOP_TAB,
  payload: data,
})

// 获取系统信息
export const getSystemInfo = () => ({
  type: types.GET_SYSTEM_INFO,
})

// 设置系统信息
export const setSystemInfo = (
  data: types.SetSystemInfoAction['payload'],
): types.SetSystemInfoAction => ({
  type: types.SET_SYSTEM_INFO,
  payload: data,
})

// 登录
export const login = (
  data: types.LoginAction['payload'],
): types.LoginAction => ({
  type: types.LOGIN,
  payload: data,
})

// 退出
export const logout = (): types.LogoutAction => ({ type: types.LOGOUT })
