import _ from 'lodash'
import { put, takeEvery, call } from 'redux-saga/effects'
import { message } from 'antd'
import store from '@/store'
import { getLoginUserInfo, getRootMenuList, getSystemInfo } from '@/api/layout'
import * as authTypes from './types'
import * as authActions from './actions'

function* saga() {
  yield takeEvery(authTypes.GET_SYSTEM_INFO, function* () {
    try {
      const systemInfo = yield call(getSystemInfo)
      yield put(authActions.setSystemInfo(systemInfo.data))
    } catch (error) {
      console.log('获取系统信息失败')
    }
  })

  /**
   * @Description 获取、更新菜单数据
   * @Author bihongbin
   * @Date 2020-11-04 10:54:25
   */
  yield takeEvery(authTypes.GET_USER_MENU, function* (
    data: authTypes.GetUserMenuAction,
  ) {
    try {
      // 获取菜单数据
      const menu = yield call(getRootMenuList)
      // 递归菜单，添加parentIds，用来控制菜单展开
      const deepMenuList = (menu: authTypes.SetUserMenuPayloadType[]) => {
        const data = [...menu]
        const deepMenu = (
          menuList: authTypes.SetUserMenuPayloadType[],
          parentId?: string,
        ) => {
          for (let item of menuList) {
            item.parentIds = parentId ? `${parentId}_${item.id}` : item.id
            // 基础权限码转换成字符串数组
            if (_.isArray(item.permissionList)) {
              item.permissionCodeList = item.permissionList.map(
                (item: authTypes.PermissionButtonCode) => item.permissionCode,
              )
            } else {
              item.permissionList = []
              item.permissionCodeList = []
            }
            if (item.children) {
              deepMenu(item.children, item.parentIds)
            }
          }
        }
        deepMenu(data)
        return data
      }
      // 关闭按钮loading
      store.dispatch({
        type: authTypes.SET_LOGIN_LOADING,
        payload: false,
      })
      if (_.isArray(menu.data)) {
        // 更新菜单数据
        yield put(authActions.setUserMenu(deepMenuList(menu.data)))
        // 回调
        if (data.payload) {
          data.payload()
        }
      } else {
        message.warn('当前无可用菜单', 1.5)
        window.location.href = '#/index'
      }
    } catch (error) {
      console.log('获取更新菜单失败')
    }
  })

  /**
   * @Description 处理登录
   * @Author bihongbin
   * @Date 2020-07-07 14:02:33
   */
  yield takeEvery(authTypes.LOGIN, function* (data: authTypes.LoginAction) {
    try {
      // token
      yield put(authActions.setAuthToken(data.payload))
      // 用户信息
      const user = yield call(getLoginUserInfo)
      yield put(authActions.setUser(user.data))
      // 系统信息
      yield put(authActions.getSystemInfo())
      // 用户菜单
      yield put(
        authActions.getUserMenu(() => {
          message.success('登录成功', 1.5)
          window.location.href = '#/index'
        }),
      )
    } catch (error) {
      // 清除恢复默认redux数据
      yield put(authActions.logout())
    }
  })
}

export default saga
