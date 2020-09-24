import { AxiosResponse } from 'axios'
import { Modal, message } from 'antd'
import request from '@/utils/request'
import { GlobalConstant } from '@/config'
import { AnyObjectType, RowStatusType, AjaxResultType } from '@/typings'

const {
  gatewayUrl: { ibfapi },
} = GlobalConstant

/**
 * @Description: 防抖函数(当一个事件持续触发时，指定间隔时间内不用再触发该事件)
 * @Author: bihongbin
 * @Param: {Function} fn
 * @Param: {Number} delay
 * @Date: 2020-05-26 14:16:50
 */
export const debounce = function (this: any, fn: Function, delay: number) {
  let timer: number | null
  return (...args: any[]) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
      timer = null
    }, delay)
  }
}

/**
 * @Description: 节流函数(当一个事件持续触发时，保证一定时间内只执行一次)
 * @Author: bihongbin
 * @Param: {Function} fn
 * @Param: {Number} delay
 * @Date: 2020-05-26 14:15:45
 */
export const throttle = function (this: any, fn: Function, delay: number) {
  let timer: number | null
  return (...args: any[]) => {
    if (!timer) {
      timer = setTimeout(() => {
        fn.apply(this, args)
        timer = null
      }, delay)
    }
  }
}

/**
 * @Description 启用禁用
 * @Author bihongbin
 * @Param { Object } data 接口传参
 * @Param { Function } api 接口函数
 * @Param { Function } callback 接口完成后回调
 * @Date 2020-07-13 17:37:59
 */
export const handleRowEnableDisable = (
  data: RowStatusType,
  api: (param: RowStatusType) => Promise<AxiosResponse<unknown>>,
  callback?: () => void,
) => {
  const { confirm } = Modal
  const contentConfig = {
    content: '',
    messageOk: '',
    messageErr: '',
  }
  // 启用
  if (data.status === 1) {
    contentConfig.content = '请问是否确认启用？'
    contentConfig.messageOk = '启用成功'
    contentConfig.messageErr = '启用失败'
  }
  // 禁用
  if (data.status === 2) {
    contentConfig.content = '请问是否确认禁用？'
    contentConfig.messageOk = '禁用成功'
    contentConfig.messageErr = '禁用失败'
  }
  confirm({
    title: '提示',
    content: contentConfig.content,
    centered: true,
    onOk() {
      return new Promise(async (resolve, reject) => {
        try {
          await api({
            id: data.id,
            status: data.status,
          })
          callback && callback() // 回调
          message.success(contentConfig.messageOk, 1.5)
          resolve()
        } catch (error) {
          reject(new Error(contentConfig.messageErr))
        }
      })
    },
  })
}

/**
 * @Description 删除
 * @Author bihongbin
 * @Param { Array } ids 删除id
 * @Param { Function } api 接口函数
 * @Param { Function } callback 接口完成后回调
 * @Date 2020-07-13 18:43:13
 */
export const handleRowDelete = (
  ids: string[],
  api: (param: string[]) => Promise<AxiosResponse<unknown>>,
  callback?: () => void,
) => {
  const { confirm } = Modal
  if (ids.length) {
    confirm({
      title: '提示',
      width: 360,
      className: 'confirm-modal',
      content: '确定删除吗？',
      centered: true,
      onOk() {
        return new Promise(async (resolve, reject) => {
          try {
            await api(ids)
            callback && callback() // 回调
            message.success('删除成功', 1.5)
            resolve()
          } catch (error) {
            reject(new Error('删除失败'))
          }
        })
      },
    })
  } else {
    message.warn('请选择数据', 1.5)
  }
}

/**
 * @Description 从后端拿数据，任何数组格式的数据转为下拉菜单支持的数据格式
 * @Author bihongbin
 * @Param { String } url 接口地址
 * @Param { Array } params 支持转换的字段，第一个值是label，第二个值是value
 * @Date 2020-08-15 11:47:41
 */
export const getDataTransformSelect = async (
  url: string,
  params: [string, string],
) => {
  try {
    let result: AjaxResultType = await request({
      url: `${ibfapi}${url}`,
      method: 'get',
    })
    return result.data.map((item: AnyObjectType) => ({
      label: item[params[0]],
      value: item[params[1]],
    }))
  } catch (error) {
    return []
  }
}
