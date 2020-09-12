import React, { useContext } from 'react'
import { Row, Col, Space, Checkbox, Modal, message } from 'antd'
import _ from 'lodash'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import {
  FileManageContext,
  ActionType as ParentActionType,
} from '@/pages/FileManage'
import { SxyIcon } from '@/style/module/icon'
import { Items } from './style'

const { confirm } = Modal

export interface FileItemType {
  id?: any // 主键id
  groupId?: string // 文件组id
  folderId?: number // 文件管理目录id
  sourceType?: string // 业务来源类型
  originalFileName?: string // 原始文件名
  fileExt?: string // 文件后缀
  etag?: string // 文件标签
  convertStatus?: string // 文件转换状态
  markerCount?: number // 驻点个数
  tagCount?: number // 文件标签个数
  usedCount?: number // 使用次数
  subtitleCount?: number // 字母数量
  fileUrl?: string // 文件网络地址
  fileSize?: number // 文件大小 单位B
  fileLength?: number // 文件长度  音视频为秒，PPT/WORD为页数
  createTime?: string // 创建时间
  selected?: boolean // 选中状态
}

const FileItems = () => {
  const { mainState, mainDispatch } = useContext(FileManageContext)

  /**
   * @Description checkbox变化时回调函数
   * @Author bihongbin
   * @Date 2020-08-11 10:23:22
   */
  const changeCheckbox = (e: CheckboxChangeEvent, item: FileItemType) => {
    const newMap = mainState.fileList.map((k) => {
      if (k.id === item.id) {
        k.selected = !k.selected
      }
      return k
    })
    // 设置选中或取消
    mainDispatch({
      type: ParentActionType.SET_FILE_LIST,
      payload: newMap,
    })
    // 设置选中的数据
    mainDispatch({
      type: ParentActionType.SET_LIST_ROWS,
      payload: newMap.filter((item) => item.selected),
    })
    e.stopPropagation()
  }

  /**
   * @Description 渲染图标
   * @Author bihongbin
   * @Date 2020-08-10 17:24:23
   */
  const renderItemContent = (item: FileItemType) => {
    let fileIcon: string
    let fileName: string
    let fileHtml = null
    let fileExt = item.fileExt
    if (fileExt) {
      fileExt = fileExt.toLowerCase()
      fileIcon = `file_${fileExt}.png`
      fileName = `${item.originalFileName}.${fileExt}`
    } else {
      fileIcon = 'file_folder.png'
      fileName = `${item.originalFileName}`
    }
    fileHtml = (
      <>
        {item.fileUrl &&
        (fileExt === 'jpeg' ||
          fileExt === 'jpg' ||
          fileExt === 'png' ||
          fileExt === 'gif') ? (
          <div className="file-img">
            <img src={item.fileUrl} alt="" />
          </div>
        ) : (
          <SxyIcon width={52} height={52} name={fileIcon} />
        )}
        <div className="file-name" title={item.originalFileName}>
          {fileName}
        </div>
      </>
    )
    if (mainState.status === 0) {
      return <div className="file-item-content">{fileHtml}</div>
    } else {
      return (
        <Checkbox
          checked={item.selected}
          onChange={(e) => {
            changeCheckbox(e, item)
          }}
        >
          {fileHtml}
        </Checkbox>
      )
    }
  }

  /**
   * @Description item点击事件
   * @Author bihongbin
   * @Date 2020-08-10 17:25:19
   */
  const onItemClick = (item: FileItemType) => {
    // 正常模式
    if (mainState.status === 0) {
      // 点击的是文件夹
      if (!item.fileExt) {
        console.log('进入文件夹详情')
      } else {
        // 打开预览模式
        mainDispatch({
          type: ParentActionType.SET_OPEN_PREVIEW,
          payload: {
            visible: true,
            current: item,
            list: mainState.fileList.filter((i: FileItemType) => i.fileExt),
          },
        })
      }
    }
  }

  /**
   * @Description 修改文件
   * @Author bihongbin
   * @Date 2020-08-11 16:00:39
   */
  const handleEditItem = (item: FileItemType, e: React.MouseEvent) => {
    mainDispatch({
      type: ParentActionType.SET_OPEN_PREVIEW,
      payload: {
        ...mainState.openPreview,
        current: item,
      },
    })
    mainDispatch({
      type: ParentActionType.SET_NEW_FOLDER_MODAL_DATA,
      payload: {
        ...mainState.newFolderModal,
        visible: true,
        id: item.id,
        title: '重命名',
        formList: [
          {
            componentName: 'Input',
            name: 'originalFileName',
            label: '名称',
            placeholder: '请填写名称',
            rules: [
              {
                required: true,
                message: '请填写名称',
              },
            ],
          },
        ],
      },
    })
    e.stopPropagation()
  }

  /**
   * @Description 删除
   * @Author bihongbin
   * @Date 2020-08-11 11:55:02
   */
  const handleDeleteItem = (item: FileItemType, e: React.MouseEvent) => {
    confirm({
      title: '提示',
      content: '确定删除吗？',
      centered: true,
      onOk() {
        return new Promise(async (resolve, reject) => {
          try {
            setTimeout(() => {
              mainDispatch({
                type: ParentActionType.SET_FILE_LIST,
                payload: _.pullAllBy(mainState.fileList, [item], 'id'),
              })
              message.success('删除成功', 1.5)
              resolve()
            }, 1000)
          } catch (error) {
            reject(new Error('删除失败'))
          }
        })
      },
    })
    e.stopPropagation()
  }

  return (
    <Row gutter={[20, 20]}>
      {mainState.fileList.map((item, index) => (
        <Col xs={8} sm={6} md={6} lg={6} xl={4} xxl={3} key={index}>
          <Items
            className={`file-items ${
              item.selected ? 'file-items-selected' : ''
            }`}
            onClick={() => onItemClick(item)}
          >
            {renderItemContent(item)}
            {mainState.status === 0 ? (
              <div className="open-enable">
                <Space>
                  <SxyIcon
                    onClick={(e) => handleEditItem(item, e)}
                    title="编辑"
                    width={10}
                    height={10}
                    name="file_small_edit.png"
                  />
                  <SxyIcon
                    onClick={(e) => handleDeleteItem(item, e)}
                    title="删除"
                    width={10}
                    height={10}
                    name="file_small_delete.png"
                  />
                </Space>
              </div>
            ) : null}
          </Items>
        </Col>
      ))}
    </Row>
  )
}

export default FileItems
