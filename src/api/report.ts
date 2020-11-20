/*
 * @Description 报表配置接口
 * @Author bihongbin
 * @Date 2020-07-11 13:56:51
 * @LastEditors bihongbin
 * @LastEditTime 2020-10-23 16:00:51
 */

import { AnyObjectType, RequestPageType } from '@/typings'
import request from '@/utils/request'

/**
 * @Description 获取子报表列表
 * @Author bihongbin
 * @Date 2020-07-13 16:39:32
 */
export const getReportConfigSubheadList = (data: RequestPageType) => {
  return request<AnyObjectType>({
    url: `/api/config-report/subhead/list`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 子报表列表删除
 * @Author bihongbin
 * @Date 2020-07-15 14:32:42
 */
export const setReportConfigSubheadDelete = (data: string[]) => {
  return request({
    url: `/api/config-report/subhead/batch/delete`,
    method: 'put',
    data,
  })
}

/**
 * @Description 获取子报表明细列表
 * @Author bihongbin
 * @Date 2020-07-13 18:15:45
 */
export const getReportConfigSubItemList = (data: RequestPageType) => {
  return request({
    url: `/api/config-report/subitem/list`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 子报表明细列表删除
 * @Author bihongbin
 * @Date 2020-07-15 14:35:31
 */
export const setReportConfigSubItemDelete = (data: string[]) => {
  return request({
    url: `/api/config-report/subitem/batch/delete`,
    method: 'put',
    data,
  })
}
