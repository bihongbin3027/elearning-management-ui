import React, { useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { Avatar, message } from 'antd'
import { ColumnType } from 'antd/es/table'
import { RootStateType } from '@/store/rootReducer'
import useSetState from '@/hooks/useSetState'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
  CardButtonType,
} from '@/components/LayoutTableList'
import { AnyObjectType } from '@/typings'
import TableOperate, { TableOperateButtonType } from '@/components/TableOperate'
import { handleRowDelete } from '@/utils'
import LayoutFormModal, {
  LayoutFormModalCallType,
  LayoutFormPropTypes,
} from '@/components/LayoutFormModal'
import LayoutTableModal, {
  LayoutTableModalPropType,
  LayoutTableModalCallType,
} from '@/components/LayoutTableModal'
import IconSelectionModal from '@/pages/SystemManage/AuthorityManagement/IconSelectionModal'
import layoutStore from '@/store/module/layout'
import { GlobalConstant } from '@/config'
import { getModuleList, handleModuleList } from '@/api/systemManage/module'
import {
  getSystemList,
  handleSystemList,
  getSystemModule,
  setSystemModule,
  deleteSystemModule,
} from '@/api/systemManage/system'

interface GridType {
  xs: number
  sm: number
  xxl: number
}

interface StateType {
  searchFormList: FormListCallType[]
  tableSystemColumns: ColumnType<AnyObjectType>[]
  cardSystemHandleButtonList: CardButtonType[]
  tableSystemConfig: {
    row: AnyObjectType[]
    l: GridType
    r: GridType
  }
  systemIconModal: {
    visible: boolean
    title: string
    src: string
  }
  systemModal: LayoutFormPropTypes
  tableModuleColumns: ColumnType<AnyObjectType>[]
  cardModuleHandleButtonList: CardButtonType[]
  tableModuleData: AnyObjectType[]
  moduleModal: LayoutFormPropTypes
  moduleIconModal: {
    visible: boolean
    title: string
    src: string
  }
  configModuleModal: LayoutTableModalPropType
}

