/*
 * @Description 用户信息相关接口
 * @Author bihongbin
 * @Date 2020-06-03 11:35:38
 * @LastEditors bihongbin
 * @LastEditTime 2020-08-15 14:11:57
 */

import qs from 'qs'
import request from '@/utils/request'
import { GlobalConstant } from '@/config'
import { LoginParamsType } from '@/store/module/auth/types'
import { AnyObjectType } from '@/typings'

const {
  gatewayUrl: { ibfapi, sibeuaaapi },
} = GlobalConstant

/**
 * @Description 登录获取token
 * @Author bihongbin
 * @Param {Object} LoginParamsType
 * @Return {Promise}
 * @Date 2020-06-02 11:32:56
 */
export const getOauthToken = (data: LoginParamsType) => {
  return request({
    url: `${sibeuaaapi}/oauth/token`,
    method: 'post',
    data: qs.stringify(data),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
}

/**
 * @Description 获取角色菜单
 * @Author bihongbin
 * @Date 2020-06-15 09:20:57
 */
export const getRootMenuList = () => {
  return request({
    url: `${sibeuaaapi}/api/systemUsers/menuList`,
    method: 'get',
    params: {
      appCode: 'IBF',
    },
  })
}

/**
 * @Description 获取用户授权的公司
 * @Author bihongbin
 * @Date 2020-06-19 09:07:25
 */
export const getSystemUsersCompany = () => {
  return request({
    url: `${sibeuaaapi}/api/systemUsers/company`,
    method: 'get',
  })
}

/**
 * @Description 查询字典
 * @Author bihongbin
 * @Date 2020-06-30 18:08:38
 */
export const getDictionary = (data: AnyObjectType) => {
  return request({
    url: `${ibfapi}/api/system/com-type-det`,
    method: 'get',
    params: data,
  })
}
