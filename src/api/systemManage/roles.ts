/*
 * @Description 系统管理-角色管理相关接口
 * @Author bihongbin
 * @Date 2020-10-13 14:41:40
 * @LastEditors bihongbin
 * @LastEditTime 2020-10-26 14:52:33
 */

import { AxiosRequestConfig } from 'axios'
import request from '@/utils/request'
import { handleRowStatus } from '@/utils'
import { AnyObjectType, RequestPageType, RowStatusType } from '@/typings'

/**
 * @Description 角色列表
 * @Author bihongbin
 * @Date 2020-10-13 14:43:29
 */
export const getRoleList = (data: RequestPageType) => {
  return request<AnyObjectType>({
    url: `/rbac/role`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 角色批量操作接口(挂起，启用)
 * @Author bihongbin
 * @Date 2020-10-14 11:06:25
 */
export const switchUserList = (data: RowStatusType) => {
  return handleRowStatus('/rbac/role', data)
}

/**
 * @Description 获取角色权限授权菜单
 * @Author bihongbin
 * @Date 2020-10-19 14:31:54
 */
export const getRoleTreeView = (data: AnyObjectType) => {
  return request<AnyObjectType>({
    url: `/rbac/role/${data.id}/permission/view`,
    method: 'get',
    params: data.params,
  })
}

/**
 * @Description 角色权限视图
 * @Author bihongbin
 * @Date 2020-10-20 11:40:21
 */
export const getPermissionView = (id: string) => {
  return request<AnyObjectType>({
    url: `/rbac/role/${id}/permission`,
    method: 'get',
  })
}

/**
 * @Description 获取角色用户组
 * @Author bihongbin
 * @Date 2020-10-20 10:15:12
 */
export const getUserGroupTreeView = (data: AnyObjectType) => {
  return request<AnyObjectType>({
    url: `/rbac/user-group/${data.id}/role`,
    method: 'get',
  })
}

/**
 * @Description 保存角色权限授权
 * @Author bihongbin
 * @Date 2020-10-19 16:57:38
 */
export const saveRoleTreeView = (data: AnyObjectType) => {
  return request<AnyObjectType>({
    url: `/rbac/role/${data.id}/permission`,
    method: 'post',
    data: data.params,
  })
}

/**
 * @Description 保存用户组权限授权
 * @Author bihongbin
 * @Date 2020-10-20 10:45:09
 */
export const saveUserGroupTreeView = (data: AnyObjectType) => {
  return request<AnyObjectType>({
    url: `/rbac/user-group/role`,
    method: 'post',
    data,
  })
}

/**
 * @Description 角色新增、编辑、保存、详情、删除
 * @Author bihongbin
 * @Date 2020-10-10 18:23:48
 */
export const handleRoleList = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `/rbac/role`,
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
