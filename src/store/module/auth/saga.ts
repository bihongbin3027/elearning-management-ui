import { put, takeLatest, call } from 'redux-saga/effects'
import { message } from 'antd'
import { getOauthToken, getRootMenuList } from '@/api/user'
import * as types from './types'
import * as actions from './actions'

function* saga() {
  /**
   * @Description 处理登录
   * @Author bihongbin
   * @Date 2020-07-07 14:02:33
   */
  yield takeLatest(types.LOGIN, function* loginSaga(data: types.LoginAction) {
    try {
      yield put(actions.setLoginLoading(true))
      const tokenResult = yield call(getOauthToken, data.payload) // 获取token
      yield put(actions.setUser(tokenResult))
      const menuListResult = yield call(getRootMenuList) // 获取菜单
      yield put(actions.setUserMenu(menuListResult))
      yield put(actions.setLoginLoading(false))
      message.success('登录成功', 1.5)
      window.location.href = '#/index'
    } catch (error) {
      yield put(actions.setVerificationCode()) // 重置验证码和uuid
      yield put(actions.setLoginLoading(false))
    }
  })
}

export default saga
