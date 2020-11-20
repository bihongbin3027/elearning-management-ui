// 设置登录页面loading
export const SET_LOGIN_LOADING = '[SetLoginLoading] Action'

// 设置token
export const SET_AUTH_TOKEN = '[SetAuthToken] Action'

// 设置用户
export const SET_USER = '[SetUser] Action'

// 获取菜单
export const GET_USER_MENU = '[GetUserMenu] Action'

// 设置菜单
export const SET_USER_MENU = '[SetUserMenu] Action'

// 设置菜单tab
export const SET_TOP_TAB = '[SetTopTable] Action'

// 获取系统信息
export const GET_SYSTEM_INFO = '[GetSystemInfo] Action'

// 设置系统信息
export const SET_SYSTEM_INFO = '[SetSystemInfo] Action'

// 登录
export const LOGIN = '[Login] Action'

// 退出
export const LOGOUT = '[Logout] Action'

// 默认数据类型
export interface InitAuthStateType {
  loginLoading: boolean
  user: SetUserPayloadType | undefined
  rootMenuList: SetUserMenuPayloadType[]
  authToken: string | undefined
  systemInfo: {
    sysName: string
    sysCode: string
    companyId: string
    companyName: string
    logoImageUrl: string
  }
  tabLayout: LayoutTabType
}

export interface PermissionButtonCode {
  id: string
  pid: string
  name: string
  category: string
  permissionCode: string
}

export interface SetUserMenuPayloadType {
  parentIds: string
  pid: string
  id: string
  name: string
  code: string
  category: string
  navigateUrl: string
  interfaceRef: string
  urlFlag: 0 | 1
  visibleFlag: 0 | 1
  permissionList?: PermissionButtonCode[]
  permissionCodeList: string[]
  children: SetUserMenuPayloadType[]
}

export interface SetUserPayloadType {
  id: string
  cid: string
  cname: string
  userName: string
  gender: number
  mobilePhone: string
  orgName: string
  workNumber: string
  email: string
  workDuty: string
  roleNames: string[]
  permissionGrade: string
}

export interface LayoutTabType {
  tabList: SetUserMenuPayloadType[]
}

export interface SetLoginLoadingAction {
  type: typeof SET_LOGIN_LOADING
  payload: InitAuthStateType['loginLoading']
}

export interface SetAuthTokenAction {
  type: typeof SET_AUTH_TOKEN
  payload: string
}

export interface SetUserAction {
  type: typeof SET_USER
  payload: SetUserPayloadType
}

export interface GetUserMenuAction {
  type: typeof GET_USER_MENU
  payload: (() => void) | undefined
}

export interface SetUserMenuAction {
  type: typeof SET_USER_MENU
  payload: SetUserMenuPayloadType[]
}

export interface SetTopTabAction {
  type: typeof SET_TOP_TAB
  payload: LayoutTabType
}

export interface GetSystemInfoAction {
  type: typeof GET_SYSTEM_INFO
}

export interface SetSystemInfoAction {
  type: typeof SET_SYSTEM_INFO
  payload: InitAuthStateType['systemInfo']
}

export interface LoginAction {
  type: typeof LOGIN
  payload: string
}

export interface LogoutAction {
  type: typeof LOGOUT
}

// 导出action类型
export type AuthActionType =
  | SetLoginLoadingAction
  | SetAuthTokenAction
  | SetUserAction
  | GetUserMenuAction
  | SetUserMenuAction
  | SetTopTabAction
  | SetSystemInfoAction
  | LoginAction
  | LogoutAction
