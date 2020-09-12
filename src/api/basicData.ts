/*
 * @Description 基础数据接口
 * @Author bihongbin
 * @Date 2020-07-24 10:17:07
 * @LastEditors bihongbin
 * @LastEditTime 2020-07-27 17:12:24
 */

import { AxiosRequestConfig } from 'axios'
import { RequestPageType, RowStatusType, AnyObjectType } from '@/typings'
import request from '@/utils/request'
import { GlobalConstant } from '@/config'

const {
  gatewayUrl: { ibfapi },
} = GlobalConstant

/**
 * @Description 获取基础数据-金额和数量分类资料主列表
 * @Author bihongbin
 * @Date 2020-07-24 10:08:35
 */
export const getBasicQtyList = (data: RequestPageType) => {
  return request({
    url: `${ibfapi}/api/base/qty-config/list`,
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
    url: `${ibfapi}/api/base/qty-config/status`,
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
    url: `${ibfapi}/api/base/qty-config/batch/delete`,
    method: 'put',
    data,
  })
}

/**
 * @Description 基础数据-金额和数量分类资料主列表详情
 * @Author bihongbin
 * @Date 2020-07-27 15:07:58
 */
export const getBasicQtyDetails = (id: string) => {
  return request({
    url: `${ibfapi}/api/base/qty-config/detail/${id}`,
    method: 'get',
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
    url: `${ibfapi}/api/base/qty-config`,
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
  return request(basicRequest)
}

/**
 * @Description 获取基础数据-数据维度主列表
 * @Author bihongbin
 * @Date 2020-07-25 15:28:02
 */
export const getBasicDimensionList = (data: RequestPageType) => {
  return request({
    url: `${ibfapi}/api/base/qty-config-dimension/list`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 基础数据-数据维度主列表启用禁用
 * @Author bihongbin
 * @Date 2020-07-25 15:29:11
 */
export const setBasicDimensionStatus = (data: RowStatusType) => {
  return request({
    url: `${ibfapi}/api/base/qty-config-dimension/status`,
    method: 'put',
    params: data,
  })
}

/**
 * @Description 基础数据-数据维度主列表删除
 * @Author bihongbin
 * @Date 2020-07-25 15:30:22
 */
export const deleteBasicDimensionList = (data: string[]) => {
  return request({
    url: `${ibfapi}/api/base/qty-config-dimension/batch/delete`,
    method: 'put',
    data,
  })
}

/**
 * @Description 基础数据-数据维度主列表增、改、查
 * @Author bihongbin
 * @Date 2020-07-25 15:30:58
 */
export const handleBasicDimensionList = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `${ibfapi}/api/base/qty-config-dimension`,
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
  return request(basicRequest)
}

/**
 * @Description 获取基础数据-处理步骤主列表
 * @Author bihongbin
 * @Date 2020-07-25 16:09:31
 */
export const getBasicStepList = (data: RequestPageType) => {
  return request({
    url: `${ibfapi}/api/base/qty-config-step/list`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 获取基础数据-处理步骤主列表启用禁用
 * @Author bihongbin
 * @Date 2020-07-25 16:11:04
 */
export const setBasicStepStatus = (data: RowStatusType) => {
  return request({
    url: `${ibfapi}/api/base/qty-config-step/status`,
    method: 'put',
    params: data,
  })
}

/**
 * @Description 获取基础数据-处理步骤主列表删除
 * @Author bihongbin
 * @Date 2020-07-25 16:11:23
 */
export const deleteBasicStepList = (data: string[]) => {
  return request({
    url: `${ibfapi}/api/base/qty-config-step/batch/delete`,
    method: 'put',
    data,
  })
}

/**
 * @Description 基础数据-处理步骤主列表详情
 * @Author bihongbin
 * @Date 2020-07-27 17:11:51
 */
export const getBasicStepDetails = (id: string) => {
  return request({
    url: `${ibfapi}/api/base/qty-config-step/detail/${id}`,
    method: 'get',
  })
}

/**
 * @Description 获取基础数据-处理步骤主列表增、改、查
 * @Author bihongbin
 * @Date 2020-07-25 16:12:26
 */
export const handleBasicStepList = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `${ibfapi}/api/base/qty-config-step`,
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
  return request(basicRequest)
}