const SystemConfig = () => {
  const dispatchRedux = useDispatch()
  const authBasic = GlobalConstant.buttonPermissions.basic // 基础权限
  const systemConfig =
    GlobalConstant.menuPermissionsCode.systemManagement.systemConfig // 菜单code
  const tableSystemRef = useRef<LayoutTableCallType>()
  const tableModuleRef = useRef<LayoutTableCallType>()
  const systemFormModalRef = useRef<LayoutFormModalCallType>()
  const moduleFormModalRef = useRef<LayoutFormModalCallType>()
  const tableModalRef = useRef<LayoutTableModalCallType>()
  const {
    useLevelSelectList, // 使用等级
  } = useSelector((state: RootStateType) => ({
    ...state.layout,
  }))
  const [state, setState] = useSetState<StateType>({
    // 头部搜索数据
    searchFormList: [
      {
        componentName: 'Input',
        name: 'sysCode',
        placeholder: '系统编码',
      },
      {
        componentName: 'Input',
        name: 'sysCname',
        placeholder: '系统名称',
      },
    ],
    // 系统表头
    tableSystemColumns: [],
    // 系统卡片头部操作按钮
    cardSystemHandleButtonList: [],
    // 系统行宽度和选中项
    tableSystemConfig: {
      row: [],
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
    // 系统弹窗
    systemModal: {
      visible: false,
      width: 640,
      title: '',
      id: '',
      submitApi: handleSystemList,
      formList: [],
    },
    // 系统图标弹窗
    systemIconModal: {
      visible: false,
      title: '系统图标选择',
      src: '',
    },
    // 模块表头
    tableModuleColumns: [],
    // 模块卡片头部操作按钮
    cardModuleHandleButtonList: [],
    // 模块表格数据
    tableModuleData: [],
    // 模块弹窗
    moduleModal: {
      visible: false,
      width: 640,
      title: '',
      id: '',
      submitApi: handleModuleList,
      formList: [],
    },
    // 模块图标弹窗
    moduleIconModal: {
      visible: false,
      title: '模块图标选择',
      src: '',
    },
    // 配置模块弹窗
    configModuleModal: {
      visible: false,
      title: '配置模块',
      apiMethod: getModuleList,
      width: 640,
      tableColumnsList: {
        tableConfig: {
          className: 'table-header-grey',
          scroll: { y: 500 },
        },
        rowType: 'checkbox',
        list: [
          {
            title: '模块名称',
            dataIndex: 'moduleCname',
          },
          {
            title: '模块编码',
            dataIndex: 'moduleCode',
          },
        ],
      },
    },
  })

  /**
   * @Description 系统表格行选中
   * @Author bihongbin
   * @Date 2020-08-06 15:41:16
   */
  const handleTableSystemSelect = async (data: AnyObjectType[]) => {
    if (data.length) {
      setState({
        tableSystemConfig: {
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
      uploadSystemModuleData(data[0].id)
    }
  }

  /**
   * @Description 获取模块表格数据
   * @Author bihongbin
   * @Date 2020-10-28 11:31:58
   */
  const getSystemDetails = async (id: string) => {
    if (systemFormModalRef.current) {
      systemFormModalRef.current.setFormLoading(true)
      try {
        const result = await handleSystemList(
          {
            id,
          },
          'get',
        )
        systemFormModalRef.current.setFormValues({
          sysCode: result.data.sysCode,
          sysCname: result.data.sysCname,
          sysEname: result.data.sysEname,
          sysLeader2Name: result.data.sysLeader2Name,
          sysLeaderName: result.data.sysLeaderName,
          picture1Name: result.data.picture1Name,
          version: result.data.version,
          sortSeq: result.data.sortSeq,
          startTime: moment(result.data.startTime),
          endTime: moment(result.data.endTime),
          remark: result.data.remark,
        })
      } catch (error) {}
      systemFormModalRef.current.setFormLoading(false)
    }
  }

  /**
   * @Description 获取模块详情
   * @Author bihongbin

   * @Date 2020-10-29 09:36:54
   */
  const getModuleDetails = async (id: string) => {
    if (moduleFormModalRef.current) {
      moduleFormModalRef.current.setFormLoading(true)
      try {
        const result = await handleModuleList(
          {
            id,
          },
          'get',
        )
        moduleFormModalRef.current.setFormValues({
          moduleCode: result.data.moduleCode,
          permissionGrade: result.data.permissionGrade,
          moduleCname: result.data.moduleCname,
          moduleEname: result.data.moduleEname,
          moduleFlag: String(result.data.moduleFlag),
          modulePicture1Name: result.data.modulePicture1Name,
          sortSeq: result.data.sortSeq,
          moduleVersion: result.data.moduleVersion,
          moduleLeader2Name: result.data.moduleLeader2Name,
          moduleLeaderName: result.data.moduleLeaderName,
          startTime: moment(result.data.startTime),
          endTime: moment(result.data.endTime),
          remark: result.data.remark,
        })
      } catch (error) {}
      moduleFormModalRef.current.setFormLoading(false)
    }
  }

  /**
   * @Description 更新系统下的模块
   * @Author bihongbin
   * @Date 2020-10-28 17:58:02
   */
  const uploadSystemModuleData = useCallback(
    async (id: string) => {
      if (tableModuleRef.current) {
        tableModuleRef.current.setTableLoading(true)
        try {
          const result = await getSystemModule({
            id,
          })
          setState({
            tableModuleData: result.data,
          })
        } catch (error) {}
        tableModuleRef.current.setTableLoading(false)
      }
    },
    [setState],
  )

  /**
   * @Description 设置系统下的模块
   * @Author bihongbin
   * @Date 2020-10-28 17:46:37
   */
  const setSystemModuleData = async (data: AnyObjectType[]) => {
    const row = state.tableSystemConfig.row[0]
    try {
      await setSystemModule({
        id: row.id,
        ids: data.reduce((arr, current) => {
          arr.push(current.id)
          return arr
        }, []),
      })
      message.success('操作成功', 1.5)
      uploadSystemModuleData(row.id) // 更新系统下的模块
      return Promise.resolve(true)
    } catch (error) {
      return Promise.reject(false)
    }
  }

  /**
   * @Description 设置系统卡片操作按钮数据
   * @Author bihongbin
   * @Date 2020-08-07 15:32:06
   */
  useEffect(() => {
    setState({
      cardSystemHandleButtonList: [
        {
          name: '新增',
          authCode: authBasic.ADD,
          icon: 'icon_list_add.png',
          clickConfirm: () => {
            setState((prev) => {
              prev.systemModal.visible = true
              prev.systemModal.id = ''
              prev.systemModal.title = '新增系统'
              return prev
            })
          },
        },
      ],
    })
  }, [authBasic.ADD, setState, systemConfig.code])

  /**
   * @Description 设置模块卡片操作按钮数据
   * @Author bihongbin
   * @Date 2020-10-29 11:02:03
   */
  useEffect(() => {
    setState({
      cardModuleHandleButtonList: [
        {
          name: '新增',
          authCode: authBasic.ADD,
          icon: 'icon_list_add.png',
          clickConfirm: () => {
            setState((prev) => {
              prev.configModuleModal.visible = true
              prev.configModuleModal.title =
                state.tableSystemConfig.row.length &&
                `${state.tableSystemConfig.row[0].sysCname}-配置模块`
              return prev
            })
          },
        },
      ],
    })
  }, [authBasic.ADD, setState, state.tableSystemConfig.row])

  /**
   * @Description 设置系统表头
   * @Author bihongbin
   * @Date 2020-08-06 17:15:59
   */
  useEffect(() => {
    setState({
      tableSystemColumns: [
        {
          width: 80,
          title: '序号',
          dataIndex: 'sortSeq',
          ellipsis: true,
        },
        {
          title: '系统编码',
          dataIndex: 'sysCode',
          ellipsis: true,
        },
        {
          title: '系统名称',
          dataIndex: 'sysCname',
          ellipsis: true,
        },
        {
          title: '负责人',
          dataIndex: 'sysLeader2Name',
          ellipsis: true,
        },
        {
          title: '生效时间',
          dataIndex: 'startTime',
          ellipsis: true,
        },
        {
          title: '失效时间',
          dataIndex: 'endTime',
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 90,
          render: (value: number, record: any) => {
            const operatingData: TableOperateButtonType[] = []
            // 编辑
            operatingData.push({
              name: '编辑',
              authCode: authBasic.EDIT,
              svg: 'table_edit.png',
              onClick: () => {
                setState((prev) => {
                  prev.systemModal.visible = true
                  prev.systemModal.id = record.id
                  prev.systemModal.title = '编辑系统'
                  return prev
                })
                getSystemDetails(record.id)
              },
            })
            // 删除
            operatingData.push({
              name: '删除',
              authCode: authBasic.DELETE,
              svg: 'table_delete.png',
              onClick: () => {
                if (tableSystemRef.current) {
                  handleRowDelete(
                    [record.id],
                    handleSystemList,
                    tableSystemRef.current.getTableList,
                  )
                }
              },
            })
            return (
              <TableOperate
                menuCode={systemConfig.code}
                operateButton={operatingData}
              />
            )
          },
        },
      ],
    })
  }, [authBasic.DELETE, authBasic.EDIT, setState, systemConfig.code])

  /**
   * @Description 设置模块表头
   * @Author bihongbin
   * @Date 2020-08-06 17:19:09
   */
  useEffect(() => {
    setState({
      tableModuleColumns: [
        {
          title: '模块名称',
          dataIndex: 'moduleCode',
          ellipsis: true,
        },
        {
          title: '模块编码',
          dataIndex: 'moduleCname',
          ellipsis: true,
        },
        {
          title: '权限级别',
          dataIndex: 'permissionGrade',
          ellipsis: true,
          render: (value: string) => {
            let result = useLevelSelectList.find((item) => item.value === value)
            return result && result.label
          },
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 90,
          render: (value: number, record: any) => {
            const operatingData: TableOperateButtonType[] = []
            // 编辑
            operatingData.push({
              name: '编辑',
              authCode: authBasic.EDIT,
              svg: 'table_edit.png',
              onClick: () => {
                setState((prev) => {
                  prev.moduleModal.visible = true
                  prev.moduleModal.id = record.moduleId
                  prev.moduleModal.title = '编辑模块'
                  return prev
                })
                getModuleDetails(record.moduleId)
              },
            })
            // 删除
            operatingData.push({
              name: '删除',
              authCode: authBasic.DELETE,
              svg: 'table_delete.png',
              onClick: () => {
                handleRowDelete([record.id], deleteSystemModule, () => {
                  const row = state.tableSystemConfig.row[0]
                  uploadSystemModuleData(row.id) // 更新系统下的模块
                })
              },
            })
            return (
              <TableOperate
                menuCode={systemConfig.code}
                operateButton={operatingData}
              />
            )
          },
        },
      ],
    })
  }, [
    authBasic.DELETE,
    authBasic.EDIT,
    setState,
    state.tableSystemConfig.row,
    systemConfig.code,
    uploadSystemModuleData,
    useLevelSelectList,
  ])

  /**
   * @Description 设置系统弹窗表单数据
   * @Author bihongbin
   * @Date 2020-08-06 17:53:43
   */
  useEffect(() => {
    setState((prev) => {
      prev.systemModal.formList = [
        {
          componentName: 'Input',
          name: 'sysCode',
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
          name: 'sysCname',
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
          name: 'sysEname',
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
          componentName: 'Input',
          name: 'sysLeader2Name',
          label: '负责人',
          placeholder: '请输入负责人',
          disabled: state.systemModal.disable,
        },
        {
          componentName: 'Input',
          name: 'sysLeaderName',
          label: '副负责人',
          placeholder: '请输入副负责人',
          disabled: state.systemModal.disable,
        },
        // TODO 图标功能未做
        {
          componentName: 'HideInput',
          name: 'picture1Name',
          label: '系统图标',
          disabled: state.systemModal.disable,
          render: () => {
            return (
              <div
                className="mb-5"
                onClick={() => {
                  if (!state.systemModal.disable) {
                    setState((prev) => {
                      prev.systemIconModal.visible = true
                      return prev
                    })
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
          componentName: 'Input',
          name: 'sortSeq',
          label: '排序序号',
          placeholder: '请输入排序序号',
          disabled: state.systemModal.disable,
        },
        {
          componentName: 'Input',
          name: 'version',
          label: '数据版本',
          disabled: true,
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
          componentName: 'TextArea',
          name: 'remark',
          label: '备注',
          rows: 3,
          colProps: { span: 24 },
          placeholder: '请输入备注',
          disabled: state.systemModal.disable,
        },
      ]
      return prev
    })
  }, [setState, state.systemIconModal.src, state.systemModal.disable])

  /**
   * @Description 设置模块弹窗表单数据
   * @Author bihongbin
   * @Date 2020-08-06 18:29:02
   */
  useEffect(() => {
    setState((prev) => {
      prev.moduleModal.formList = [
        {
          componentName: 'Input',
          name: 'moduleCode',
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
          componentName: 'Select',
          name: 'permissionGrade',
          label: '应用级别',
          placeholder: '请选择应用级别',
          rules: [
            {
              required: true,
              message: '请选择应用级别',
            },
          ],
          selectData: useLevelSelectList,
          disabled: state.moduleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'moduleCname',
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
          name: 'moduleEname',
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
          componentName: 'Select',
          name: 'moduleFlag',
          label: '模块标记',
          placeholder: '请选择模块标记',
          rules: [
            {
              required: true,
              message: '请选择模块标记',
            },
          ],
          selectData: [
            { label: '共用模块', value: '0' },
            { label: '内部使用', value: '1' },
            { label: '外部使用', value: '2' },
          ],
          disabled: state.moduleModal.disable,
        },
        // TODO 图标功能未做
        {
          componentName: 'HideInput',
          name: 'modulePicture1Name',
          label: '模块图标',
          disabled: state.moduleModal.disable,
          render: () => {
            return (
              <div
                className="mb-5"
                onClick={() => {
                  if (!state.moduleModal.disable) {
                    setState((prev) => {
                      prev.moduleIconModal.visible = true
                      return prev
                    })
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
                  - 请选择自己心仪的模块图标
                </span>
              </div>
            )
          },
        },
        {
          componentName: 'Input',
          name: 'sortSeq',
          label: '排序序号',
          placeholder: '请输入排序序号',
          disabled: state.moduleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'moduleVersion',
          label: '版本',
          disabled: true,
        },
        {
          componentName: 'Input',
          name: 'moduleLeader2Name',
          label: '负责人',
          placeholder: '请输入负责人',
          disabled: state.moduleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'moduleLeaderName',
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
      ]
      return prev
    })
  }, [
    setState,
    state.moduleIconModal.src,
    state.moduleModal.disable,
    useLevelSelectList,
  ])

  /**
   * @Description 选择配置默认选中
   * @Author bihongbin
   * @Date 2020-10-29 16:19:50
   */
  useEffect(() => {
    if (state.configModuleModal.visible) {
      const tableList = tableModuleRef.current?.getStaticDataList()
      if (tableList) {
        const ids = tableList.reduce<string[]>((arr, item) => {
          arr.push(item.moduleId)
          return arr
        }, [])
        tableModalRef.current?.LayoutTableListRef()?.setRowSelected(ids)
      }
    }
  }, [state.configModuleModal.visible])

  /**
   * @Description 数据字典
   * @Author bihongbin
   * @Date 2020-10-14 12:03:00
   */
  useEffect(() => {
    // 使用等级
    dispatchRedux(
      layoutStore.actions.getDictionary({
        code: 'RBAC_PERMISSION_GRADE',
        saveName: 'useLevelSelectList',
      }),
    )
  }, [dispatchRedux])

  return (
    <div className="mt-4">
      <LayoutTableList
        ref={tableSystemRef}
        api={getSystemList}
        layoutTableListAuthCode={systemConfig.code}
        autoGetList
        searchFormList={state.searchFormList}
        cardTopTitle="系统"
        cardTopButton={state.cardSystemHandleButtonList}
        tableColumnsList={{
          rowType: 'radio',
          list: state.tableSystemColumns,
          size: state.tableSystemConfig.l,
          onSelect: handleTableSystemSelect,
          tableConfig: {
            scroll: { x: 1300, y: 500 },
          },
        }}
        rightRender={{
          size: state.tableSystemConfig.r,
          jsx: (
            <LayoutTableList
              ref={tableModuleRef}
              data={state.tableModuleData}
              searchRightBtnOpen={false}
              cardTopButton={state.cardModuleHandleButtonList}
              cardTopTitle={
                state.tableSystemConfig.row.length &&
                `${state.tableSystemConfig.row[0].sysCode} ${state.tableSystemConfig.row[0].sysCname}`
              }
              tableColumnsList={{
                list: state.tableModuleColumns,
              }}
            />
          ),
        }}
      />
      <LayoutFormModal
        ref={systemFormModalRef}
        onCancel={() => {
          setState((prev) => {
            prev.systemModal.visible = false
            return prev
          })
        }}
        onConfirm={() => tableSystemRef.current?.getTableList()}
        {...state.systemModal}
      />
      <IconSelectionModal
        {...state.systemIconModal}
        onCancel={() => {
          setState((prev) => {
            prev.systemIconModal.visible = false
            return prev
          })
        }}
        onConfirm={(item) => {
          systemFormModalRef.current?.setFormValues({
            i: item.src,
          })
          setState((prev) => {
            prev.systemIconModal.visible = false
            prev.systemIconModal.src = item.src
            return prev
          })
        }}
      />
      <LayoutTableModal
        ref={tableModalRef}
        {...state.configModuleModal}
        onCancel={() => {
          setState((prev) => {
            prev.configModuleModal.visible = false
            return prev
          })
        }}
        onConfirm={(data) => setSystemModuleData(data)}
      />
      <LayoutFormModal
        ref={moduleFormModalRef}
        formConfig={{
          initialValues: {
            moduleFlag: '1',
          },
        }}
        onCancel={() => {
          setState((prev) => {
            prev.moduleModal.visible = false
            return prev
          })
        }}
        {...state.moduleModal}
      />
      <IconSelectionModal
        {...state.moduleIconModal}
        onCancel={() => {
          setState((prev) => {
            prev.moduleIconModal.visible = false
            return prev
          })
        }}
        onConfirm={(item) => {
          moduleFormModalRef.current?.setFormValues({
            b16: item.src,
          })
          setState((prev) => {
            prev.moduleIconModal.visible = false
            prev.moduleIconModal.src = item.src
            return prev
          })
        }}
      />
    </div>
  )
}

export default SystemConfig
