/*
 * @Description 系统管理-菜单管理相关接口
 * @Author bihongbin
 * @Date 2020-10-15 09:23:18
 * @LastEditors bihongbin
 * @LastEditTime 2020-10-27 15:33:30
 */

import { AxiosRequestConfig } from 'axios'
import request from '@/utils/request'
import { handleRowStatus } from '@/utils'
import {
  AnyObjectType,
  RequestPageType,
  SetRowStateType,
  RowStatusType,
} from '@/typings'

/**
 * @Description 菜单树
 * @Author bihongbin
 * @Date 2020-10-15 09:24:27
 */
export const getMenuTreeList = () => {
  return request<AnyObjectType[]>({
    url: `/rbac/menu/tree`,
    method: 'get',
  })
}

/**
 * @Description 菜单树删除
 * @Author bihongbin
 * @Date 2020-10-16 10:24:33
 */
export const deleteMenuTreeList = (data: string[]) => {
  return request({
    url: `/rbac/menu`,
    method: 'delete',
    data,
  })
}

/**
 * @Description 菜单树拖拽更新
 * @Author bihongbin
 * @Date 2020-10-21 11:09:25
 * @param {AnyObjectType} data
 */
export const dropTreeUpdate = (data: AnyObjectType) => {
  return request({
    url: `/rbac/menu/${data.id}/move`,
    method: 'put',
    data: data.data,
  })
}

/**
 * @Description 菜单树挂起、启用
 * @Author bihongbin
 * @Date 2020-10-16 13:51:24
 */
export const switchMenuTreeList = (data: SetRowStateType) => {
  return request({
    url: `/rbac/menu/${data.type}`,
    method: 'put',
    data: data.ids,
  })
}

/**
 * @Description 菜单树新增、编辑、保存、详情
 * @Author bihongbin
 * @Date 2020-10-15 11:48:03
 */
export const handleMenuList = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `/rbac/menu`,
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

/**
 * @Description 菜单权限列表
 * @Author bihongbin
 * @Date 2020-10-15 11:49:53
 */
export const getMenuPermissionList = (data: RequestPageType) => {
  return request<AnyObjectType>({
    url: `/rbac/menu/permission`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 新增菜单权限码
 * @Author bihongbin
 * @Date 2020-10-16 18:01:02
 */
export const addMenuPermissionList = (data: AnyObjectType) => {
  return request<AnyObjectType>({
    url: `/rbac/menu/${data.id}/permission`,
    method: 'post',
    data: data.params,
  })
}

/**
 * @Description 新增菜单权限码回显
 * @Author bihongbin
 * @Date 2020-10-19 09:35:53
 */
export const addMenuPermissionView = (data: AnyObjectType) => {
  return request<AnyObjectType>({
    url: `/rbac/menu/permission/view`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 基础权限列表
 * @Author bihongbin
 * @Date 2020-10-16 15:18:31
 */
export const getBasicButtonList = (data: AnyObjectType) => {
  return request<AnyObjectType>({
    url: `/rbac/button`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 基础权限批量操作接口(挂起，启用)
 * @Author bihongbin
 * @Date 2020-10-26 16:00:48
 */
export const switchBasicButtonRowsList = (data: RowStatusType) => {
  return handleRowStatus('/rbac/button', data)
}

/**
 * @Description 基础权限新增、编辑、查询、删除
 * @Author bihongbin
 * @Date 2020-10-26 15:30:22
 */
export const handleBasicButtonList = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `/rbac/button`,
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

/**
 * @Description 数据权限列表
 * @Author bihongbin
 * @Date 2020-10-16 15:24:00
 */
export const getDataButtonList = (data: AnyObjectType) => {
  return request<AnyObjectType>({
    url: `/rbac/data-rule`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 数据权限批量操作接口(挂起，启用)
 * @Author bihongbin
 * @Date 2020-10-26 14:41:10
 */
export const switchDataRowsList = (data: RowStatusType) => {
  return handleRowStatus('/rbac/data-rule', data)
}

/**
 * @Description 数据权限新增、编辑、查询、删除
 * @Author bihongbin
 * @Date 2020-10-26 16:33:39
 */
export const handleDataButtonList = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `rbac/data-rule`,
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

/**
 * @Description 资源权限列表
 * @Author bihongbin
 * @Date 2020-10-16 15:25:07
 */
export const getResourceButtonMenuList = (data: AnyObjectType) => {
  return request<AnyObjectType>({
    url: `/rbac/resource`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 资源权限批量操作接口(挂起，启用)
 * @Author bihongbin
 * @Date 2020-10-27 15:32:56
 */
export const switchResourceRowsList = (data: RowStatusType) => {
  return handleRowStatus('/rbac/resource', data)
}

/**
 * @Description 资源权限新增、编辑、查询、删除
 * @Author bihongbin
 * @Date 2020-10-27 15:32:19
 */
export const handleResourceButtonList = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `rbac/resource`,
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
