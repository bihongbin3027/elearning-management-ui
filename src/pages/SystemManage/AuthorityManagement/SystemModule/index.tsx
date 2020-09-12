import React, { useEffect, useRef, useReducer } from 'react'
import { Button, Row, Col, Divider, Avatar, message, Card } from 'antd'
import GenerateForm, {
  FormCallType,
  FormListType,
} from '@/components/GenerateForm'
import GenerateTable, { TableCallType } from '@/components/GenerateTable'
import { GlobalConstant } from '@/config'
import { AnyObjectType } from '@/typings'
import TableOperate from '@/components/TableOperate'
import { handleRowDelete } from '@/utils'
import LayoutFormModal, {
  LayoutFormModalCallType,
} from '@/components/LayoutFormModal'
import LayoutTableModal from '@/components/LayoutTableModal'
import IconSelectionModal from '@/pages/SystemManage/AuthorityManagement/IconSelectionModal'
import {
  getReportConfigSubheadList,
  setReportConfigSubheadDelete,
  getReportConfigSubItemList,
  setReportConfigSubItemDelete,
} from '@/api/report'

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_SEARCH_FORM_LIST = '[SetSearchFormList Action]',
  SET_TABLE_SYSTEM_COLUMNS = '[SetTableSystemColumns Action]',
  SET_TABLE_SYSTEM_CONFIG = '[SetTableSystemConfig Action]',
  SET_TABLE_SYSTEM_DETAILS_COLUMNS = '[setTableSystemDetailsColumns Action]',
  SET_SYSTEM_MODAL = '[SetSystemModal Action]',
  SET_SYSTEM_ICON_MODAL = '[SetSystemIconModal Action]',
  SET_TABLE_MODULE_COLUMNS = '[SetTableModuleColumns Action]',
  SET_TABLE_MODULE_CONFIG = '[SetTableModuleConfig Action]',
  SET_TABLE_MODULE_DETAIL_COLUMNS = '[SetTableModuleDetailColumns Action]',
  SET_MODULE_MODAL = '[SetModuleModal Action]',
  SET_MODULE_ICON_MODAL = '[SetModuleIconModal Action]',
  SET_CONFIG_SYSTEM_MODAL = '[SetConfigSystemModal Action]',
  SET_CONFIG_MODULE_MODAL = '[SetConfigModuleModal Action]',
}

const stateValue = {
  // 头部搜索数据
  searchFormList: [
    {
      componentName: 'Input',
      name: 'a',
      placeholder: '系统编码',
    },
    {
      componentName: 'Input',
      name: 'b',
      placeholder: '系统名称',
    },
  ] as FormListType[],
  // 系统表头
  tableSystemColumns: [],
  // 系统行宽度和选中项
  tableSystemConfig: {
    row: [] as AnyObjectType[],
    l: {
      xs: 24,
      sm: 24,
      xxl: 24,
    },
    r: {
      xs: 24,
      sm: 24,
      xxl: 0,
    },
  },
  // 系统详情表头
  tableSystemDetailsColumns: [],
  // 系统弹窗
  systemModal: {
    visible: false,
    disable: false,
    width: 640,
    title: '',
    id: '',
    submitApi: getReportConfigSubheadList,
    formList: [] as FormListType[],
  },
  // 系统图标弹窗
  systemIconModal: {
    visible: false,
    title: '系统图标选择',
    src: '',
  },
  // 模块表头
  tableModuleColumns: [],
  // 模块行宽度和选中项
  tableModuleConfig: {
    row: [] as AnyObjectType[],
    l: {
      xs: 24,
      sm: 24,
      xxl: 24,
    },
    r: {
      xs: 24,
      sm: 24,
      xxl: 0,
    },
  },
  // 模块详情表头
  tableModuleDetailColumns: [],
  // 模块弹窗
  moduleModal: {
    visible: false,
    disable: false,
    width: 640,
    title: '',
    id: '',
    submitApi: getReportConfigSubheadList,
    formList: [] as FormListType[],
  },
  // 模块图标弹窗
  moduleIconModal: {
    visible: false,
    title: '模块图标选择',
    src: '',
  },
  // 配置系统弹窗
  configSystemModal: {
    visible: false,
    title: '配置系统',
    apiMethod: getReportConfigSubheadList,
    width: 640,
    tableColumnsList: {
      rowType: 'checkbox' as 'checkbox',
      list: [
        {
          title: '系统名称',
          dataIndex: 'menuName',
        },
        {
          title: '系统编码',
          dataIndex: 'endTime',
        },
        {
          title: '',
          dataIndex: 'sortSeq',
        },
      ],
    },
  },
  // 配置模块弹窗
  configModuleModal: {
    visible: false,
    title: '配置模块',
    apiMethod: getReportConfigSubheadList,
    width: 640,
    tableColumnsList: {
      rowType: 'checkbox' as 'checkbox',
      list: [
        {
          title: '模块名称',
          dataIndex: 'menuName',
        },
        {
          title: '模块编码',
          dataIndex: 'endTime',
        },
      ],
    },
  },
}

