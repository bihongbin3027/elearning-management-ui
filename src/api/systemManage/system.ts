/*
 * @Description 系统管理-系统管理相关接口
 * @Author bihongbin
 * @Date 2020-10-14 14:00:31
 * @LastEditors bihongbin
 * @LastEditTime 2020-11-09 18:31:14
 */

import { AxiosRequestConfig } from 'axios'
import request from '@/utils/request'
import { AnyObjectType, RequestPageType } from '@/typings'

/**
 * @Description 系统列表
 * @Author bihongbin
 * @Date 2020-10-13 14:43:29
 */
export const getSystemList = (data: RequestPageType) => {
  return request<AnyObjectType>({
    url: `/rbac/system`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 获取系统下的模块
 * @Author bihongbin
 * @Date 2020-10-28 14:19:53
 */
export const getSystemModule = (data: AnyObjectType) => {
  return request<AnyObjectType[]>({
    url: `/rbac/system/${data.id}/module`,
    method: 'get',
  })
}

/**
 * @Description 配置系统下的模块
 * @Author bihongbin
 * @Date 2020-10-28 17:44:42
 */
export const setSystemModule = (data: AnyObjectType) => {
  return request<AnyObjectType>({
    url: `/rbac/system/${data.id}/module`,
    method: 'post',
    data: data.ids,
  })
}

/**
 * @Description 删除系统下的模块
 * @Author bihongbin
 * @Date 2020-10-28 17:44:42
 */
export const deleteSystemModule = (data: string[]) => {
  return request<AnyObjectType>({
    url: `/rbac/system/module`,
    method: 'delete',
    data,
  })
}

/**
 * @Description 资源权限新增、编辑、查询、删除
 * @Author bihongbin
 * @Date 2020-10-27 15:32:19
 */
export const handleSystemList = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `/rbac/system`,
    method: method,
    data: {},
  }
  let methodsLowerCase = method?.toLowerCase()
  if (
    methodsLowerCase === 'post' ||
    methodsLowerCase === 'put' ||
    methodsLowerCase === 'delete' ||
    methodsLowerCase === 'patch'
  ) {
    basicRequest.data = data
  } else {
    basicRequest.url = `${basicRequest.url}/${data.id}`
  }
  return request<AnyObjectType>(basicRequest)
}
