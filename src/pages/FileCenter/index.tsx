import React, {
  useEffect,
  useCallback,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { useSelector } from 'react-redux'
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
  Breadcrumb,
  message,
} from 'antd'
import _ from 'lodash'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { SearchOutlined, HomeOutlined } from '@ant-design/icons'
import useSetState from '@/hooks/useSetState'
import { RootStateType } from '@/store/rootReducer'
import { LayoutFormPropTypes } from '@/components/LayoutFormModal'
import FileItems, { FileItemType } from '@/pages/FileCenter/FileItems'
import Upload from '@/components/Upload'
import NewFolderModal from '@/pages/FileCenter/NewFolderModal'
import { AnyObjectType, SelectType } from '@/typings'
import { GlobalConstant } from '@/config'
import Preview from '@/pages/FileCenter/Preview'
import Empty from '@/components/Empty'
import {
  getFileFolderList,
  editFileFolderListStatus,
  getFileList,
  editFileListStatus,
  getFileFolderTree,
  handleFileRelationList,
} from '@/api/fileManage'

const { Option } = Select
const { confirm } = Modal

interface CreateContextType {
  mainState: StateType
  mainSetState: (
    patch: Partial<StateType> | ((prevState: StateType) => Partial<StateType>),
  ) => void
}

export const FileManageContext = React.createContext<CreateContextType>(
  {} as CreateContextType,
)

export interface FileCenterCallType {
  getSelectedFile: () => FileItemType[]
}

export interface PropTypes {
  mode?: 'modal' // 文件管理模式 modal弹窗模式
  selectedMethod?: 'checkbox' | 'radio' // 弹窗模式下单选还是多选
  fileExt?: string // 指定上传文件类型
  sourceType?: string // 业务来源类型
  openManagement?: boolean // 是否打开管理功能
}

export interface FileLevelType {
  id: string
  name: string | undefined
  parentId: string
  child?: FileLevelType
}

interface StateType {
  mode?: 'modal'
  openManagement: boolean
  selectedMethod?: 'checkbox' | 'radio'
  loading: boolean
  parentId: string
  queryFile: {
    selectList: SelectType[]
  }
  status: number
  openPreview: {
    visible: boolean
    current: FileItemType
    list: FileItemType[]
  }
  fileLevel: FileLevelType[]
  fileFolderList: FileItemType[]
  fileFolderRows: FileItemType[]
  fileList: FileItemType[]
  fileListRows: FileItemType[]
  newFolderModal: LayoutFormPropTypes
}

// 默认查询参数
interface searchRefType {
  searchName: string
  selectValue: string
}

// 默认分页相关
const normalFilePage = {
  moreText: '加载更多',
  page: '1',
  size: '20',
  pages: '0',
}

