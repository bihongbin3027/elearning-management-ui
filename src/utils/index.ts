import { AxiosRequestConfig } from 'axios'
import { Modal, message } from 'antd'
import store from '@/store'
import request from '@/utils/request'
import { FormListType } from '@/components/GenerateForm'
import { SetUserMenuPayloadType } from '@/store/module/auth/types'
import { AnyObjectType, RowStatusType, AjaxResultType } from '@/typings'
import { TreeType } from '@/components/Tree/interface'

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
 * @Description 树格式数据转换
 * @Author bihongbin
 * @Param { Array } data 树数据
 * @Param { String } name 转换显示的name名
 * @Param { Boolean } keyExtra 为key添加额外参数，防止出现相同的key，或当数据没有id是需要设置为true
 * @Date 2020-10-10 15:52:39
 */
export const transformTreeData = (
  data: AnyObjectType[],
  name: string,
  keyExtra?: boolean,
) => {
  let eachTree = (list: AnyObjectType[], mark: string = '0') => {
    for (let [index, item] of list.entries()) {
      item.title = item[name]
      item.key = keyExtra ? `${mark}_${index}` : item.id
      item.isLocked = false
      if (item.children) {
        eachTree(item.children, item.key)
      }
    }
  }
  eachTree([...data])
  return data as TreeType[]
}

/**
 * @Description 挂起和启用
 * @Author bihongbin
 * @Date 2020-10-26 14:43:31
 */
export const handleRowStatus = (url: string, data: RowStatusType) => {
  let type = ''
  switch (data.status) {
    case 1:
      type = 'pending' // 挂起
      break
    case 2:
      type = 'recover' // 启用
      break
    default:
      break
  }
  return request({
    url: `${url}/${type}`,
    method: 'put',
    data: data.id,
  })
}

/**
 * @Description 启用、禁用、解锁、锁定
 * @Author bihongbin
 * @Param { Object } data 接口传参
 * @Param { Function } api 接口函数
 * @Param { Function } callback 接口完成后回调
 * @Date 2020-07-13 17:37:59
 */
export const handleRowEnableDisable = (
  data: RowStatusType,
  api: (param: RowStatusType) => Promise<AjaxResultType>,
  callback?: () => void,
  textStatus?: string[],
) => {
  const { confirm } = Modal
  const contentConfig = {
    content: '',
    messageOk: '',
    messageErr: '',
  }
  if (!textStatus) {
    textStatus = ['启用', '禁用', '锁定', '解锁']
  }
  contentConfig.content = `请问是否确认${textStatus[data.status]}？`
  contentConfig.messageOk = `${textStatus[data.status]}成功`
  contentConfig.messageErr = `${textStatus[data.status]}失败`
  confirm({
    title: '提示',
    width: 360,
    className: 'confirm-modal',
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
  api: (
    param: string[],
    method: AxiosRequestConfig['method'],
  ) => Promise<AjaxResultType>,
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
            await api(ids, 'delete')
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
    let result = await request<AnyObjectType[]>({
      url,
      method: 'get',
    })
    return result.data.map((item) => ({
      label: item[params[0]],
      value: item[params[1]],
    }))
  } catch (error) {
    return []
  }
}

/**
 * @Description 默认下拉菜单增加全部这一选项
 * @Author bihongbin
 * @Date 2020-11-06 13:57:22
 */
export const addSelectMenuAll = (data: FormListType[] | undefined) => {
  if (data) {
    return data.map((item) => {
      if (
        item.componentName === 'Select' &&
        item.selectData &&
        item.selectData.length
      ) {
        if (!item.selectData.some((s) => s.label === '全部')) {
          item.selectData = [{ label: '全部', value: '' }, ...item.selectData]
        }
      }
      return item
    })
  } else {
    return []
  }
}

/**
 * @Description 根据当前url，找到tab的索引和对象，congruent 是否全等查询
 * @Author bihongbin
 * @Date 2020-11-04 18:09:08
 */
export const queryCurrentMenuObject = (
  menuList: SetUserMenuPayloadType[],
  url: string,
  congruent?: boolean,
) => {
  let current: {
    index: number
    currentMenu: undefined | SetUserMenuPayloadType
  } = {
    index: 0,
    currentMenu: undefined,
  }
  if (url) {
    for (let [i, item] of menuList.entries()) {
      if (congruent) {
        if (item.navigateUrl === url) {
          current.index = i
          current.currentMenu = item
          break
        }
      } else {
        if (url.includes(item.navigateUrl)) {
          current.index = i
          current.currentMenu = item
          break
        }
      }
    }
  }
  return current
}

/**
 * @Description 根据code拿到当前菜单
 * @Author bihongbin
 * @Date 2020-11-06 16:21:43
 */
export const queryCodeMenuObject = (
  code: string | undefined,
): SetUserMenuPayloadType | undefined => {
  const {
    auth: { rootMenuList },
  } = store.getState()
  let current = undefined
  const deepMenuList = (tabMenu: SetUserMenuPayloadType[]) => {
    for (let item of tabMenu) {
      if (item.code === code) {
        current = item
        return
      }
      if (item.children) {
        deepMenuList(item.children)
      }
    }
  }
  if (!code) {
    return undefined
  }
  deepMenuList([...rootMenuList])
  return current
}
