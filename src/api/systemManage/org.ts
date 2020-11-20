/*
 * @Description 系统管理-组织管理相关接口
 * @Author bihongbin
 * @Date 2020-10-12 10:12:46
 * @LastEditors bihongbin
 * @LastEditTime 2020-10-26 11:53:25
 */

import request from '@/utils/request'
import { AxiosRequestConfig } from 'axios'
import { AnyObjectType, RequestPageType } from '@/typings'

/**
 * @Description 获取组织机构树
 * @Author bihongbin
 * @Date 2020-10-12 10:13:48
 */
export const getOrganization = (data: AnyObjectType = { type: 0 }) => {
  return request<AnyObjectType[]>({
    url: `/rbac/organization/tree`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 菜单树删除
 * @Author bihongbin
 * @Date 2020-10-21 17:38:22
 */
export const deleteOrgTreeList = (data: string[]) => {
  return request({
    url: `/rbac/organization`,
    method: 'delete',
    data,
  })
}

/**
 * @Description 拖拽移动菜单树
 * @Author bihongbin
 * @Date 2020-10-26 11:52:17
 */
export const dropTreeUpdate = (data: AnyObjectType) => {
  return request({
    url: `/rbac/organization/${data.id}/move`,
    method: 'put',
    data: data.data,
  })
}

/**
 * @Description 获取组织下的用户关系信息
 * @Author bihongbin
 * @Date 2020-10-21 14:49:00
 */
export const getOrgUser = (data: RequestPageType) => {
  return request({
    url: `/rbac/organization/user`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 添加组织下的用户关系信息
 * @Author bihongbin
 * @Date 2020-10-21 17:32:14
 * @param {string} data
 */
export const addOrgUser = (data: AnyObjectType) => {
  return request({
    url: `rbac/organization/${data.id}/user`,
    method: 'post',
    data: data.data,
  })
}

/**
 * @Description 修改组织下的用户关系
 * @Author bihongbin
 * @Date 2020-10-22 14:29:38
 */
export const editOrgUser = (data: AnyObjectType) => {
  return request({
    url: `/rbac/organization/user`,
    method: 'put',
    data,
  })
}

/**
 * @Description 删除组织下的用户关系信息
 * @Author bihongbin
 * @Date 2020-10-21 17:32:14
 * @param {string} data
 */
export const deleteOrgUser = (data: string[]) => {
  return request({
    url: `/rbac/organization/user`,
    method: 'delete',
    data,
  })
}

/**
 * @Description 菜单树新增、编辑、保存、详情
 * @Author bihongbin
 * @Date 2020-10-21 17:30:30
 */
export const handleOrgTree = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `/rbac/organization`,
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
