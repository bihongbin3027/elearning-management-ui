/**
 * @Description 系统管理-权限管理相关接口
 * @Author bihongbin
 * @Date 2020-10-16 17:10:35
 */

import request from '@/utils/request'
import { AxiosRequestConfig } from 'axios'
import { AnyObjectType } from '@/typings'

/**
 * @Description 权限编辑、保存、详情
 * @Author bihongbin
 * @Date 2020-10-16 17:11:32
 */
export const handlePermissionList = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `/rbac/permission`,
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
