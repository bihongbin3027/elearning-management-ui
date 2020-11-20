import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import * as types from './types'
import * as actions from './actions'
import { getDataTransformSelect } from '@/utils'
import { getDictionary } from '@/api/layout'
import { AjaxResultType, AnyObjectType } from '@/typings'

function* saga() {
  /**
   * @Description 设置任意字典数据，并全局保存
   * @Author bihongbin
   * @Param {Object} data saveName要保存的字段名 code字典code
   * @Date 2020-07-02 09:55:43
   */
  yield takeEvery(types.GET_DICTIONARY_DATA, function* (
    data: types.GetDictionaryAction,
  ) {
    try {
      const result: AjaxResultType = yield call(getDictionary, {
        typeCode: data.payload.code,
      })
      yield put(
        actions.setDictionary({
          name: data.payload.saveName,
          value: result.data.content.map((item: AnyObjectType) => ({
            label: item.detCname,
            value: item.detCode,
          })),
        }),
      )
    } catch (error) {
      console.log('查询字典失败', error)
      yield put(
        actions.setDictionary({
          name: data.payload.saveName,
          value: [],
        }),
      )
    }
  })

  /**
   * @Description 获取公司数据
   * @Author bihongbin
   * @Date 2020-07-07 14:02:00
   */
  yield takeLatest(types.GET_ESTIMATES_COMPANY_SELECT_DATA, function* () {
    try {
      let companyResult = yield call(
        getDataTransformSelect,
        '/rbac/user/company',
        ['companyName', 'companyCode'],
      )
      yield put(actions.setCompanyData(companyResult))
    } catch (error) {
      console.log('获取公司失败', error)
    }
  })
}

export default saga
