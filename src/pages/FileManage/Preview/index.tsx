import React, { useReducer, useEffect, useCallback, useContext } from 'react'
import { Card, Spin, message, Space, Tooltip, Modal } from 'antd'
import _ from 'lodash'
import { FileItemType } from '@/pages/FileManage/FileItems'
import {
  FileManageContext,
  ActionType as ParentActionType,
} from '@/pages/FileManage'
import { SxyIcon } from '@/style/module/icon'
import { FilePreview } from './style'

const { confirm } = Modal

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_LOADING = '[SetLoading Action]',
  SET_CURRENT = '[SetCurrent Action]',
}

const stateValue = {
  loading: false, // 加载loading
  current: {} as FileItemType,
}

const Preview = () => {
  const { mainState, mainDispatch } = useContext(FileManageContext)
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_LOADING: // 设置加载loading
        return {
          ...state,
          loading: action.payload,
        }
      case ActionType.SET_CURRENT: // 设置当前选中
        return {
          ...state,
          current: action.payload,
        }
    }
  }, stateValue)

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
        return <img src={state.current.fileUrl} alt="" />
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
  const detectImageLoading = useCallback((current) => {
    let img = new Image()
    if (current.fileUrl) {
      dispatch({
        type: ActionType.SET_LOADING,
        payload: true,
      })
      img.src = current.fileUrl
      img.onload = () => {
        dispatch({
          type: ActionType.SET_LOADING,
          payload: false,
        })
      }
    }
  }, [])

  /**
   * @Description 切换上一页和下一页
   * @Author bihongbin
   * @Date 2020-08-11 18:17:20
   */
  const switchPreview = useCallback(
    (type: 'prev' | 'next') => {
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
      detectImageLoading(mainState.openPreview.list[index]) // 检测图片加载状态
      dispatch({
        type: ActionType.SET_CURRENT,
        payload: mainState.openPreview.list[index],
      })
    },
    [detectImageLoading, mainState.openPreview.list, state],
  )

  const handleClosePreview = useCallback(() => {
    mainDispatch({
      type: ParentActionType.SET_OPEN_PREVIEW,
      payload: {
        ...mainState.openPreview,
        visible: false,
      },
    })
  }, [mainDispatch, mainState.openPreview])

  /**
   * @Description 编辑
   * @Author bihongbin
   * @Date 2020-08-13 09:33:35
   */
  const handleEditFile = () => {
    mainDispatch({
      type: ParentActionType.SET_NEW_FOLDER_MODAL_DATA,
      payload: {
        visible: true,
        id: state.current.id,
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
  }

  /**
   * @Description 删除
   * @Author bihongbin
   * @Date 2020-08-13 09:33:12
   */
  const handleDeleteFile = () => {
    confirm({
      title: '提示',
      content: '确定删除吗？',
      centered: true,
      onOk() {
        return new Promise(async (resolve, reject) => {
          try {
            setTimeout(() => {
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
                mainDispatch({
                  type: ParentActionType.SET_FILE_LIST,
                  payload: _.pullAllBy(
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
                mainDispatch({
                  type: ParentActionType.SET_OPEN_PREVIEW,
                  payload: {
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
            }, 1000)
          } catch (error) {
            reject(new Error('删除失败'))
          }
        })
      },
    })
  }

  /**
   * @Description 设置当前选中
   * @Author bihongbin
   * @Date 2020-08-11 18:05:29
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_CURRENT,
      payload: mainState.openPreview.current,
    })
    detectImageLoading(mainState.openPreview.current) // 检测图片加载状态
  }, [detectImageLoading, mainState])

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
              上传时间：{state.current.createTime}
            </span>
            <span className="preview-file-size">
              大小：{state.current.fileSize}
              kb
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
