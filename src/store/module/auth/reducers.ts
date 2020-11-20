import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import * as types from './types'

const initialAuthState: types.InitAuthStateType = {
  loginLoading: false, // 登录页面loading
  user: undefined, // 用户信息
  rootMenuList: [], // 菜单数据
  authToken: undefined, // 用户token
  // 系统信息
  systemInfo: {
    sysName: '',
    sysCode: '',
    companyId: '',
    companyName: '',
    logoImageUrl: '',
  },
  // tab数据相关
  tabLayout: {
    tabList: [
      {
        parentIds: '-1',
        id: '-1',
        pid: '-1',
        name: '首页',
        code: 'INDEX',
        category: 'MENU',
        navigateUrl: '/index',
        interfaceRef: '/Home',
        urlFlag: 0, // 是否外部地址 0:否（内部）, 1:是（外部）
        visibleFlag: 1, // 是否可见，0-否、1=是
        permissionList: [],
        permissionCodeList: [],
        children: [],
      },
    ],
  },
}

const reducer = persistReducer<types.InitAuthStateType, types.AuthActionType>(
  {
    storage,
    key: 'auth',
  },
  (state = initialAuthState, action): types.InitAuthStateType => {
    switch (action.type) {
      // 设置登录页面loading
      case types.SET_LOGIN_LOADING: {
        return {
          ...state,
          loginLoading: action.payload,
        }
      }
      // 设置token
      case types.SET_AUTH_TOKEN: {
        return {
          ...state,
          authToken: action.payload,
        }
      }
      // 设置用户数据
      case types.SET_USER: {
        return {
          ...state,
          user: action.payload,
        }
      }
      // 设置菜单数据
      case types.SET_USER_MENU: {
        return {
          ...state,
          rootMenuList: action.payload,
        }
      }
      // 设置tab数据
      case types.SET_TOP_TAB: {
        return {
          ...state,
          tabLayout: {
            ...state.tabLayout,
            ...action.payload,
          },
        }
      }
      // 设置系统信息
      case types.SET_SYSTEM_INFO: {
        return {
          ...state,
          systemInfo: action.payload,
        }
      }
      // 退出
      case types.LOGOUT: {
        // localStorage.clear() // 清空所有缓存
        return initialAuthState
      }
      default:
        return state
    }
  },
)

export default reducer
