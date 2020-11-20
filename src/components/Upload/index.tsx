/*
 * @Description 上传文件组件
 * @Author bihongbin
 * @Date 2020-07-10 16:56:39
 * @LastEditors bihongbin
 * @LastEditTime 2020-11-16 12:02:22
 */

import React, { useState } from 'react'
import { Upload, message } from 'antd'
import { useSelector } from 'react-redux'
import { LoadingOutlined } from '@ant-design/icons'
import { UploadChangeParam, UploadProps, RcFile } from 'antd/es/upload'
import _ from 'lodash'
import { RootStateType } from '@/store/rootReducer'
import { AnyObjectType } from '@/typings'

type FileType =
  | 'xls'
  | 'xlsx'
  | 'txt'
  | 'pdf'
  | 'docx'
  | 'jpg'
  | 'png'
  | 'svg'
  | 'mp3'
  | 'mp4' // 支持上传的文件格式

type PropsType = {
  uploadType?: FileType[] // 支持上传的文件格式
  children: JSX.Element // 上传选择文件的样式
  uploadSuccess?: (data: AnyObjectType[]) => void // 上传成功回调
} & UploadProps

const UploadF = (props: PropsType) => {
  const [loading, setLoading] = useState(false)
  const auth = useSelector((state: RootStateType) => state.auth)

  /**
   * @Description 上传校验
   * @Author bihongbin
   * @Date 2020-07-15 16:41:34
   */
  const handleBeforeUpload = (file: RcFile, fileList: RcFile[]) => {
    let type = file.name.match(/\.([0-9a-z]+)(?:[?#]|$)/i)
    return new Promise<any>((resolve, reject) => {
      if (
        _.isArray(props.uploadType) &&
        props.uploadType.length &&
        _.isArray(type) &&
        type.length
      ) {
        if (!props.uploadType.includes(type[1] as any)) {
          message.error(`您只能上传${props.uploadType.join('、')}文件`)
          reject(fileList)
        }
      }
      resolve(fileList)
    })
  }

  /**
   * @Description 上传文件转换-文件名使用encodeURIComponent编码
   * @Author bihongbin
   * @Date 2020-07-22 11:48:23
   */
  const handleTransformFile = (file: File) => {
    return new Promise<File>((resolve) => {
      let fileArr = file.name.match(/\.([0-9a-z]+)(?:[?#]|$)/i)
      let last = file.name.lastIndexOf('.')
      let name = file.name.substr(0, last)
      if (fileArr) {
        resolve(new File([file], encodeURIComponent(name) + fileArr[0]))
      }
    })
  }

  /**
   * @Description 上传文件改变时的状态
   * @Author bihongbin
   * @Date 2020-07-10 17:36:44
   */
  const handleChange = (fileObject: UploadChangeParam) => {
    const { status } = fileObject.file

    message.destroy()
    // 上传中
    if (status === 'uploading') {
      setLoading(true)
    }
    // 上传成功
    if (status === 'done') {
      setLoading(false)
      console.log('上传的文件列表', fileObject.fileList)
      if (fileObject.file.response.code === 1) {
        // 上传成功发送内容给父组件
        if (props.uploadSuccess) {
          props.uploadSuccess(fileObject.fileList)
        }
      } else {
        // 上传失败提示
        message.warn(fileObject.file.response.msg, 1.5)
      }
    }
    // 上传失败
    if (status === 'error') {
      setLoading(false)
      message.error('上传失败', 1.5)
    }
  }

  /**
   * @Description 点击文件链接或预览图标时的回调
   * @Author bihongbin
   * @Date 2020-07-10 18:20:05
   */
  const handlePreview = async (file: AnyObjectType) => {
    let src = file.url
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result)
      })
    }
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    if (imgWindow) {
      imgWindow.document.write(image.outerHTML)
    }
  }

  return (
    <Upload
      onChange={handleChange}
      onPreview={handlePreview}
      beforeUpload={handleBeforeUpload}
      transformFile={handleTransformFile}
      headers={{ token: auth.authToken || '' }}
      {...props}
    >
      {props.children}
      {loading ? <LoadingOutlined /> : null}
    </Upload>
  )
}

export default React.memo(UploadF)
