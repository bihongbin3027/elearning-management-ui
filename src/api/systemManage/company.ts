/*
 * @Description 系统管理-公司管理相关接口
 * @Author bihongbin
 * @Date 2020-10-22 15:32:56
 * @LastEditors bihongbin
 * @LastEditTime 2020-10-26 16:00:59
 */

import { AxiosRequestConfig } from 'axios'
import request from '@/utils/request'
import { handleRowStatus } from '@/utils'
import { RequestPageType, AnyObjectType, RowStatusType } from '@/typings'

/**
 * @Description 公司列表
 * @Author bihongbin
 * @Date 2020-10-10 14:50:36
 */
export const getCompanyList = (data: RequestPageType) => {
  return request<AnyObjectType[]>({
    url: `/rbac/company`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 公司批量操作接口(挂起，启用)
 * @Author bihongbin
 * @Date 2020-10-26 14:41:10
 */
export const switchCompanyRowsList = (data: RowStatusType) => {
  return handleRowStatus('/rbac/company', data)
}

/**
 * @Description 公司新增、编辑、保存、详情、删除
 * @Author bihongbin
 * @Date 2020-10-10 18:23:48
 */
export const handleCompanyList = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `/rbac/company`,
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
