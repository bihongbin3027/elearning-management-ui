import { call, put, takeEvery } from 'redux-saga/effects'
import * as types from './types'
import * as actions from './actions'
import { getDictionary } from '@/api/user'
import { AjaxResultType, AnyObjectType } from '@/typings'

function* saga() {
  /**
   * @Description 设置任意字典数据，并全局保存
   * @Author bihongbin
   * @Param {Object} data saveName要保存的字段名 code字典code
   * @Date 2020-07-02 09:55:43
   */
  yield takeEvery(types.GET_DICTIONARY_DATA, function* dictionarySaga(
    data: types.GetDictionaryAction,
  ) {
    try {
      const result: AjaxResultType = yield call(getDictionary, {
        parentCode: data.payload.code,
      })
      yield put(
        actions.setDictionary({
          name: data.payload.saveName,
          value: result.data.map((item: AnyObjectType) => ({
            label: item.detCname,
            value: item.detCode,
          })),
        }),
      )
    } catch (error) {
      console.log('查询字典失败')
      yield put(
        actions.setDictionary({
          name: data.payload.saveName,
          value: [],
        }),
      )
    }
  })
}

export default saga
