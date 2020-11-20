/*
 * @Description 用户信息相关接口
 * @Author bihongbin
 * @Date 2020-06-03 11:35:38
 * @LastEditors bihongbin
 * @LastEditTime 2020-11-11 14:42:13
 */

import request from '@/utils/request'
import { AnyObjectType } from '@/typings'
import { LoginFormRelevantType, MsgCodeType } from '@/pages/Login'
import { GlobalConstant } from '@/config'

const JSEncrypt = require('node-jsencrypt')
const encrypt = new JSEncrypt()
encrypt.setPublicKey(GlobalConstant.encryptPublicKey)

/**
 * @Description 密码登录
 * @Author bihongbin
 * @Date 2020-10-30 09:49:50
 */
export const passWordLogin = (data: { userName: string; password: string }) => {
  return request<string>({
    url: '/rbac/login',
    method: 'post',
    data: {
      userName: data.userName,
      password: encrypt.encrypt(data.password),
    },
  })
}

/**
 * @Description 手机短信注册
 * @Author bihongbin
 * @Date 2020-10-30 10:00:44
 */
export const smsRegister = (
  data: Pick<LoginFormRelevantType, 'mobilePhone' | 'msgCode' | 'password'>,
) => {
  return request({
    url: '/rbac/register',
    method: 'post',
    data: {
      ...data,
      password: encrypt.encrypt(data.password),
    },
  })
}

/**
 * @Description 登录页重置密码
 * @Author bihongbin
 * @Date 2020-10-30 14:53:02
 */
export const resetPassword = (
  data: Pick<LoginFormRelevantType, 'mobilePhone' | 'msgCode' | 'password'>,
) => {
  return request({
    url: '/rbac/reset-passwd',
    method: 'post',
    data: {
      ...data,
      password: encrypt.encrypt(data.password),
    },
  })
}

/**
 * @Description 获取短信验证码
 * @Author bihongbin
 * @Date 2020-10-30 11:41:45
 */
export const getPhoneCode = (
  data: Pick<LoginFormRelevantType, 'mobilePhone'> & {
    type: MsgCodeType
  },
) => {
  return request<AnyObjectType>({
    url: `/message/sms/${data.mobilePhone}/code`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 验证短信验证码
 * @Author bihongbin
 * @Date 2020-10-30 15:56:19
 */
export const msgCodeValidate = (
  data: Pick<LoginFormRelevantType, 'mobilePhone' | 'msgCode'> & {
    type: MsgCodeType
  },
) => {
  return request({
    url: `/message/sms/${data.mobilePhone}/validate`,
    method: 'get',
    params: data,
  })
}
/**
 * @Description 短信登录
 * @Author bihongbin
 * @Date 2020-10-30 13:49:39
 */
export const smsLogin = (
  data: Pick<LoginFormRelevantType, 'mobilePhone' | 'msgCode'>,
) => {
  return request<string>({
    url: `/rbac/sms/login`,
    method: 'post',
    data,
  })
}

/**
 * @Description 退出登录
 * @Author bihongbin
 * @Date 2020-11-06 15:17:24
 */
export const logout = () => {
  return request<string>({
    url: `/rbac/logout`,
    method: 'post',
  })
}

/**
 * @Description 查询字典
 * @Author bihongbin
 * @Date 2020-06-30 18:08:38
 */
export const getDictionary = (data: AnyObjectType) => {
  return request({
    url: `/dict/typeDet`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 获取当前用户信息
 * @Author bihongbin
 * @Date 2020-10-30 16:59:00
 */
export const getLoginUserInfo = () => {
  return request({
    url: `/rbac/user/info`,
    method: 'get',
  })
}

/**
 * @Description 获取当前用户菜单
 * @Author bihongbin
 * @Date 2020-06-15 09:20:57
 */
export const getRootMenuList = () => {
  return request({
    url: `/rbac/user/permission`,
    method: 'get',
  })
}

/**
 * @Description 获取用户信息
 * @Author bihongbin
 * @Date 2020-11-04 14:09:57
 */
export const getSystemInfo = () => {
  return request({
    url: `/rbac/system/info`,
    method: 'get',
  })
}

/**
 * @Description 重置用户密码
 * @Author bihongbin
 * @Date 2020-11-04 15:47:30
 */
export const resetUserPassword = (data: {
  userId: string
  password: string
}) => {
  return request({
    url: `/rbac/user/${data.userId}/reset-password`,
    method: 'put',
    data: {
      ...data,
      password: encrypt.encrypt(data.password),
    },
  })
}