const FileMangeMainList = (props: PropTypes, ref: any) => {
  const auth = useSelector((state: RootStateType) => state.auth)
  const filePageRef = useRef<typeof normalFilePage>({ ...normalFilePage }) // 分页
  // 查询
  const searchRef = useRef<searchRefType>({
    searchName: '',
    selectValue: props.fileExt || '',
  })
  const [state, setState] = useSetState<StateType>({
    mode: props.mode || undefined, // 文件管理模式 modal弹窗模式
    selectedMethod: props.selectedMethod, // 弹窗模式下单选还是多选
    openManagement:
      props.openManagement !== undefined ? props.openManagement : true, // 是否打开管理功能（默认打开）
    loading: false, // loading
    // 父级文件夹id
    parentId: '0',
    // 文件查询条件
    queryFile: {
      selectList: [
        { label: '所有文件', value: '' },
        { label: '图片', value: 'jpeg,jpg,png,gif' },
        { label: '视频', value: 'mp4' },
      ],
    },
    status: 0, // 操作状态 0 正常，1 管理文件状态，2 回收站状态
    openPreview: {
      visible: false, // 是否打开预览模式
      current: {}, // 首次需要预览的文件
      list: [], // 需要预览的文件
    },
    fileLevel: [], // 文件夹进入层级
    fileFolderList: [], // 文件夹列表
    fileFolderRows: [], // 文件夹选中的数据
    // 文件列表
    fileList: [],
    // 文件选中的数据
    fileListRows: [],
    // 文件夹或文件新增修改弹窗
    newFolderModal: {
      visible: false,
      width: 400,
      id: '',
      title: '新建文件夹',
      formList: [],
    },
  })

  /**
   * @Description 下拉切换文件类型、搜索、重置、进入回收站、退出回收站
   * @Author bihongbin
   * @Date 2020-11-19 14:40:59
   */
  const resetStateInit = () => {
    filePageRef.current = { ...normalFilePage }
    setState((prev) => {
      prev.fileFolderList = []
      prev.fileFolderRows = []
      prev.fileList = []
      prev.fileListRows = []
      return prev
    })
  }

  /**
   * @Description 全选或取消全选
   * @Author bihongbin
   * @Date 2020-08-11 11:23:40
   */
  const clearSelected = (data: boolean) => {
    // 设置选中状态
    const arrFilter = (arr: FileItemType[]) => {
      return arr.map((k) => {
        k.selected = data
        return k
      })
    }
    // 获取选中的文件或文件夹
    const getArrIds = (data: FileItemType[]) => {
      return data.reduce<FileItemType[]>((arr, current) => {
        if (current.selected) {
          arr.push(current)
        }
        return arr
      }, [])
    }
    const fileFolderList = arrFilter([...state.fileFolderList])
    const fileList = arrFilter([...state.fileList])
    setState({
      // 设置文件夹全选或取消
      fileFolderList: fileFolderList,
      // 设置文件夹选中的数据
      fileFolderRows: getArrIds(fileFolderList),
      // 设置文件全选或取消
      fileList: fileList,
      // 设置文件选中的数据
      fileListRows: getArrIds(fileList),
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
   * @Description 退出管理
   * @Author bihongbin
   * @Date 2020-11-17 16:24:36
   */
  const exitManage = () => {
    setState({
      status: 0,
    })
    clearSelected(false)
  }

  /**
   * @Description 退出回收站
   * @Author bihongbin
   * @Date 2020-11-19 10:19:31
   */
  const exitRecycleBin = () => {
    searchRef.current = {
      searchName: '',
      selectValue: props.fileExt || '',
    }
    resetStateInit()
    setState({ status: 0 })
  }

  /**
   * @Description 获取选中的文件或文件夹id
   * @Author bihongbin
   * @Date 2020-11-17 16:00:19
   */
  const getArrIds = (data: FileItemType[]) => {
    return data.reduce<string[]>((arr, current) => {
      arr.push(current.id)
      return arr
    }, [])
  }

  /**
   * @Description 删除文件或文件夹（用来删除、还原、清空文件或文件夹）
   * @Author bihongbin
   * @Date 2020-11-17 16:01:29
   */
  const deleteFileOrFileFolder = async (params: {
    file: {
      status: number
      folderId?: string
      data: string[]
    }
    fileFolder: {
      status: number
      data: string[]
    }
  }) => {
    let msgText = ''
    if (params.file.status === 0) {
      msgText = '清空'
    }
    if (params.file.status === 1) {
      msgText = '还原'
    }
    if (params.file.status === 2) {
      msgText = '删除'
      params.file.folderId = state.parentId
    }
    try {
      // 文件夹操作
      if (params.fileFolder.data.length) {
        await editFileFolderListStatus(params.fileFolder)
      }
      // 文件操作
      if (params.file.data.length) {
        params.file.folderId = state.parentId
        if (params.file.status === 0) {
          await handleFileRelationList({ ids: params.file.data }, 'delete')
        } else if (params.file.status === 1) {
          await handleFileRelationList({ ids: params.file.data }, 'put')
        } else {
          await editFileListStatus(params.file)
        }
      }
      message.success(`${msgText}成功`, 1.5)
      setState({
        fileFolderList: _.pullAll(state.fileFolderList, state.fileFolderRows),
        fileFolderRows: [],
        fileList: _.pullAll(state.fileList, state.fileListRows),
        fileListRows: [],
      })
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(`${msgText}失败`)
    }
  }

  /**
   * @Description 删除文件
   * @Author bihongbin
   * @Date 2020-08-11 11:33:44
   */
  const handleDeleteFile = () => {
    if (!state.fileFolderRows.length && !state.fileListRows.length) {
      message.warn('请选择要删除的文件夹或文件', 1.5)
      return
    }
    confirm({
      title: '提示',
      width: 360,
      className: 'confirm-modal',
      content: '确定删除吗？',
      centered: true,
      onOk() {
        return deleteFileOrFileFolder({
          file: {
            status: 2,
            data: getArrIds(state.fileListRows),
          },
          fileFolder: {
            status: 2,
            data: getArrIds(state.fileFolderRows),
          },
        })
      },
    })
  }

  /**
   * @Description 进入回收站
   * @Author bihongbin
   * @Date 2020-11-19 10:28:25
   */
  const nextRecycleBin = () => {
    searchRef.current = {
      searchName: '',
      selectValue: props.fileExt || '',
    }
    resetStateInit()
    setState({
      status: 2,
    })
  }

  /**
   * @Description 获取回收站列表
   * @Author bihongbin
   * @Date 2020-11-18 18:01:56
   */
  const getRecycleBin = useCallback(async () => {
    const params = {
      cid: auth.user?.cid,
      originalFileName: searchRef.current.searchName,
      fileExt: searchRef.current.selectValue,
      sort: 'id-desc',
      page: filePageRef.current.page,
      size: filePageRef.current.size,
    }
    setState({
      loading: true,
    })
    try {
      const fileResult = await handleFileRelationList(params, 'get')
      filePageRef.current.pages = fileResult.data.pages
      setState((prev) => {
        prev.loading = false
        // 文件合并去重
        prev.fileList = _.unionBy(
          [...prev.fileList, ...fileResult.data.content],
          'id',
        )
        return prev
      })
    } catch (error) {
      setState({
        loading: false,
      })
    }
  }, [auth.user, setState])

  /**
   * @Description 回收站清空
   * @Author bihongbin
   * @Date 2020-08-11 11:40:08
   */
  const handleRecycleBinEmpty = () => {
    if (!state.fileFolderRows.length && !state.fileListRows.length) {
      message.warn('请选择要清空的文件或文件夹', 1.5)
      return
    }
    confirm({
      title: '提示',
      width: 360,
      className: 'confirm-modal',
      content: '文件删除后将无法恢复，您确认要彻底删除所选文件吗？',
      centered: true,
      onOk() {
        return deleteFileOrFileFolder({
          file: {
            status: 0,
            data: getArrIds(state.fileListRows),
          },
          fileFolder: {
            status: 0,
            data: getArrIds(state.fileFolderRows),
          },
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
    if (!state.fileFolderRows.length && !state.fileListRows.length) {
      message.warn('请选择要还原的文件或文件夹', 1.5)
      return
    }
    confirm({
      title: '提示',
      width: 360,
      className: 'confirm-modal',
      content: '确认还原选中的文件？',
      centered: true,
      onOk() {
        return deleteFileOrFileFolder({
          file: {
            status: 1,
            data: getArrIds(state.fileListRows),
          },
          fileFolder: {
            status: 1,
            data: getArrIds(state.fileFolderRows),
          },
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
            action={GlobalConstant.fileManageUploadHttp}
            multiple
            showUploadList={false}
            uploadSuccess={uploadSuccess}
            data={{
              cId: auth.user?.cid,
              folderId: state.parentId,
              sourceType: props.sourceType,
            }}
            accept={`.${props.fileExt}`}
          >
            <Button style={{ width: '88px' }}>上传</Button>
          </Upload>
          <Button
            onClick={() => {
              setState((prev) => {
                prev.newFolderModal.visible = true
                prev.newFolderModal.id = ''
                prev.newFolderModal.title = '新建文件夹'
                prev.newFolderModal.formList = [
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
                ]
                return prev
              })
            }}
          >
            新建文件夹
          </Button>
          {state.openManagement ? (
            <Button
              onClick={() => {
                setState({
                  status: 1,
                })
              }}
            >
              管理文件
            </Button>
          ) : null}
          <Breadcrumb className="breadcrumb-pointer">
            {state.fileLevel.map((item, index) => (
              <Breadcrumb.Item
                key={index}
                onClick={() => {
                  filePageRef.current = { ...normalFilePage }
                  setState({
                    parentId: item.id || '0',
                  })
                }}
              >
                {!item.id ? <HomeOutlined /> : item.name}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>
        </>
      )
    }
    // 文件管理状态
    if (state.status === 1) {
      return (
        <>
          <Button onClick={handleDeleteFile}>删除文件</Button>
          <Button onClick={exitManage}>退出管理</Button>
        </>
      )
    }
    // 回收站状态
    if (state.status === 2) {
      return (
        <>
          <Button onClick={handleRecycleBinRestore}>还原</Button>
          <Button onClick={handleRecycleBinEmpty}>清空</Button>
          <Button onClick={exitRecycleBin}>退出回收站</Button>
        </>
      )
    }
  }

  /**
   * @Description 开始查询
   * @Author bihongbin
   * @Date 2020-11-19 14:56:41
   */
  const onSearchChange = async () => {
    // 如果查询条件是空，查询文件夹
    if (!searchRef.current.searchName && !searchRef.current.selectValue) {
      await getFileFolderListData()
    }
    // 回收站状态
    if (state.status === 2) {
      await getRecycleBin()
    } else {
      await getFileListData()
    }
  }

  /**
   * @Description 切换文件类型
   * @Author bihongbin
   * @Date 2020-08-11 16:15:12
   */
  const onSearchSelectValue = (value: string) => {
    searchRef.current.selectValue = value
    setState((prev) => prev)
  }

  /**
   * @Description 更新查询输入框
   * @Author bihongbin
   * @Date 2020-11-19 15:03:52
   */
  const setSearchNameValue = (e: any) => {
    searchRef.current.searchName = e.target.value
    setState((prev) => prev)
  }

  /**
   * @Description 搜索
   * @Author bihongbin
   * @Date 2020-08-10 14:30:29
   */
  const onSearchText = async () => {
    resetStateInit()
    onSearchChange()
  }

  /**
   * @Description 重置
   * @Author bihongbin
   * @Date 2020-11-19 09:40:40
   */
  const onSearchReset = () => {
    searchRef.current = {
      searchName: '',
      selectValue: props.fileExt || '',
    }
    resetStateInit()
    onSearchChange()
  }

  /**
   * @Description 上传成功回调
   * @Author bihongbin
   * @Date 2020-08-10 18:28:03
   */
  const uploadSuccess = async (data: AnyObjectType[]) => {
    // 过滤拿出上传成功的文件
    let filterFileList = data.reduce<FileItemType[]>((arr, current) => {
      if (current.response && current.response.code === 1) {
        arr.push(current.response.data)
      }
      return arr
    }, [])
    message.destroy()
    message.success('上传成功', 1.5)
    setState((prev) => {
      prev.fileList = _.unionBy([...filterFileList, ...prev.fileList], 'id') // 合并去重
      return prev
    })
  }

  /**
   * @Description 获取面包屑
   * @Author bihongbin
   * @Date 2020-11-17 17:26:35
   */
  const getBreadcrumbTree = useCallback(async () => {
    try {
      // 面包屑导航
      const breadcrumbTree = await getFileFolderTree(state.parentId)
      if (breadcrumbTree.data) {
        let deepTreeArr: FileLevelType[] = []
        let deepTreeObj = (obj: FileLevelType) => {
          deepTreeArr.push(obj)
          if (obj.child) {
            deepTreeObj(obj.child)
          }
        }
        deepTreeObj(breadcrumbTree.data)
        deepTreeArr.unshift({ id: '', name: '', parentId: '0' })
        setState({
          fileLevel: deepTreeArr,
        })
      } else {
        setState({
          fileLevel: [],
        })
      }
    } catch (error) {}
  }, [setState, state.parentId])

  /**
   * @Description 获取文件夹列表
   * @Author bihongbin
   * @Date 2020-11-16 10:38:31
   */
  const getFileFolderListData = useCallback(async () => {
    const params = {
      cid: auth.user?.cid,
      parentId: state.parentId,
      name: searchRef.current.searchName,
      status: state.status === 2 ? 2 : 1,
    }
    setState({ loading: true })
    try {
      const result = await getFileFolderList(params)
      setState({ loading: false, fileFolderList: result.data.content })
    } catch (error) {
      setState({ loading: false })
    }
  }, [auth.user, setState, state.parentId, state.status])

  /**
   * @Description 获取文件列表
   * @Author bihongbin
   * @Date 2020-11-16 11:44:03
   */
  const getFileListData = useCallback(async () => {
    const params = {
      cid: auth.user?.cid,
      folderId: state.parentId,
      originalFileName: searchRef.current.searchName,
      fileExt: searchRef.current.selectValue,
      status: 1,
      sort: 'id-desc',
      page: filePageRef.current.page,
      size: filePageRef.current.size,
    }
    setState({ loading: true })
    try {
      const result = await getFileList(params)
      filePageRef.current.pages = result.data.pages
      setState((prev) => {
        prev.loading = false
        // 合并去重
        prev.fileList = _.unionBy(
          [...prev.fileList, ...result.data.content],
          'id',
        )
        return prev
      })
    } catch (error) {
      setState({ loading: false })
    }
  }, [auth.user, setState, state.parentId])

  /**
   * @Description 文件列表分页
   * @Author bihongbin
   * @Date 2020-11-18 16:53:51
   */
  const loadMore = () => {
    filePageRef.current.page = (Number(filePageRef.current.page) + 1).toString()
    // 回收站状态
    if (state.status === 2) {
      getRecycleBin()
    } else {
      getFileListData()
    }
  }

  /**
   * @Description 获取文件夹和文件
   * @Author bihongbin
   * @Date 2020-11-19 11:39:51
   */
  const getPageData = useCallback(async () => {
    // 正常状态
    if (state.status === 0) {
      await getFileFolderListData()
      await getFileListData()
    }
    // 回收站状态
    if (state.status === 2) {
      await getFileFolderListData()
      await getRecycleBin()
    }
  }, [getFileFolderListData, getFileListData, getRecycleBin, state.status])

  /**
   * @Description 更新面包屑
   * @Author bihongbin
   * @Date 2020-11-19 11:39:40
   */
  useEffect(() => {
    // 正常状态下获取面包屑
    if (state.status === 0) {
      getBreadcrumbTree()
    }
    getPageData()
  }, [getBreadcrumbTree, getPageData, state.parentId, state.status])

  /**
   * @Description 暴漏给父组件调用
   * @Author bihongbin
   * @Date 2020-11-18 15:35:21
   */
  useImperativeHandle<any, FileCenterCallType>(ref, () => ({
    // 获取选中的数据
    getSelectedFile: () => {
      return state.fileListRows
    },
  }))

  // 总页数
  const pages = parseInt(filePageRef.current.pages)
  // 当前页
  const page = parseInt(filePageRef.current.page)

  return (
    <FileManageContext.Provider
      value={{
        mainState: state,
        mainSetState: setState,
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
                  {!props.fileExt ? (
                    <Select
                      value={searchRef.current.selectValue}
                      style={{ width: 100 }}
                      bordered={false}
                      onChange={onSearchSelectValue}
                    >
                      {state.queryFile.selectList.map((item, index) => (
                        <Option value={item.value} key={index}>
                          {item.label}
                        </Option>
                      ))}
                    </Select>
                  ) : null}
                  <div className="ant-form form-ash-theme">
                    <div className="ant-form-item-control">
                      <Space>
                        <Input
                          className="search-input"
                          value={searchRef.current.searchName}
                          placeholder="请输入文件名"
                          prefix={<SearchOutlined />}
                          onPressEnter={onSearchText}
                          onChange={setSearchNameValue}
                        />
                        <Button type="primary" onClick={onSearchText}>
                          查询
                        </Button>
                        <Button onClick={onSearchReset}>重置</Button>
                      </Space>
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
              {state.openManagement ? (
                <Col>
                  {state.status !== 0 ? (
                    <Checkbox onChange={handleSelectedAll}>全选</Checkbox>
                  ) : (
                    <Button onClick={nextRecycleBin}>回收站</Button>
                  )}
                </Col>
              ) : null}
            </Row>
            <Spin delay={50} spinning={state.loading}>
              {state.fileFolderList.length || state.fileList.length ? (
                <div className="file-container mt-6">
                  <FileItems />
                  <Row justify="center">
                    {page < pages ? (
                      <span className="pointer" onClick={loadMore}>
                        {filePageRef.current.moreText}
                      </span>
                    ) : null}
                  </Row>
                </div>
              ) : (
                <Empty />
              )}
            </Spin>
          </Card>
        </>
      )}
      <NewFolderModal getFileFolderListData={getFileFolderListData} />
    </FileManageContext.Provider>
  )
}

export default forwardRef(FileMangeMainList)
