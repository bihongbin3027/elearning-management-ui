/*
 * @Description 文件管理接口
 * @Author bihongbin
 * @Date 2020-11-13 17:07:16
 * @LastEditors bihongbin
 * @LastEditTime 2020-11-19 15:13:19
 */

import { AxiosRequestConfig } from 'axios'
import request from '@/utils/request'
import { RequestPageType, ResultPageType, AnyObjectType } from '@/typings'
import { FileLevelType } from '@/pages/FileCenter'

/**
 * @Description 获取文件夹列表
 * @Author bihongbin
 * @Date 2020-11-13 17:10:12
 * @param {RequestPageType} data
 */
export const getFileFolderList = (data?: {
  cId?: string
  name?: string
  parentId?: string
  status?: number
}) => {
  return request<ResultPageType<any>>({
    url: `/file/fileFolder`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 文件夹新增、编辑、保存、详情、删除
 * @Author bihongbin
 * @Date 2020-11-13 17:13:15
 */
export const handleFileFolderList = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `/file/fileFolder`,
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
    // 编辑
    if (methodsLowerCase === 'put') {
      basicRequest.url = `${basicRequest.url}/${data.status}`
      basicRequest.data = data.data
    } else {
      basicRequest.data = data
    }
  } else {
    basicRequest.url = `${basicRequest.url}/${data.id}`
  }
  return request<AnyObjectType>(basicRequest)
}

/**
 * @Description 批量修改文件夹状态
 * @Author bihongbin
 * @Date 2020-11-17 14:56:28
 */
export const editFileFolderListStatus = (data: {
  status: number
  data: AnyObjectType
}) => {
  return request({
    url: `/file/fileFolder/updateStatus/${data.status}`,
    method: 'put',
    data: data.data,
  })
}

/**
 * @Description 获取文件列表
 * @Author bihongbin
 * @Date 2020-11-13 17:11:45
 * @param {RequestPageType} data
 */
export const getFileList = (data: RequestPageType) => {
  return request<ResultPageType<any>>({
    url: `/file/file`,
    method: 'get',
    params: data,
  })
}

/**
 * @Description 文件编辑、保存、详情、删除
 * @Author bihongbin
 * @Date 2020-11-13 17:12:20
 */
export const handleFileList = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `/file/file`,
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
    if (methodsLowerCase === 'delete') {
      basicRequest.url = `${basicRequest.url}/${data.folderId}`
    }
    basicRequest.data = data
  } else {
    basicRequest.url = `${basicRequest.url}/${data.id}/${data.folderId}`
  }
  return request<AnyObjectType>(basicRequest)
}

/**
 * @Description 批量修改文件状态
 * @Author bihongbin
 * @Date 2020-11-17 14:56:28
 */
export const editFileListStatus = (data: {
  status: number
  folderId?: string
  data: AnyObjectType
}) => {
  return request({
    url: `/file/file/updateStatus/${data.status}/${data.folderId}`,
    method: 'put',
    data: data.data,
  })
}

/**
 * @Description 回收站查询、删除、还原
 * @Author bihongbin
 * @Date 2020-11-18 17:46:23
 */
export const handleFileRelationList = (
  data: AnyObjectType,
  method: AxiosRequestConfig['method'],
) => {
  const basicRequest = {
    url: `/api/file/file-folder-relation`,
    method: method,
    data: {},
    params: {},
  }
  let methodsLowerCase = method?.toLowerCase()
  if (
    methodsLowerCase === 'post' ||
    methodsLowerCase === 'put' ||
    methodsLowerCase === 'delete' ||
    methodsLowerCase === 'patch'
  ) {
    if (methodsLowerCase === 'put') {
      basicRequest.url = `${basicRequest.url}/recover`
    }
    basicRequest.data = data.ids
  } else {
    basicRequest.params = data
  }
  return request<AnyObjectType>(basicRequest)
}

/**
 * @Description 获取文件夹树结构
 * @Author bihongbin
 * @Date 2020-11-17 11:16:22
 */
export const getFileFolderTree = (id: string | string[]) => {
  return request<FileLevelType>({
    url: `/file/fileFolder/tree/${id}`,
    method: 'get',
  })
}
