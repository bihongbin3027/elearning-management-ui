import React, { useContext } from 'react'
import { Row, Col, Space, Checkbox, Modal, message } from 'antd'
import _ from 'lodash'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { FileManageContext } from '@/pages/FileCenter'
import { SxyIcon } from '@/style/module/icon'
import { editFileFolderListStatus, editFileListStatus } from '@/api/fileManage'
import { Items } from './style'

const { confirm } = Modal

export interface FileItemType {
  id?: any // 主键id
  groupId?: string // 文件组id
  folderId?: number // 文件管理目录id
  sourceType?: string // 业务来源类型
  name?: string // 文件夹名
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
  size?: string // 实际大小 带单位
  fileLength?: number // 文件长度  音视频为秒，PPT/WORD为页数
  createTime?: string // 创建时间
  selected?: boolean // 选中状态
}

const FileItems = () => {
  const { mainState, mainSetState } = useContext(FileManageContext)

  /**
   * @Description checkbox变化时回调函数
   * @Author bihongbin
   * @Date 2020-08-11 10:23:22
   */
  const changeCheckbox = (e: CheckboxChangeEvent, item: FileItemType) => {
    const arrFilter = (arr: FileItemType[]) => {
      return arr.map((k) => {
        if (k.id === item.id) {
          k.selected = !k.selected
        }
        return k
      })
    }
    const fileFolderList = arrFilter(mainState.fileFolderList) // 设置文件夹选中或取消
    const fileList = arrFilter(mainState.fileList) // 设置文件选中或取消
    mainSetState({
      fileFolderList: fileFolderList,
      fileFolderRows: fileFolderList.filter((item) => item.selected), // 设置文件夹选中的数据
      fileList: fileList,
      fileListRows: fileList.filter((item) => item.selected), // 设置文件选中的数据
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
      fileName = `${item.name}`
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
          <SxyIcon className="mb-3" width={52} height={52} name={fileIcon} />
        )}
        <div className="file-name" title={fileName}>
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
        // 进入文件夹详情，清空文件夹和文件，防止有闪烁
        mainSetState({
          parentId: item.id,
          fileList: [],
          fileFolderList: [],
        })
      } else {
        // 文件管理模式，mainState.mode=='modal'弹窗模式
        if (mainState.mode === 'modal') {
          const setItemsChecked = (id: string, type: 'checkbox' | 'radio') => {
            mainSetState((prev) => {
              const list = prev.fileList.map((file) => {
                if (type === 'radio') {
                  file.selected = false
                }
                if (file.id === id) {
                  file.selected = !file.selected
                }
                return file
              })
              prev.fileList = list
              prev.fileListRows = list.filter((item) => item.selected)
              return prev
            })
          }
          if (mainState.selectedMethod) {
            // 多选和多选
            setItemsChecked(item.id, mainState.selectedMethod)
          }
        } else {
          // 打开预览模式
          mainSetState((prev) => {
            prev.openPreview.visible = true
            prev.openPreview.current = item
            prev.openPreview.list = mainState.fileList.filter(
              (i: FileItemType) => i.fileExt,
            )
            return prev
          })
        }
      }
    }
  }

  /**
   * @Description 修改文件
   * @Author bihongbin
   * @Date 2020-08-11 16:00:39
   */
  const handleEditItem = (item: FileItemType, e: React.MouseEvent) => {
    mainSetState((prev) => {
      prev.openPreview.current = item
      prev.newFolderModal.visible = true
      prev.newFolderModal.id = item.id
      prev.newFolderModal.title = '重命名'
      prev.newFolderModal.formList = [
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
      ]
      return prev
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
      width: 360,
      className: 'confirm-modal',
      content: '确定删除吗？',
      centered: true,
      onOk() {
        return new Promise(async (resolve, reject) => {
          try {
            let params = {
              status: 2,
              folderId: mainState.parentId,
              data: [item.id],
            }
            if (item.fileExt) {
              // 删除文件
              await editFileListStatus(params)
            } else {
              // 删除文件夹
              await editFileFolderListStatus(params)
            }
            message.success('删除成功', 1.5)
            if (item.fileExt) {
              // 删除文件
              mainSetState({
                fileList: _.pullAllBy(mainState.fileList, [item], 'id'),
              })
            } else {
              // 删除文件夹
              mainSetState({
                fileFolderList: _.pullAllBy(
                  mainState.fileFolderList,
                  [item],
                  'id',
                ),
              })
            }
            resolve()
          } catch (error) {
            reject(new Error('删除失败'))
          }
        })
      },
    })
    e.stopPropagation()
  }

  return (
    <Row className="file-items-wrap" gutter={[20, 20]}>
      {mainState.fileFolderList
        .concat(mainState.fileList)
        .map((item, index) => (
          <Col xs={8} sm={6} md={6} lg={6} xl={4} xxl={3} key={index}>
            {item.selected}
            <Items
              className={`file-items ${
                item.selected ? 'file-items-selected' : ''
              }`}
              onClick={() => onItemClick(item)}
            >
              {renderItemContent(item)}
              {mainState.status === 0 && mainState.openManagement ? (
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
