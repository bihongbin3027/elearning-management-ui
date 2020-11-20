import axios, { AxiosRequestConfig, AxiosError } from 'axios'
import { message } from 'antd'
import store from '@/store'
import * as authTypes from '@/store/module/auth/types'
import { GlobalConstant } from '@/config'
import { AjaxResultType } from '@/typings'

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
  (config) => {
    const {
      auth: { authToken },
    } = store.getState()
    config.headers.token = authToken ? authToken : ''
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
  (response) => {
    const newToken: string = response.headers['newToken']
    if (newToken) {
      console.log('newToken：', newToken)
      store.dispatch({
        type: authTypes.SET_AUTH_TOKEN,
        payload: newToken,
      })
    }
    if (response.data.code === 1) {
      return response
    } else {
      // token失效
      if (response.data.code === 401) {
        window.location.href = '/#login'
      }
      message.destroy() // 防止弹出多个提示
      message.warn(response.data.msg, 1.5)
      return Promise.reject(response)
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
  return new Promise<AjaxResultType<T>>((resolve, reject) => {
    axios
      .request(options)
      .then((res) => {
        resolve(res.data)
      })
      .catch((error) => reject(error))
  })
}
