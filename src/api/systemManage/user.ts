/*
 * @Description 系统管理-用户管理相关接口
 * @Author bihongbin
 * @Date 2020-10-10 14:05:53
 * @LastEditors bihongbin
 * @LastEditTime 2020-11-11 14:48:43
 */

import { AxiosRequestConfig } from 'axios'
import request from '@/utils/request'
import { GlobalConstant } from '@/config'
import { RequestPageType, AnyObjectType, RowStatusType } from '@/typings'

const JSEncrypt = require('node-jsencrypt')
const encrypt = new JSEncrypt()
encrypt.setPublicKey(GlobalConstant.encryptPublicKey)

/**
 * @Description 公司列表
 * @Author bihongbin
 * @Date 2020-10-10 14:50:36
 */
export const getCompany = () => {
  return request<AnyObjectType[]>({
    url: `/rbac/user/company`,
    method: 'get',
  })
}

/**
 * @Description 用户列表
 * @Author bihongbin
 * @Date 2020-10-10 18:12:04
 */
export const getUserList = (data: RequestPageType) => {
  return request({
    url: `/rbac/user`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 用户批量操作接口(锁定，解锁，启用，禁用)
 * @Author bihongbin
 * @Date 2020-10-10 18:19:55
 */
export const switchUserList = (data: RowStatusType) => {
  let type = ''
  switch (data.status) {
    case 0:
      type = 'enable' // 启用
      break
    case 1:
      type = 'disable' // 禁用
      break
    case 2:
      type = 'lock' // 锁定
      break
    case 3:
      type = 'unlock' // 解锁
      break
    default:
      break
  }
  return request({
    url: `/rbac/user/${type}`,
    method: 'put',
    data: data.id,
  })
}

/**
 * @Description 用户角色详情
 * @Author bihongbin
 * @Date 2020-10-12 16:18:54
 */
export const getUserRole = (data: string) => {
  return request<AnyObjectType>({
    url: `/rbac/user/${data}/role`,
    method: 'get',
  })
}

/**
 * @Description 分配角色
 * @Author bihongbin
 * @Date 2020-10-13 17:22:10
 */
export const setUserRole = (data: { id: string; ids: any[] }) => {
  return request({
    url: `/rbac/user/${data.id}/role`,
    method: 'post',
    data: data.ids,
  })
}

/**
 * @Description 重置密码
 * @Author bihongbin
 * @Date 2020-10-12 17:23:18
 */
export const resetPassword = (data: AnyObjectType) => {
  return request<AnyObjectType>({
    url: `/rbac/user/${data.id}/reset-password`,
    method: 'put',
    data,
  })
}

/**
 * @Description 获取用户权限视图
 * @Author bihongbin
 * @Date 2020-10-14 09:25:26
 */
export const getPermissionView = (userId: string) => {
  return request({
    url: `/rbac/user/${userId}/permission`,
    method: 'get',
  })
}

/**
 * @Description 用户新增、编辑、保存、详情、删除
 * @Author bihongbin
 * @Date 2020-10-10 18:23:48
 */
export const handleUserList = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `/rbac/user`,
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
    if (data.password) {
      // 密码加密
      data.password = encrypt.encrypt(data.password)
    }
    basicRequest.data = data
  } else {
    basicRequest.url = `${basicRequest.url}/${data.id}`
  }
  return request<AnyObjectType>(basicRequest)
}
