/*
 * @Description 报表配置接口
 * @Author bihongbin
 * @Date 2020-07-11 13:56:51
 * @LastEditors bihongbin
 * @LastEditTime 2020-07-21 11:43:21
 */

import { AxiosRequestConfig } from 'axios'
import { RequestPageType, RowStatusType, AnyObjectType } from '@/typings'
import request from '@/utils/request'
import { GlobalConstant } from '@/config'

const {
  gatewayUrl: { ibfapi },
} = GlobalConstant

/**
 * @Description 获取报表配置主列表
 * @Author bihongbin
 * @Date 2020-07-11 14:05:04
 */
export const getConfigReportList = (data: RequestPageType) => {
  return request({
    url: `${ibfapi}/api/config-report/config/list`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 报表配置主列表启用禁用
 * @Author bihongbin
 * @Date 2020-07-11 15:10:49
 */
export const setReportConfigStatus = (data: RowStatusType) => {
  return request({
    url: `${ibfapi}/api/config-report/config/status`,
    method: 'put',
    params: data,
  })
}

/**
 * @Description 报表配置主列表删除
 * @Author bihongbin
 * @Date 2020-07-15 14:26:00
 */
export const setReportConfigDelete = (data: string[]) => {
  return request({
    url: `${ibfapi}/api/config-report/config/batch/delete`,
    method: 'put',
    data,
  })
}

/**
 * @Description 报表配置主列表增、改、查
 * @Author bihongbin
 * @Date 2020-07-11 16:51:14
 */
export const handleReportConfigList = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `${ibfapi}/api/config-report/config`,
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
 * @Description 获取子报表列表
 * @Author bihongbin
 * @Date 2020-07-13 16:39:32
 */
export const getReportConfigSubheadList = (data: RequestPageType) => {
  return request({
    url: `${ibfapi}/api/config-report/subhead/list`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 设置子报表列表启用禁用
 * @Author bihongbin
 * @Date 2020-07-13 17:21:10
 */
export const setReportConfigSubheadStatus = (data: RowStatusType) => {
  return request({
    url: `${ibfapi}/api/config-report/subhead/status`,
    method: 'put',
    params: data,
  })
}

/**
 * @Description 子报表列表删除
 * @Author bihongbin
 * @Date 2020-07-15 14:32:42
 */
export const setReportConfigSubheadDelete = (data: string[]) => {
  return request({
    url: `${ibfapi}/api/config-report/subhead/batch/delete`,
    method: 'put',
    data,
  })
}

/**
 * @Description 子报表列表增、改、查
 * @Author bihongbin
 * @Date 2020-07-13 16:09:03
 */
export const handleReportConfigSubheadList = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `${ibfapi}/api/config-report/subhead`,
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
 * @Description 获取子报表明细列表
 * @Author bihongbin
 * @Date 2020-07-13 18:15:45
 */
export const getReportConfigSubItemList = (data: RequestPageType) => {
  return request({
    url: `${ibfapi}/api/config-report/subitem/list`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 设置子报表明细列表启用禁用
 * @Author bihongbin
 * @Date 2020-07-13 18:16:36
 */
export const setReportConfigSubItemStatus = (data: RowStatusType) => {
  return request({
    url: `${ibfapi}/api/config-report/subitem/status`,
    method: 'put',
    params: data,
  })
}

/**
 * @Description 子报表明细列表删除
 * @Author bihongbin
 * @Date 2020-07-15 14:35:31
 */
export const setReportConfigSubItemDelete = (data: string[]) => {
  return request({
    url: `${ibfapi}/api/config-report/subitem/batch/delete`,
    method: 'put',
    data,
  })
}

/**
 * @Description 子报表明细列表增、改、查
 * @Author bihongbin
 * @Date 2020-07-13 18:17:26
 */
export const handleReportConfigSubItemList = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `${ibfapi}/api/config-report/subitem`,
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
 * @Description 获取动态报表-报表配置
 * @Author bihongbin
 * @Date 2020-07-21 11:41:12
 */
export const getTestReportConfig = (data: AnyObjectType) => {
  return request({
    url: `${ibfapi}/api/report/config`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 获取动态报表-报表查询
 * @Author bihongbin
 * @Date 2020-07-21 11:41:12
 */
export const getTestReportList = (data: AnyObjectType) => {
  return request({
    url: `${ibfapi}/api/report/list`,
    method: 'post',
    data,
  })
}

/**
 * @Description 获取动态报表-报表解析
 * @Author bihongbin
 * @Date 2020-07-21 11:41:12
 */
export const getTestReportSql = (data: AnyObjectType) => {
  return request({
    url: `${ibfapi}/api/report/sql`,
    method: 'get',
    params: data,
  })
}
