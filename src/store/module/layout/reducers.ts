import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import * as types from './types'

const initialAuthState: types.InitDictionaryType = {
  companyData: [], // 公司数据
  openSider: false, // 左侧菜单展开收缩
  // 修改密码模态窗数据
  passwordModal: {
    visible: false,
    saveLoading: false,
  },
  useLevelSelectList: [], // 系统管理-使用等级
  orgCategorySelectList: [], // 系统管理-组织类型
  dutyCategorySelectList: [], // 系统管理-工作岗位
  appTypesSelectList: [], // 系统管理-应用类型
  resourceClassSelectList: [], // 系统管理-资源分类
  requestMethodSelectList: [], // 系统管理-请求方式
  contentSelectList: [], // 系统管理-响应类型
}

const reducer = persistReducer<
  types.InitDictionaryType,
  types.DictionaryActionType
>(
  {
    storage,
    key: 'layout',
  },
  (state = initialAuthState, action): types.InitDictionaryType => {
    switch (action.type) {
      // 设置字典数据
      case types.SET_DICTIONARY_DATA: {
        return {
          ...state,
          [action.payload.name]: action.payload.value,
        }
      }
      // 设置公司数据
      case types.SET_ESTIMATES_COMPANY_SELECT_DATA: {
        return { ...state, companyData: action.payload }
      }
      // 设置左侧菜单展开收缩
      case types.SET_LEFT_SIDER_OPEN: {
        return {
          ...state,
          openSider: action.payload,
        }
      }
      // 设置修改密码模态窗数据
      case types.SET_PASSWORD_MODAL: {
        return {
          ...state,
          passwordModal: {
            ...state.passwordModal,
            ...action.payload,
          },
        }
      }
      default:
        return state
    }
  },
)

export default reducer
