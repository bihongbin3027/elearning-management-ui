/*
 * @Description 系统管理-模块管理相关接口
 * @Author bihongbin
 * @Date 2020-10-20 18:15:53
 * @LastEditors bihongbin
 * @LastEditTime 2020-11-09 18:49:35
 */

import request from '@/utils/request'
import { AxiosRequestConfig } from 'axios'
import { AnyObjectType, RequestPageType } from '@/typings'

/**
 * @Description 模块列表
 * @Author bihongbin
 * @Date 2020-10-13 14:43:29
 */
export const getModuleList = (data: RequestPageType) => {
  return request<AnyObjectType>({
    url: `/rbac/module`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 获取模块下的系统
 * @Author bihongbin
 * @Date 2020-10-28 14:19:53
 */
export const getModuleSystem = (data: AnyObjectType) => {
  return request<AnyObjectType[]>({
    url: `/rbac/module/${data.id}/system`,
    method: 'get',
  })
}

/**
 * @Description 配置模块下的系统
 * @Author bihongbin
 * @Date 2020-10-28 17:44:42
 */
export const setModuleSystem = (data: AnyObjectType) => {
  return request<AnyObjectType>({
    url: `/rbac/module/${data.id}/system`,
    method: 'post',
    data: data.ids,
  })
}

/**
 * @Description 模块新增、编辑、保存、详情
 * @Author bihongbin
 * @Date 2020-10-20 18:16:13
 */
export const handleModuleList = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `/rbac/module`,
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
