import { all } from 'redux-saga/effects'
import { combineReducers } from 'redux'
import auth from '@/store/module/auth/index'
import layout from '@/store/module/layout/index'

export const rootReducer = combineReducers({
  auth: auth.reducer,
  layout: layout.reducer,
})

export type RootStateType = ReturnType<typeof rootReducer> // 自动推算rootState类型

export function* rootSaga() {
  yield all([auth.saga(), layout.saga()])
}
