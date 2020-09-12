import React, { useReducer } from 'react'
import {
  Row,
  Col,
  Button,
  Select,
  Input,
  Space,
  Spin,
  Checkbox,
  Modal,
  Card,
  message,
} from 'antd'
import _ from 'lodash'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { SearchOutlined } from '@ant-design/icons'
import FileItems, { FileItemType } from '@/pages/FileManage/FileItems'
import Upload from '@/components/Upload'
import NewFolderModal from '@/pages/FileManage/NewFolderModal'
import { FormListType } from '@/components/GenerateForm'
import { AnyObjectType } from '@/typings'
import { GlobalConstant } from '@/config'
import Preview from '@/pages/FileManage/Preview'
import Empty from '@/components/Empty'

const { Option } = Select
const { confirm } = Modal

interface CreateContextType {
  mainState: StateType
  mainDispatch: (data: Action) => void
}

export const FileManageContext = React.createContext<CreateContextType>(
  {} as CreateContextType,
)

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

export enum ActionType {
  SET_LOADING = '[SetLoading Action]',
  SET_STATUS = '[SetStatus Action]',
  SET_OPEN_PREVIEW = '[SetOpenPreview Action]',
  SET_FILE_LIST = '[SetFileList Action]',
  SET_LIST_ROWS = '[SetListRows Action]',
  SET_NEW_FOLDER_MODAL_DATA = '[SetNewFolderModalData Action]',
}

const stateValue = {
  loading: false, // loading
  status: 0, // 操作状态 0 正常，1 管理文件状态，2 回收站状态
  openPreview: {
    visible: false, // 是否打开预览模式
    current: {} as FileItemType, // 首次需要预览的文件
    list: [] as FileItemType[], // 需要预览的文件
  },
  // 文件列表
  fileList: [
    {
      id: 1,
      originalFileName: '19年一起考试名单',
      createTime: '2019-03-18 13:52:12',
      selected: false,
    },
    {
      id: 2,
      originalFileName: '协会',
      createTime: '2020-04-19 05:06:55',
      selected: false,
    },
    {
      id: 3,
      originalFileName: 'photo',
      fileSize: 28,
      fileExt: 'doc',
      createTime: '2019-01-12 06:07:12',
      selected: false,
    },
    {
      id: 4,
      originalFileName: 'photo',
      fileSize: 28,
      fileExt: 'xls',
      createTime: '2019-01-13 06:07:12',
      selected: false,
    },
    {
      id: 5,
      originalFileName: 'photo',
      fileSize: 28,
      fileExt: 'ppt',
      createTime: '2019-01-14 09:08:07',
      selected: false,
    },
    {
      id: 6,
      originalFileName: 'photo',
      fileSize: 28,
      fileExt: 'rar',
      createTime: '2019-01-15 11:01:12',
      selected: false,
    },
    {
      id: 7,
      originalFileName: 'photo',
      fileSize: 28,
      fileExt: 'pdf',
      createTime: '2019-01-22 15:23:24',
      selected: false,
    },
    {
      id: 8,
      originalFileName: 'photo',
      fileSize: 28,
      fileExt: 'dmg',
      createTime: '2019-01-09 13:13:13',
      selected: false,
    },
    {
      id: 9,
      originalFileName: 'photo',
      fileSize: 28,
      fileExt: 'mp3',
      createTime: '2019-01-20 13:13:13',
      selected: false,
    },
    {
      id: 10,
      originalFileName: 'photo',
      fileSize: 28,
      fileExt: 'mp4',
      createTime: '2019-02-26 12:12:12',
      selected: false,
    },
    {
      id: 11,
      originalFileName: 'photo',
      fileSize: 28,
      fileExt: 'avi',
      createTime: '2019-02-26 19:20:30',
      selected: false,
    },
    {
      id: 12,
      originalFileName: '图片1',
      fileSize: 24,
      fileExt: 'jpg',
      fileUrl:
        'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3984473917,238095211&fm=26&gp=0.jpg',
      createTime: '2019-02-27 17:10:35',
      selected: false,
    },
    {
      id: 13,
      originalFileName: '图片2',
      fileSize: 28,
      fileExt: 'png',
      fileUrl:
        'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3238317745,514710292&fm=26&gp=0.jpg',
      createTime: '2020-05-01 18:00:12',
      selected: false,
    },
  ] as FileItemType[],
  // 文件选中的数据
  listRows: [] as FileItemType[],
  // 文件夹或文件新增修改弹窗
  newFolderModal: {
    visible: false,
    width: 400,
    id: '',
    title: '新建文件夹',
    formList: [] as FormListType[],
  },
}

