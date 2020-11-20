import React, { useEffect, useCallback, useContext } from 'react'
import { Card, Spin, message, Space, Tooltip, Modal } from 'antd'
import _ from 'lodash'
import moment from 'moment'
import useSetState from '@/hooks/useSetState'
import { FileItemType } from '@/pages/FileCenter/FileItems'
import { FileManageContext } from '@/pages/FileCenter'
import { SxyIcon } from '@/style/module/icon'
import { handleFileList, editFileListStatus } from '@/api/fileManage'
import { FilePreview } from './style'

const { confirm } = Modal

interface StateType {
  loading: boolean
  current: FileItemType
}

const Preview = () => {
  const { mainState, mainSetState } = useContext(FileManageContext)
  const [state, setState] = useSetState<StateType>({
    loading: false, // 加载loading
    current: {}, // 当前文件详情
  })

  /**
   * @Description 渲染图片或图标
   * @Author bihongbin
   * @Date 2020-08-12 10:26:51
   */
  const renderImages = () => {
    let fileExt = state.current.fileExt
    if (fileExt) {
      fileExt = fileExt.toLowerCase()
      if (
        fileExt &&
        (fileExt === 'jpeg' ||
          fileExt === 'jpg' ||
          fileExt === 'png' ||
          fileExt === 'gif')
      ) {
        return <img src={state.current.fileUrl} alt={state.current.name} />
      } else {
        return (
          <SxyIcon
            width={200}
            height={200}
            name={`file_${state.current.fileExt}.png`}
          />
        )
      }
    }
  }

  /**
   * @Description 检测图片加载状态
   * @Author bihongbin
   * @Date 2020-08-11 18:38:50
   */
  const detectImageLoading = useCallback(
    (current: FileItemType) => {
      let img = new Image()
      if (current.fileUrl && current.fileExt) {
        if (
          current.fileExt === 'jpeg' ||
          current.fileExt === 'jpg' ||
          current.fileExt === 'png' ||
          current.fileExt === 'gif'
        ) {
          setState({
            loading: true,
          })
          img.src = current.fileUrl
          img.onerror = () => {
            setState({
              loading: false,
            })
          }
          img.onload = () => {
            setState({
              loading: false,
            })
          }
        }
      }
    },
    [setState],
  )

  /**
   * @Description 获取当前文件详情
   * @Author bihongbin
   * @Date 2020-11-17 09:30:34
   */
  const getDetails = useCallback(
    async (id) => {
      try {
        const result = await handleFileList(
          {
            id,
            folderId: mainState.parentId,
          },
          'get',
        )
        setState({
          current: result.data,
        })
        mainSetState((prev) => {
          prev.openPreview.current = result.data
          return prev
        })
        detectImageLoading(result.data) // 检测图片加载状态
      } catch (error) {}
    },
    [detectImageLoading, mainSetState, mainState.parentId, setState],
  )

  /**
   * @Description 切换上一页和下一页
   * @Author bihongbin
   * @Date 2020-08-11 18:17:20
   */
  const switchPreview = useCallback(
    async (type: 'prev' | 'next') => {
      const len = mainState.openPreview.list.length
      let index = 0
      for (let i = 0; i < len; i++) {
        if (mainState.openPreview.list[i].id === state.current.id) {
          index = i
          break
        }
      }
      message.destroy()
      // 上一页
      if (type === 'prev') {
        index = index - 1
        if (index < 0) {
          message.warn('已经是第一个啦~', 1.5)
          return
        }
      }
      // 下一页
      if (type === 'next') {
        index = index + 1
        if (index > len - 1) {
          message.warn('已经是最后一个啦~', 1.5)
          return
        }
      }
      setState({
        loading: false,
      })
      getDetails(mainState.openPreview.list[index].id)
    },
    [getDetails, mainState.openPreview.list, setState, state],
  )

  /**
   * @Description 关闭详情
   * @Author bihongbin
   * @Date 2020-11-17 09:39:33
   */
  const handleClosePreview = useCallback(() => {
    mainSetState((prev) => {
      prev.openPreview.visible = false
      return prev
    })
  }, [mainSetState])

  /**
   * @Description 编辑
   * @Author bihongbin
   * @Date 2020-08-13 09:33:35
   */
  const handleEditFile = () => {
    mainSetState((prev) => {
      prev.newFolderModal.visible = true
      prev.newFolderModal.id = state.current.id
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
  }

  /**
   * @Description 删除
   * @Author bihongbin
   * @Date 2020-08-13 09:33:12
   */
  const handleDeleteFile = () => {
    confirm({
      title: '提示',
      width: 360,
      className: 'confirm-modal',
      content: '确定删除吗？',
      centered: true,
      onOk() {
        return new Promise(async (resolve, reject) => {
          try {
            await editFileListStatus({
              folderId: mainState.parentId,
              status: 2,
              data: [state.current.id],
            })
            let currentIndex = 0
            // 过滤删除预览页内容
            const newListData = mainState.openPreview.list.filter(
              (item, index) => {
                if (item.id === state.current.id) {
                  currentIndex = index // 当前删除索引
                }
                return item.id !== state.current.id
              },
            )
            // 删除主页面的内容
            if (mainState.fileList.length) {
              // 根据id删除
              mainSetState({
                fileList: _.pullAllBy(
                  mainState.fileList,
                  [state.current],
                  'id',
                ),
              })
            }
            if (newListData.length) {
              if (currentIndex === newListData.length) {
                currentIndex = currentIndex - 1
              }
              mainSetState({
                openPreview: {
                  visible: true,
                  current: newListData[currentIndex],
                  list: newListData,
                },
              })
            } else {
              handleClosePreview() // 退出预览模式
            }
            message.success('删除成功', 1.5)
            resolve()
          } catch (error) {
            reject(new Error('删除失败'))
          }
        })
      },
    })
  }

  /**
   * @Description 设置当前文件详情
   * @Author bihongbin
   * @Date 2020-08-11 18:05:29
   */
  useEffect(() => {
    getDetails(mainState.openPreview.current.id)
  }, [getDetails, mainState.openPreview, setState])

  /**
   * @Description 键盘监听
   * @Author bihongbin
   * @Date 2020-08-13 09:50:08
   */
  useEffect(() => {
    const keyUp = (e: KeyboardEvent) => {
      // 按esc键退出
      if (e.key === 'Escape') {
        handleClosePreview()
      }
      // 上一页
      if (e.key === 'ArrowLeft') {
        switchPreview('prev')
      }
      // 下一页
      if (e.key === 'ArrowRight') {
        switchPreview('next')
      }
    }
    window.addEventListener('keydown', keyUp)
    return () => {
      window.removeEventListener('keydown', keyUp)
    }
  }, [handleClosePreview, switchPreview])

  return (
    <Card bordered={false}>
      <FilePreview>
        <div className="preview-header">
          <SxyIcon
            className="preview-close-icon"
            width={30}
            height={30}
            name="file_back.png"
            title="关闭"
            onClick={handleClosePreview}
          />
        </div>
        <div className="preview-content">
          <div className="preview-detail-img">
            <Spin spinning={state.loading}>{renderImages()}</Spin>
            <div className="preview-nav">
              <div
                className="preview-left"
                title="上一页"
                onClick={() => switchPreview('prev')}
              >
                <SxyIcon
                  className="file-nav-icon prev-nav-icon"
                  width={40}
                  height={40}
                  name="file_left_arrow.png"
                >
                  上一页
                </SxyIcon>
              </div>
              <div
                className="preview-right"
                title="下一页"
                onClick={() => switchPreview('next')}
              >
                <SxyIcon
                  className="file-nav-icon next-nav-icon"
                  width={40}
                  height={40}
                  name="file_right_arrow.png"
                >
                  下一页
                </SxyIcon>
              </div>
            </div>
          </div>

          <div className="preview-file-name">
            {state.current.originalFileName}.{state.current.fileExt}
          </div>
          <div className="preview-file-us">
            <span className="preview-file-uploadTime">
              上传时间：
              {moment(state.current.createTime).format('YYYY-MM-DD HH:mm:ss')}
            </span>
            <span className="preview-file-size">
              大小：{state.current.size}
            </span>
          </div>
          <Space className="preview-file-foot" size={12}>
            <Tooltip placement="top" title="字幕">
              <SxyIcon
                className="pointer"
                width={30}
                height={30}
                name="file_zimu.png"
              />
            </Tooltip>
            {/* <Tooltip placement="top" title="字幕">
              <SxyIcon className="pointer" width={30} height={30} name="file_zimu_select.png" />
            </Tooltip> */}
            <Tooltip placement="top" title="编辑">
              <SxyIcon
                className="pointer"
                width={30}
                height={30}
                name="file_edit.png"
                onClick={handleEditFile}
              />
            </Tooltip>
            <Tooltip placement="top" title="删除">
              <SxyIcon
                className="pointer"
                width={30}
                height={30}
                name="file_delete.png"
                onClick={handleDeleteFile}
              />
            </Tooltip>
            <Tooltip placement="top" title="查看">
              <SxyIcon
                className="pointer"
                width={30}
                height={30}
                name="file_yulan.png"
              />
            </Tooltip>
            <Tooltip placement="top" title="驻点">
              <SxyIcon
                className="pointer"
                width={30}
                height={30}
                name="file_zhudian.png"
              />
            </Tooltip>
          </Space>
        </div>
      </FilePreview>
    </Card>
  )
}

export default Preview
