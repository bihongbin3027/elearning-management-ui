import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import * as types from './types'
import { v4 as uuidV4 } from 'uuid'

const initialAuthState = {
  loginLoading: false, // 登录页面loading
  // 验证码和uuid
  verificationCode: {
    uuid: '',
    img: '',
  },
  user: undefined, // 用户信息
  rootMenuList: [], // 菜单数据
  authToken: undefined, // 用户token
  tokenType: undefined, // token类型
  // tab数据相关
  tabLayout: {
    current: 0,
    tabList: [
      {
        component: '/Home',
        name: '首页',
        path: '/index',
        menuParam: {},
        children: [],
        permissions: [],
        permissionsActionCode: [],
        active: false,
        homePage: false,
        href: '/index',
        icon: 'icon-home',
        parentPath: '',
        selected: false,
        seqSort: 10,
        resourceId: 12,
        leafFlag: 0,
        urlFlag: false,
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
      // 设置验证码和uuid
      case types.SET_VERIFICATION_CODE: {
        const baseUrl = `${process.env.REACT_APP_API_URL}/sibeuaaapi/img/createCheckCode?`
        const baseUuid = uuidV4()
        return {
          ...state,
          verificationCode: {
            uuid: baseUuid,
            img: `${baseUrl}cacheBuster=${new Date().getTime()}&&uuid=${baseUuid}`,
          },
        }
      }
      // 设置用户数据
      case types.SET_USER: {
        const { access_token, token_type, xing } = action.payload
        const user = decodeURIComponent(escape(window.atob(xing))).split('_') // base64转utf-8
        return {
          ...state,
          authToken: access_token,
          tokenType: token_type,
          user: {
            userId: user[0],
            fullname: user[1],
          },
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
