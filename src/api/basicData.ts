/*
 * @Description 基础数据接口
 * @Author bihongbin
 * @Date 2020-07-24 10:17:07
 * @LastEditors bihongbin
 * @LastEditTime 2020-10-23 15:59:40
 */

import { AxiosRequestConfig } from 'axios'
import { RequestPageType, RowStatusType, AnyObjectType } from '@/typings'
import request from '@/utils/request'

/**
 * @Description 获取基础数据-金额和数量分类资料主列表
 * @Author bihongbin
 * @Date 2020-07-24 10:08:35
 */
export const getBasicQtyList = (data: RequestPageType) => {
  return request({
    url: `/rbac/user`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 基础数据-金额和数量分类资料主列表启用禁用
 * @Author bihongbin
 * @Date 2020-07-24 10:19:01
 */
export const setBasicQtyStatus = (data: RowStatusType) => {
  return request({
    url: `/api/base/qty-config/status`,
    method: 'put',
    params: data,
  })
}

/**
 * @Description 基础数据-金额和数量分类资料主列表删除
 * @Author bihongbin
 * @Date 2020-07-24 10:20:35
 */
export const deleteBasicQtyList = (data: string[]) => {
  return request({
    url: `/api/base/qty-config/batch/delete`,
    method: 'put',
    data,
  })
}

/**
 * @Description 基础数据-金额和数量分类资料主列表增、改、查
 * @Author bihongbin
 * @Date 2020-07-24 10:21:14
 */
export const handleBasicQtyList = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `/api/base/qty-config`,
    method: method,
    data: {},
    params: {},
  }
  let methodsLowerCase = method?.toLowerCase()
  if (
    methodsLowerCase === 'post' ||
    methodsLowerCase === 'put' ||
    methodsLowerCase === 'patch'
  ) {
    basicRequest.data = data
  } else {
    basicRequest.url = `${basicRequest.url}/${data.id}`
  }
  return request<AnyObjectType>(basicRequest)
}
