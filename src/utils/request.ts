import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from 'axios'
import { message } from 'antd'
import store from '@/store'
import { GlobalConstant } from '@/config'

// interface ResponseData<T> {
//   code: number
//   data: T
//   message: string
// }

axios.defaults.headers = {
  'Content-Type': 'application/json;charset=utf-8',
}
axios.defaults.baseURL = GlobalConstant.baseUrl

/**
 * @Description: 请求拦截器
 * @Author: bihongbin
 * @Date: 2020-05-26 14:08:34
 */
axios.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const {
      auth: { authToken, tokenType },
    } = store.getState() as any
    const accessToken: string =
      authToken && authToken
        ? `${tokenType} ${authToken}`
        : GlobalConstant.accessToken || ''
    if (accessToken) {
      config.headers.Authorization = accessToken
    }
    // http状态码
    config.validateStatus = (status) => {
      const { codeMessage } = GlobalConstant
      type CodeType = typeof codeMessage
      type CodeKey = keyof CodeType
      if (status >= 200 && status < 300) {
        return true
      } else {
        message.destroy() // 防止弹出多个提示
        message.warn(codeMessage[String(status) as CodeKey] || '请求错误', 1.5)
        return false
      }
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

/**
 * @Description: 响应拦截器
 * @Author: bihongbin
 * @Date: 2020-05-26 14:08:19
 */
axios.interceptors.response.use(
  (response: AxiosResponse) => {
    const { gatewayUrl } = GlobalConstant
    const total = response.headers['x-total-count'] // 分页总条数
    if (total) {
      response.data.total = parseInt(total) // 返回结果注入分页参数
    }
    if (response.config.url) {
      // 如果是新系统接口
      if (response.config.url.indexOf(gatewayUrl.ibfapi) !== -1) {
        if (response.data.code === 1) {
          return response.data
        } else {
          message.destroy() // 防止弹出多个提示
          message.warn(response.data.message, 1.5)
          return Promise.reject(response.data.message)
        }
      } else {
        return response.data
      }
    }
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

/**
 * @Description: 统一发起请求的函数
 * @Author: bihongbin
 * @Date: 2020-05-26 14:08:00
 */
export default function request<T>(options: AxiosRequestConfig) {
  return axios.request<T>(options)
}