const SystemModuleMainList = () => {
  const { formSearchColConfig } = GlobalConstant
  const searchFormRef = useRef<FormCallType>()
  const tableSystemRef = useRef<TableCallType>()
  const tableSystemDetailRef = useRef<TableCallType>()
  const systemFormModalRef = useRef<LayoutFormModalCallType>()
  const tableModuleRef = useRef<TableCallType>()
  const tableModuleDetailRef = useRef<TableCallType>()
  const moduleFormModalRef = useRef<LayoutFormModalCallType>()
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_SEARCH_FORM_LIST: // 设置头部搜索表单数据
        return {
          ...state,
          searchFormList: action.payload,
        }
      case ActionType.SET_TABLE_SYSTEM_COLUMNS: // 设置系统表头
        return {
          ...state,
          tableSystemColumns: action.payload,
        }
      case ActionType.SET_TABLE_SYSTEM_CONFIG: // 设置系统行宽度和选中项
        return {
          ...state,
          tableSystemConfig: action.payload,
        }
      case ActionType.SET_TABLE_SYSTEM_DETAILS_COLUMNS: // 设置系统详情表头
        return {
          ...state,
          tableSystemDetailsColumns: action.payload,
        }
      case ActionType.SET_SYSTEM_MODAL: // 设置系统弹窗数据
        return {
          ...state,
          systemModal: {
            ...state.systemModal,
            ...action.payload,
          },
        }
      case ActionType.SET_SYSTEM_ICON_MODAL: // 设置系统弹窗图标
        return {
          ...state,
          systemIconModal: {
            ...state.systemIconModal,
            ...action.payload,
          },
        }
      case ActionType.SET_TABLE_MODULE_COLUMNS: // 设置模块表头
        return {
          ...state,
          tableModuleColumns: action.payload,
        }
      case ActionType.SET_TABLE_MODULE_CONFIG: // 设置模块行宽度和选中项
        return {
          ...state,
          tableModuleConfig: action.payload,
        }
      case ActionType.SET_TABLE_MODULE_DETAIL_COLUMNS: // 设置模块详情表头
        return {
          ...state,
          tableModuleDetailColumns: action.payload,
        }
      case ActionType.SET_MODULE_MODAL: // 设置模块弹窗
        return {
          ...state,
          moduleModal: {
            ...state.moduleModal,
            ...action.payload,
          },
        }
      case ActionType.SET_MODULE_ICON_MODAL: // 设置模块弹窗图标
        return {
          ...state,
          moduleIconModal: {
            ...state.moduleIconModal,
            ...action.payload,
          },
        }
      case ActionType.SET_CONFIG_SYSTEM_MODAL: // 设置配置系统弹窗数据
        return {
          ...state,
          configSystemModal: {
            ...state.configSystemModal,
            ...action.payload,
          },
        }
      case ActionType.SET_CONFIG_MODULE_MODAL: // 设置配置模块弹窗数据
        return {
          ...state,
          configModuleModal: {
            ...state.configModuleModal,
            ...action.payload,
          },
        }
    }
  }, stateValue)

  /**
   * @Description 设置系统弹窗数据
   * @Author bihongbin
   * @Date 2020-08-06 17:51:36
   */
  const handleSystemModalState = (data: Partial<StateType['systemModal']>) => {
    dispatch({
      type: ActionType.SET_SYSTEM_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置模块弹窗数据
   * @Author bihongbin
   * @Date 2020-08-06 18:26:34
   */
  const handleModuleModalState = (data: Partial<StateType['moduleModal']>) => {
    dispatch({
      type: ActionType.SET_MODULE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置系统图标弹窗
   * @Author bihongbin
   * @Date 2020-08-06 18:03:31
   */
  const handleSystemIconState = (
    data: Partial<StateType['systemIconModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_SYSTEM_ICON_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置模块图标弹窗
   * @Author bihongbin
   * @Date 2020-08-06 18:39:59
   */
  const handleModuleIconState = (
    data: Partial<StateType['moduleIconModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_MODULE_ICON_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置配置系统弹窗数据
   * @Author bihongbin
   * @Date 2020-08-07 14:03:20
   */
  const handleConfigSystemState = (
    data: Partial<StateType['configSystemModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_CONFIG_SYSTEM_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置配置模块弹窗数据
   * @Author bihongbin
   * @Date 2020-08-07 14:18:31
   */
  const handleConfigModuleState = (
    data: Partial<StateType['configModuleModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_CONFIG_MODULE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 查询
   * @Author bihongbin
   * @Date 2020-08-06 14:43:00
   */
  const formSubmit = async () => {
    if (searchFormRef.current) {
      const result = await searchFormRef.current.formSubmit()
      if (result && tableSystemRef.current) {
        tableSystemRef.current.getTableList(result)
      }
    }
  }

  /**
   * @Description 重置
   * @Author bihongbin
   * @Date 2020-08-06 14:43:16
   */
  const formReset = () => {
    if (searchFormRef.current) {
      searchFormRef.current.formReset()
      formSubmit()
    }
  }

  /**
   * @Description 系统表格行选中
   * @Author bihongbin
   * @Date 2020-08-06 15:41:16
   */
  const handleTableSystemSelect = async (data: AnyObjectType[]) => {
    if (data.length) {
      dispatch({
        type: ActionType.SET_TABLE_SYSTEM_CONFIG,
        payload: {
          row: data,
          l: {
            xs: 24,
            sm: 24,
            xxl: 12,
          },
          r: {
            xs: 24,
            sm: 24,
            xxl: 12,
          },
        },
      })
      if (tableSystemDetailRef.current) {
        tableSystemDetailRef.current.getTableList({
          reportSubId: data[0].id,
        })
      }
    }
  }

  /**
   * @Description 编辑系统弹窗
   * @Author bihongbin
   * @Date 2020-08-06 18:14:46
   */
  const handleSystemEdit = () => {
    if (!state.tableSystemConfig.row.length) {
      message.warn('请选择系统数据', 1.5)
      return
    }
    handleSystemModalState({
      visible: true,
      disable: false,
      id: state.tableSystemConfig.row[0].id,
      title: '编辑系统',
    })
  }

  /**
   * @Description 模块表格行选中
   * @Author bihongbin
   * @Date 2020-08-06 17:06:24
   */
  const handleTableModuleSelect = async (data: AnyObjectType[]) => {
    if (data.length) {
      dispatch({
        type: ActionType.SET_TABLE_MODULE_CONFIG,
        payload: {
          row: data,
          l: {
            xs: 24,
            sm: 24,
            xxl: 12,
          },
          r: {
            xs: 24,
            sm: 24,
            xxl: 12,
          },
        },
      })
      if (tableModuleDetailRef.current) {
        tableModuleDetailRef.current.getTableList({
          reportSubId: data[0].id,
        })
      }
    }
  }

  /**
   * @Description 编辑模块弹窗
   * @Author bihongbin
   * @Date 2020-08-06 18:50:31
   */
  const handleModuleEdit = () => {
    if (!state.tableModuleConfig.row.length) {
      message.warn('请选择模块数据', 1.5)
      return
    }
    handleModuleModalState({
      visible: true,
      disable: false,
      id: state.tableModuleConfig.row[0].id,
      title: '编辑模块',
    })
  }

  /**
   * @Description 设置系统表头
   * @Author bihongbin
   * @Date 2020-08-06 17:15:59
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_TABLE_SYSTEM_COLUMNS,
      payload: [
        {
          width: 50,
          title: '序号',
          dataIndex: 'sortSeq',
        },
        {
          title: '系统编码',
          dataIndex: 'a1',
        },
        {
          title: '系统名称',
          dataIndex: 'b1',
        },
        {
          title: '负责人',
          dataIndex: 'c1',
        },
        {
          title: '失效时间',
          dataIndex: 'startTime',
        },
        {
          title: '失效时间',
          dataIndex: 'endTime',
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 60,
          render: (value: number, record: any) => {
            const operatingData = [
              {
                name: '删除',
                onClick: () => {
                  if (tableSystemRef.current) {
                    handleRowDelete(
                      [record.id],
                      setReportConfigSubheadDelete,
                      tableSystemRef.current.getTableList,
                    )
                  }
                },
                svg: 'table_delete.png',
              },
            ]
            return <TableOperate operateButton={operatingData} />
          },
        },
      ],
    })
  }, [])

  /**
   * @Description 设置系统详情表头
   * @Author bihongbin
   * @Date 2020-08-06 17:19:09
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_TABLE_SYSTEM_DETAILS_COLUMNS,
      payload: [
        {
          title: '',
          dataIndex: 'fieldLable',
        },
        {
          title: '',
          dataIndex: 'reportItemId',
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 60,
          render: (value: number, record: any) => {
            const operatingData = [
              {
                name: '删除',
                onClick: () => {
                  if (tableSystemDetailRef.current) {
                    handleRowDelete(
                      [record.id],
                      setReportConfigSubItemDelete,
                      tableSystemDetailRef.current.getTableList,
                    )
                  }
                },
                svg: 'table_delete.png',
              },
            ]
            return <TableOperate operateButton={operatingData} />
          },
        },
      ],
    })
  }, [])

  /**
   * @Description 设置系统弹窗表单数据
   * @Author bihongbin
   * @Date 2020-08-06 17:53:43
   */
  useEffect(() => {
    handleSystemModalState({
      formList: [
        {
          componentName: 'Input',
          name: 'a11',
          label: '系统编码',
          placeholder: '请输入系统编码',
          rules: [
            {
              required: true,
              message: '请输入系统编码',
            },
          ],
          disabled: state.systemModal.disable,
        },
        {
          componentName: 'Input',
          name: 'a12',
          label: '排序序号',
          placeholder: '请输入排序序号',
          disabled: state.systemModal.disable,
        },
        {
          componentName: 'Input',
          name: 'a13',
          label: '中文名称',
          placeholder: '请输入中文名称',
          rules: [
            {
              required: true,
              message: '请输入中文名称',
            },
          ],
          disabled: state.systemModal.disable,
        },
        {
          componentName: 'Input',
          name: 'a14',
          label: '英文名称',
          placeholder: '请输入英文名称',
          rules: [
            {
              required: true,
              message: '请输入英文名称',
            },
          ],
          disabled: state.systemModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'startTime',
          label: '生效日期',
          disabled: state.systemModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'endTime',
          label: '失效日期',
          disabled: state.systemModal.disable,
        },
        {
          componentName: 'Input',
          name: 'a15',
          label: '负责人',
          placeholder: '请输入负责人',
          disabled: state.systemModal.disable,
        },
        {
          componentName: 'Input',
          name: 'a16',
          label: '副负责人',
          placeholder: '请输入副负责人',
          disabled: state.systemModal.disable,
        },
        {
          componentName: 'Input',
          name: 'a17',
          label: '数据版本',
          placeholder: '请输入数据版本',
          disabled: state.systemModal.disable,
        },
        {
          componentName: 'HideInput',
          name: 'i',
          label: '系统图标',
          disabled: state.systemModal.disable,
          render: () => {
            return (
              <div
                className="mb-5"
                onClick={() => {
                  if (!state.systemModal.disable) {
                    handleSystemIconState({ visible: true })
                  }
                }}
              >
                <Avatar
                  className="pointer"
                  src={state.systemIconModal.src}
                  shape="square"
                  size="large"
                  alt="系统图标"
                />
                <span className="text-desc font-12 ml-2">
                  - 点击图标可以任意更换系统图标哦
                </span>
              </div>
            )
          },
        },
        {
          componentName: 'TextArea',
          name: 'remark',
          label: '备注',
          rows: 3,
          colProps: { span: 24 },
          placeholder: '请输入备注',
          disabled: state.systemModal.disable,
        },
      ],
    })
  }, [state.systemIconModal.src, state.systemModal.disable])

  /**
   * @Description 设置模块表头
   * @Author bihongbin
   * @Date 2020-08-06 17:22:45
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_TABLE_MODULE_COLUMNS,
      payload: [
        {
          width: 50,
          title: '序号',
          dataIndex: 'sortSeq',
        },
        {
          title: '模块编码',
          dataIndex: 'a1',
        },
        {
          title: '模块名称',
          dataIndex: 'b1',
        },
        {
          title: '负责人',
          dataIndex: 'c1',
        },
        {
          title: '失效时间',
          dataIndex: 'startTime',
        },
        {
          title: '失效时间',
          dataIndex: 'endTime',
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 60,
          render: (value: number, record: any) => {
            const operatingData = [
              {
                name: '删除',
                onClick: () => {
                  if (tableModuleRef.current) {
                    handleRowDelete(
                      [record.id],
                      setReportConfigSubheadDelete,
                      tableModuleRef.current.getTableList,
                    )
                  }
                },
                svg: 'table_delete.png',
              },
            ]
            return <TableOperate operateButton={operatingData} />
          },
        },
      ],
    })
  }, [])

  /**
   * @Description 设置模块详情表头
   * @Author bihongbin
   * @Date 2020-08-06 17:26:34
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_TABLE_MODULE_DETAIL_COLUMNS,
      payload: [
        {
          title: '',
          dataIndex: 'fieldLable',
        },
        {
          title: '',
          dataIndex: 'reportItemId',
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 60,
          render: (value: number, record: any) => {
            const operatingData = [
              {
                name: '删除',
                onClick: () => {
                  if (tableModuleDetailRef.current) {
                    handleRowDelete(
                      [record.id],
                      setReportConfigSubItemDelete,
                      tableModuleDetailRef.current.getTableList,
                    )
                  }
                },
                svg: 'table_delete.png',
              },
            ]
            return <TableOperate operateButton={operatingData} />
          },
        },
      ],
    })
  }, [])

  /**
   * @Description 设置模块弹窗表单数据
   * @Author bihongbin
   * @Date 2020-08-06 18:29:02
   */
  useEffect(() => {
    handleModuleModalState({
      formList: [
        {
          componentName: 'Input',
          name: 'b11',
          label: '模块编码',
          placeholder: '请输入模块编码',
          rules: [
            {
              required: true,
              message: '请输入模块编码',
            },
          ],
          disabled: state.moduleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'b12',
          label: '应用级别',
          placeholder: '请输入应用级别',
          rules: [
            {
              required: true,
              message: '请输入应用级别',
            },
          ],
          disabled: state.moduleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'b13',
          label: '中文名称',
          placeholder: '请输入中文名称',
          rules: [
            {
              required: true,
              message: '请输入中文名称',
            },
          ],
          disabled: state.moduleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'b14',
          label: '英文名称',
          placeholder: '请输入英文名称',
          rules: [
            {
              required: true,
              message: '请输入英文名称',
            },
          ],
          disabled: state.moduleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'b15',
          label: '模块标记',
          placeholder: '请输入模块标记',
          rules: [
            {
              required: true,
              message: '请输入模块标记',
            },
          ],
          disabled: state.moduleModal.disable,
        },
        {
          componentName: 'HideInput',
          name: 'b16',
          label: '模块图标',
          disabled: state.moduleModal.disable,
          render: () => {
            return (
              <div
                className="mb-5"
                onClick={() => {
                  if (!state.moduleModal.disable) {
                    handleModuleIconState({ visible: true })
                  }
                }}
              >
                <Avatar
                  className="pointer"
                  src={state.moduleIconModal.src}
                  shape="square"
                  size="large"
                  alt="模块图标"
                />
                <span className="text-desc font-12 ml-2">
                  - 点击图标可以任意更换模块图标哦
                </span>
              </div>
            )
          },
        },
        {
          componentName: 'Input',
          name: 'b17',
          label: '排序序号',
          placeholder: '请输入排序序号',
          disabled: state.moduleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'b18',
          label: '版本',
          placeholder: '请输入版本',
          disabled: state.moduleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'b19',
          label: '负责人',
          placeholder: '请输入负责人',
          disabled: state.moduleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'b20',
          label: '副负责人',
          placeholder: '请输入副负责人',
          disabled: state.moduleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'startTime',
          label: '生效日期',
          disabled: state.moduleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'endTime',
          label: '失效日期',
          disabled: state.moduleModal.disable,
        },
        {
          componentName: 'TextArea',
          name: 'remark',
          label: '备注',
          rows: 3,
          colProps: { span: 24 },
          placeholder: '请输入备注',
          disabled: state.moduleModal.disable,
        },
      ],
    })
  }, [state.moduleIconModal.src, state.moduleModal.disable])

  /**
   * @Description 初始化系统数据
   * @Author bihongbin
   * @Date 2020-08-06 15:17:12
   */
  useEffect(() => {
    formSubmit() // 查询系统
    if (tableModuleRef.current) {
      tableModuleRef.current.getTableList() // 查询模块
    }
  }, [])

  return (
    <>
      <GenerateForm
        className="search-form"
        rowGridConfig={{ gutter: 10 }}
        colGirdConfig={formSearchColConfig}
        ref={searchFormRef}
        list={state.searchFormList}
        render={() => (
          <>
            <Button type="primary" onClick={formSubmit}>
              查询
            </Button>
            <Button className="btn-reset ml-3" onClick={formReset}>
              重置
            </Button>
          </>
        )}
      />
      <Row gutter={[20, 20]}>
        <Col {...state.tableSystemConfig.l}>
          <Card
            className="table-card"
            style={{ minHeight: '100%' }}
            title="系统"
            extra={
              <>
                <Button
                  type="text"
                  onClick={() => {
                    handleSystemModalState({
                      visible: true,
                      disable: false,
                      title: '新增系统',
                    })
                  }}
                >
                  新增
                </Button>
                <Divider type="vertical" />
                <Button type="text" onClick={handleSystemEdit}>
                  编辑
                </Button>
              </>
            }
          >
            <GenerateTable
              ref={tableSystemRef}
              rowType="radio"
              apiMethod={getReportConfigSubheadList}
              columns={state.tableSystemColumns}
              scroll={{ x: 1000, y: 500 }}
              onSelect={handleTableSystemSelect}
            />
          </Card>
        </Col>
        <Col {...state.tableSystemConfig.r}>
          <Card
            className="table-card table-header-hidden"
            style={{ minHeight: '100%' }}
            title={
              state.tableSystemConfig.row.length &&
              state.tableSystemConfig.row[0].menuName
            }
            extra={
              <>
                <Button
                  type="text"
                  onClick={() => {
                    handleConfigSystemState({
                      visible: true,
                      title: 'xxxx-配置模块',
                    })
                  }}
                >
                  新增
                </Button>
                <Divider type="vertical" />
                <Button type="text">编辑</Button>
              </>
            }
          >
            <GenerateTable
              ref={tableSystemDetailRef}
              apiMethod={getReportConfigSubItemList}
              columns={state.tableSystemDetailsColumns}
              tableConfig={{
                pagination: false,
              }}
            />
          </Card>
        </Col>
      </Row>
      <Row gutter={[20, 20]}>
        <Col {...state.tableModuleConfig.l}>
          <Card
            className="table-card"
            style={{ minHeight: '100%' }}
            title="模块"
            extra={
              <>
                <Button
                  type="text"
                  onClick={() => {
                    handleModuleModalState({
                      visible: true,
                      disable: false,
                      title: '新增模块',
                    })
                  }}
                >
                  新增
                </Button>
                <Divider type="vertical" />
                <Button type="text" onClick={handleModuleEdit}>
                  编辑
                </Button>
              </>
            }
          >
            <GenerateTable
              ref={tableModuleRef}
              rowType="radio"
              apiMethod={getReportConfigSubheadList}
              columns={state.tableModuleColumns}
              scroll={{ x: 1000, y: 500 }}
              onSelect={handleTableModuleSelect}
            />
          </Card>
        </Col>
        <Col {...state.tableModuleConfig.r}>
          <Card
            className="table-card table-header-hidden"
            style={{ minHeight: '100%' }}
            title={
              state.tableModuleConfig.row.length &&
              state.tableModuleConfig.row[0].menuName
            }
            extra={
              <>
                <Button
                  type="text"
                  onClick={() => {
                    handleConfigSystemState({
                      visible: true,
                      title: 'xxxx-配置系统',
                    })
                  }}
                >
                  新增
                </Button>
                <Divider type="vertical" />
                <Button type="text">编辑</Button>
              </>
            }
          >
            <GenerateTable
              ref={tableModuleDetailRef}
              apiMethod={getReportConfigSubItemList}
              columns={state.tableModuleDetailColumns}
              tableConfig={{
                pagination: false,
              }}
            />
          </Card>
        </Col>
      </Row>
      <LayoutFormModal
        ref={systemFormModalRef}
        onCancel={() => handleSystemModalState({ visible: false })}
        {...state.systemModal}
      />
      <IconSelectionModal
        {...state.systemIconModal}
        onCancel={() => handleSystemIconState({ visible: false })}
        onConfirm={(item) => {
          systemFormModalRef.current?.setFormValues({
            i: item.src,
          })
          handleSystemIconState({
            visible: false,
            src: item.src,
          })
        }}
      />
      <LayoutFormModal
        ref={moduleFormModalRef}
        onCancel={() => handleModuleModalState({ visible: false })}
        {...state.moduleModal}
      />
      <IconSelectionModal
        {...state.moduleIconModal}
        onCancel={() => handleModuleIconState({ visible: false })}
        onConfirm={(item) => {
          moduleFormModalRef.current?.setFormValues({
            b16: item.src,
          })
          handleModuleIconState({
            visible: false,
            src: item.src,
          })
        }}
      />
      <LayoutTableModal
        {...state.configSystemModal}
        onCancel={() => handleConfigSystemState({ visible: false })}
        onConfirm={(data) => {
          console.log('配置系统：', data)
          return Promise.resolve(true)
        }}
      />
      <LayoutTableModal
        {...state.configModuleModal}
        onCancel={() => handleConfigModuleState({ visible: false })}
        onConfirm={(data) => {
          console.log('配置模块：', data)
          return Promise.resolve(true)
        }}
      />
    </>
  )
}

export default SystemModuleMainList
