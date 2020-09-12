import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import * as types from './types'

const initialAuthState = {
  billTypeSelectData: [], // 账单类型下拉菜单数据
  openSider: false, // 左侧菜单展开收缩
  // 修改密码模态窗数据
  passwordModal: {
    visible: false,
    saveLoading: false,
  },
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