const FileMangeMainList = () => {
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_LOADING: // 设置loading状态
        return {
          ...state,
          searchFormList: action.payload,
        }
      case ActionType.SET_STATUS: // 设置操作状态
        return {
          ...state,
          status: action.payload,
        }
      case ActionType.SET_OPEN_PREVIEW: // 设置打开预览状态
        return {
          ...state,
          openPreview: action.payload,
        }
      case ActionType.SET_FILE_LIST: // 设置修改文件数据
        return {
          ...state,
          fileList: action.payload,
        }
      case ActionType.SET_LIST_ROWS: // 设置复选框选中的数据
        return {
          ...state,
          listRows: action.payload,
        }
      case ActionType.SET_NEW_FOLDER_MODAL_DATA: // 设置文件夹或文件新增修改弹窗数据
        return {
          ...state,
          newFolderModal: {
            ...state.newFolderModal,
            ...action.payload,
          },
        }
    }
  }, stateValue)

  /**
   * @Description 设置文件夹或文件新增修改弹窗数据
   * @Author bihongbin
   * @Date 2020-08-11 09:26:16
   */
  const handleNewFileState = (data: Partial<StateType['newFolderModal']>) => {
    dispatch({
      type: ActionType.SET_NEW_FOLDER_MODAL_DATA,
      payload: data,
    })
  }

  /**
   * @Description 设置操作状态，并清空选中的数据
   * @Author bihongbin
   * @Date 2020-08-11 11:30:51
   */
  const handleFileStatus = (data: number) => {
    dispatch({
      type: ActionType.SET_STATUS,
      payload: data,
    })
    clearSelected(false)
  }

  /**
   * @Description 全选或取消全选
   * @Author bihongbin
   * @Date 2020-08-11 11:23:40
   */
  const clearSelected = (data: boolean) => {
    const newMap = state.fileList.map((item) => {
      item.selected = data
      return item
    })
    // 设置全选或取消
    dispatch({
      type: ActionType.SET_FILE_LIST,
      payload: newMap,
    })
    // 设置选中的数据
    dispatch({
      type: ActionType.SET_LIST_ROWS,
      payload: newMap.filter((item) => item.selected),
    })
  }

  /**
   * @Description 全选或取消全选
   * @Author bihongbin
   * @Date 2020-08-11 11:22:47
   */
  const handleSelectedAll = (e: CheckboxChangeEvent) => {
    clearSelected(e.target.checked)
  }

  /**
   * @Description 删除文件
   * @Author bihongbin
   * @Date 2020-08-11 11:33:44
   */
  const handleDeleteFile = () => {
    if (!state.listRows.length) {
      message.warn('请选择要删除的文件', 1.5)
      return
    }
    confirm({
      title: '提示',
      content: '确定删除吗？',
      centered: true,
      onOk() {
        return new Promise(async (resolve, reject) => {
          try {
            setTimeout(() => {
              dispatch({
                type: ActionType.SET_FILE_LIST,
                payload: _.pullAll(state.fileList, state.listRows),
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
  }

  /**
   * @Description 回收站清空
   * @Author bihongbin
   * @Date 2020-08-11 11:40:08
   */
  const handleRecycleBinEmpty = () => {
    if (!state.listRows.length) {
      message.warn('请选择要删除的文件', 1.5)
      return
    }
    confirm({
      title: '提示',
      content: '文件删除后将无法恢复，您确认要彻底删除所选文件吗？',
      centered: true,
      onOk() {
        return new Promise(async (resolve, reject) => {
          try {
            setTimeout(() => {
              dispatch({
                type: ActionType.SET_FILE_LIST,
                payload: _.pullAll(state.fileList, state.listRows),
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
  }

  /**
   * @Description 回收站还原
   * @Author bihongbin
   * @Date 2020-08-11 11:49:53
   */
  const handleRecycleBinRestore = () => {
    if (!state.listRows.length) {
      message.warn('请选择要还原的文件', 1.5)
      return
    }
    confirm({
      title: '提示',
      content: '确认还原选中的文件？',
      centered: true,
      onOk() {
        return new Promise(async (resolve, reject) => {
          try {
            setTimeout(() => {
              dispatch({
                type: ActionType.SET_FILE_LIST,
                payload: _.pullAll(state.fileList, state.listRows),
              })
              message.success('还原成功', 1.5)
              resolve()
            }, 1000)
          } catch (error) {
            reject(new Error('还原失败'))
          }
        })
      },
    })
  }

  /**
   * @Description 不同状态渲染不同操作按钮
   * @Author bihongbin
   * @Date 2020-08-11 09:52:20
   */
  const renderHandleButton = () => {
    // 正常状态
    if (state.status === 0) {
      return (
        <>
          <Upload
            action={GlobalConstant.billHdrUploadHttp}
            showUploadList={false}
            uploadSuccess={uploadSuccess}
            multiple
          >
            <Button style={{ width: '88px' }}>上传</Button>
          </Upload>
          <Button onClick={() => handleFileStatus(1)}>管理文件</Button>
          <Button
            onClick={() => {
              handleNewFileState({
                visible: true,
                title: '新建文件夹',
                formList: [
                  {
                    componentName: 'Input',
                    name: 'originalFileName',
                    label: '文件夹名称',
                    placeholder: '请填写文件夹名称',
                    rules: [
                      {
                        required: true,
                        message: '请填写文件夹名称',
                      },
                    ],
                  },
                ],
              })
            }}
          >
            新建文件夹
          </Button>
        </>
      )
    }
    // 文件管理状态
    if (state.status === 1) {
      return (
        <>
          <Button onClick={handleDeleteFile}>删除文件</Button>
          <Button onClick={() => handleFileStatus(0)}>退出管理</Button>
        </>
      )
    }
    // 回收站状态
    if (state.status === 2) {
      return (
        <>
          <Button onClick={handleRecycleBinRestore}>还原</Button>
          <Button onClick={handleRecycleBinEmpty}>清空</Button>
          <Button onClick={() => handleFileStatus(0)}>退出回收站</Button>
        </>
      )
    }
  }

  /**
   * @Description 切换文件类型
   * @Author bihongbin
   * @Date 2020-08-11 16:15:12
   */
  const onSearchType = (value: string) => {
    console.log(value)
  }

  /**
   * @Description 搜索
   * @Author bihongbin
   * @Date 2020-08-10 14:30:29
   */
  const onSearchText = (e: any) => {
    e.persist()
    console.log(e.target.value)
  }

  /**
   * @Description 上传成功回调
   * @Author bihongbin
   * @Date 2020-08-10 18:28:03
   */
  const uploadSuccess = async (data: AnyObjectType[]) => {
    console.log('上传成功', data)
  }

  return (
    <FileManageContext.Provider
      value={{
        mainState: state,
        mainDispatch: dispatch,
      }}
    >
      {state.openPreview.visible ? (
        <Preview />
      ) : (
        <>
          <Card className="card-body-small mb-4">
            <Row>
              <Col>
                <Space size="middle">
                  <Select
                    defaultValue="0"
                    style={{ width: 100 }}
                    bordered={false}
                    onChange={onSearchType}
                  >
                    <Option value="0">所有文件</Option>
                    <Option value="1">图片</Option>
                    <Option value="2">视频</Option>
                    <Option value="3">其他</Option>
                  </Select>
                  <div className="ant-form form-ash-theme">
                    <div className="ant-form-item-control">
                      <Input
                        className="search-input"
                        placeholder="请输入文件名"
                        prefix={<SearchOutlined />}
                        onPressEnter={(e) => onSearchText(e)}
                      />
                    </div>
                  </div>
                </Space>
              </Col>
              <Col></Col>
            </Row>
          </Card>
          <Card>
            <Row align="middle" justify="space-between">
              <Col>
                <Space size={10}>{renderHandleButton()}</Space>
              </Col>
              <Col>
                {state.status !== 0 ? (
                  <Checkbox onChange={handleSelectedAll}>全选</Checkbox>
                ) : (
                  <Button onClick={() => handleFileStatus(2)}>回收站</Button>
                )}
              </Col>
            </Row>
            <Spin spinning={state.loading}>
              {state.fileList.length ? (
                <div className="mt-6">
                  <FileItems />
                </div>
              ) : (
                <Empty />
              )}
            </Spin>
          </Card>
        </>
      )}
      <NewFolderModal />
    </FileManageContext.Provider>
  )
}

export default FileMangeMainList
