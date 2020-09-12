// 设置登录页面loading
export const SET_LOGIN_LOADING = '[SetLoginLoading] Action'

// 设置验证码
export const SET_VERIFICATION_CODE = '[SetVerificationCode Action]'

// 设置用户数据
export const SET_USER = '[SetUser] Action'

// 设置菜单数据
export const SET_USER_MENU = '[SetUserMenu] Action'

// 设置菜单tab
export const SET_TOP_TAB = '[SetTopTable] Action'

// 登录
export const LOGIN = '[Login] Action'
// 退出
export const LOGOUT = '[Logout] Action'

// 默认数据类型
export interface InitAuthStateType {
  loginLoading: SetLoginLoadingPayloadType
  verificationCode: {
    uuid: string
    img: string
  }
  user:
    | {
        userId: string
        fullname: string
      }
    | undefined
  rootMenuList: SetUserMenuPayloadType[]
  authToken: undefined | string
  tokenType: undefined | string
  tabLayout: LayoutTabType
}

type PermissionsType = {
  actionCode: string
  havePermission: boolean
  param:
    | {
        [key: string]: any
      }
    | string
}

export interface SetUserMenuPayloadType {
  name: string
  path: string
  component: string
  menuParam: {
    sourceType?: string
    businessObj?: string
    detCode?: string
    loadType?: string
    dataFlag?: string
    reportCode?: string
  }
  children: SetUserMenuPayloadType[]
  permissions: PermissionsType[]
  permissionsActionCode: string[]
  active: boolean
  homePage: boolean
  href: string
  icon: string
  parentPath: string
  selected: boolean
  seqSort: number
  resourceId: number
}

export type SetLoginLoadingPayloadType = boolean
export interface SetUserPayloadType {
  access_token: string
  token_type: string
  xing: string
}

export interface LayoutTabType {
  current: number
  tabList: SetUserMenuPayloadType[]
}

export interface LoginParamsType {
  grant_type: string
  uuid: string
  username: string
  password: string
  imgCode: string
}

export interface SetLoginLoadingAction {
  type: typeof SET_LOGIN_LOADING
  payload: SetLoginLoadingPayloadType
}

export interface SetVerificationCodeAction {
  type: typeof SET_VERIFICATION_CODE
}

export interface SetUserAction {
  type: typeof SET_USER
  payload: SetUserPayloadType
}

export interface SetUserMenuAction {
  type: typeof SET_USER_MENU
  payload: SetUserMenuPayloadType[]
}

export interface SetTopTabAction {
  type: typeof SET_TOP_TAB
  payload: LayoutTabType
}

export interface LoginAction {
  type: typeof LOGIN
  payload: LoginParamsType
}

export interface LogoutAction {
  type: typeof LOGOUT
  payload: any
}

// 导出action类型
export type AuthActionType =
  | SetLoginLoadingAction
  | SetVerificationCodeAction
  | SetUserAction
  | SetUserMenuAction
  | SetTopTabAction
  | LoginAction
  | LogoutAction
