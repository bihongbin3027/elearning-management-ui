import React, { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { ColumnType } from 'antd/es/table'
import useSetState from '@/hooks/useSetState'
import { RootStateType } from '@/store/rootReducer'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
  CardButtonType,
} from '@/components/LayoutTableList'
import LayoutFormModal, {
  LayoutFormModalCallType,
  LayoutFormPropTypes,
} from '@/components/LayoutFormModal'
import { GlobalConstant } from '@/config'
import layoutStore from '@/store/module/layout'
import TableOperate, { TableOperateButtonType } from '@/components/TableOperate'
import { handleRowEnableDisable, handleRowDelete } from '@/utils'
import { AnyObjectType } from '@/typings'
import {
  statusData,
  persistFlagData,
  authFlagData,
  publicFlagData,
  scopeFlagData,
} from '@/config/selectData'
import {
  getResourceButtonMenuList,
  switchResourceRowsList,
  handleResourceButtonList,
} from '@/api/systemManage/menu'

interface StateType {
  searchFormList: FormListCallType[]
  cardHandleButtonList: CardButtonType[]
  tableColumnsList: ColumnType<AnyObjectType>[]
  handleModal: LayoutFormPropTypes
}

const PageAuthMainList = () => {
  const dispatchRedux = useDispatch()
  const authBasic = GlobalConstant.buttonPermissions.basic // 基础权限
  const layoutTableRef = useRef<LayoutTableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const {
    resourceClassSelectList, // 资源分类
    requestMethodSelectList, // 请求方式
    contentSelectList, // 响应类型
  } = useSelector((state: RootStateType) => ({
    ...state.layout,
  }))
  const [state, setState] = useSetState<StateType>({
    // 头部搜索表单数据
    searchFormList: [
      {
        componentName: 'Input',
        name: 'resourceName',
        placeholder: '权限名称',
      },
      {
        componentName: 'Input',
        name: 'resourceCode',
        placeholder: '权限编号',
      },
      {
        componentName: 'Select',
        name: 'status',
        placeholder: '状态',
        selectData: statusData,
      },
    ],
    cardHandleButtonList: [], // 卡片操作按钮
    tableColumnsList: [], // 表格数据列表表头数据
    // 新增编辑查看弹窗
    handleModal: {
      visible: false,
      disable: false,
      id: '',
      title: '',
      submitApi: handleResourceButtonList,
      formList: [],
    },
  })

  /**
   * @Description 获取详情
   * @Author bihongbin
   * @Date 2020-10-27 16:31:11
   */
  const getDetails = async (id: string) => {
    if (layoutFormModalRef.current) {
      layoutFormModalRef.current.setFormLoading(true)
      try {
        const result = await handleResourceButtonList(
          {
            id,
          },
          'get',
        )
        layoutFormModalRef.current.setFormValues({
          resourceCode: result.data.resourceCode,
          resourceName: result.data.resourceName,
          sortSeq: result.data.sortSeq,
          resourceCategory: String(result.data.resourceCategory),
          resourceMethod: String(result.data.resourceMethod),
          contentType: String(result.data.contentType),
          className: result.data.className,
          resourceLevel: String(result.data.resourceLevel),
          resourceUrl: result.data.resourceUrl,
          parentId: result.data.parentId,
          serviceId: result.data.serviceId,
          methodName: result.data.methodName,
          methodParam: result.data.methodParam,
          requestPath: result.data.requestPath,
          persistFlag: String(result.data.persistFlag),
          authFlag: String(result.data.authFlag),
          publicFlag: String(result.data.publicFlag),
          scopeFlag: String(result.data.scopeFlag),
          startTime: moment(result.data.startTime),
          endTime: moment(result.data.endTime),
          remark: result.data.remark,
        })
      } catch (error) {}
      layoutFormModalRef.current.setFormLoading(false)
    }
  }

  /**
   * @Description 设置新增编辑查看弹窗默认表单字段
   * @Author bihongbin
   * @Date 2020-08-07 15:44:58
   */
  useEffect(() => {
    setState((prev) => {
      prev.handleModal.formList = [
        {
          componentName: 'Input',
          name: 'resourceCode',
          label: '权限编号',
          placeholder: '请输入权限编号',
          rules: [
            {
              required: true,
              message: '请输入权限编号',
            },
          ],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'resourceName',
          label: '权限名称',
          placeholder: '请输入权限名称',
          rules: [
            {
              required: true,
              message: '请输入权限名称',
            },
          ],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'sortSeq',
          label: '排序序号',
          placeholder: '请输入排序序号',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'resourceCategory',
          label: '资源分类',
          placeholder: '请选择资源分类',
          disabled: state.handleModal.disable,
          selectData: resourceClassSelectList,
        },
        {
          componentName: 'Select',
          name: 'resourceMethod',
          label: '请求方式',
          placeholder: '请选择请求方式',
          disabled: state.handleModal.disable,
          selectData: requestMethodSelectList,
        },
        {
          componentName: 'Select',
          name: 'contentType',
          label: '响应类型',
          placeholder: '请选择响应类型',
          disabled: state.handleModal.disable,
          selectData: contentSelectList,
        },
        {
          componentName: 'Input',
          name: 'className',
          label: '类名',
          placeholder: '请输入类目',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'resourceLevel',
          label: '等级',
          placeholder: '请输入等级',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'resourceUrl',
          label: '控件URL',
          placeholder: '请输入URL',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'parentId',
          label: '父级id',
          placeholder: '请输入父级id',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'serviceId',
          label: '服务id',
          placeholder: '请输入服务id',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'methodName',
          label: '方法名',
          placeholder: '请输入方法名',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'methodParam',
          label: '方法参数',
          placeholder: '请输入方法参数',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'requestPath',
          label: '请求路径',
          placeholder: '请输入请求路径',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Radio',
          name: 'persistFlag',
          label: '是否保留数据',
          disabled: state.handleModal.disable,
          selectData: persistFlagData,
        },
        {
          componentName: 'Radio',
          name: 'authFlag',
          label: '是否需要认证',
          disabled: state.handleModal.disable,
          selectData: authFlagData,
        },
        {
          componentName: 'Radio',
          name: 'publicFlag',
          label: '是否公开',
          selectData: publicFlagData,
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Radio',
          name: 'scopeFlag',
          label: '是否权限域',
          selectData: scopeFlagData,
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'startTime',
          label: '生效日期',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'endTime',
          label: '失效日期',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'TextArea',
          name: 'remark',
          label: '备注',
          rows: 3,
          colProps: { span: 24 },
          placeholder: '请输入备注',
          disabled: state.handleModal.disable,
        },
      ]
      return prev
    })
  }, [
    contentSelectList,
    requestMethodSelectList,
    resourceClassSelectList,
    setState,
    state.handleModal.disable,
  ])

  /**
   * @Description 数据字典
   * @Author bihongbin
   * @Date 2020-10-27 16:21:46
   */
  useEffect(() => {
    // 资源分类
    dispatchRedux(
      layoutStore.actions.getDictionary({
        code: 'RBAC_RESOURCE_CATEGORY',
        saveName: 'resourceClassSelectList',
      }),
    )
    // 请求方式
    dispatchRedux(
      layoutStore.actions.getDictionary({
        code: 'SYS_REQUEST_METHOD',
        saveName: 'requestMethodSelectList',
      }),
    )
    // 响应类型
    dispatchRedux(
      layoutStore.actions.getDictionary({
        code: 'SYS_CONTENT_TYPE',
        saveName: 'contentSelectList',
      }),
    )
  }, [dispatchRedux])

  /**
   * @Description 设置卡片操作按钮数据
   * @Author bihongbin
   * @Date 2020-08-07 15:32:06
   */
  useEffect(() => {
    setState({
      cardHandleButtonList: [
        {
          name: '新增',
          authCode: authBasic.ADD,
          icon: 'icon_list_add.png',
          clickConfirm: () => {
            setState((prev) => {
              prev.handleModal.visible = true
              prev.handleModal.disable = false
              prev.handleModal.id = ''
              prev.handleModal.title = '新增资源权限'
              return prev
            })
          },
        },
      ],
    })
  }, [authBasic.ADD, setState])

  /**
   * @Description 设置表格列表表头数据
   * @Author bihongbin
   * @Date 2020-08-07 15:24:52
   */
  useEffect(() => {
    setState({
      tableColumnsList: [
        {
          width: 80,
          title: '序号',
          dataIndex: 'sortSeq',
          ellipsis: true,
        },
        {
          title: '名称',
          dataIndex: 'resourceName',
          ellipsis: true,
        },
        {
          title: '编号',
          dataIndex: 'resourceCode',
          ellipsis: true,
        },
        {
          title: '资源分类',
          dataIndex: 'resourceCategory',
          ellipsis: true,
          render: (value: number) => {
            const result = resourceClassSelectList.find(
              (item) => item.value === value,
            )
            return result && result.label
          },
        },
        {
          title: '状态',
          dataIndex: 'status',
          ellipsis: true,
          render: (value: number) => {
            const result = statusData.find(
              (item) => parseInt(item.value) === value,
            )
            return result && result.label
          },
        },
        {
          title: '是否需要认证',
          dataIndex: 'authFlag',
          ellipsis: true,
          render: (value: number) => {
            const result = authFlagData.find(
              (item) => parseInt(item.value) === value,
            )
            return result && result.label
          },
        },
        {
          title: '是否权限域',
          dataIndex: 'scopeFlag',
          ellipsis: true,
          render: (value: number) => {
            const result = scopeFlagData.find(
              (item) => parseInt(item.value) === value,
            )
            return result && result.label
          },
        },
        {
          title: '请求方式',
          dataIndex: 'resourceMethod',
          ellipsis: true,
        },
        {
          title: '生效日期',
          dataIndex: 'startTime',
          ellipsis: true,
        },
        {
          title: '失效日期',
          dataIndex: 'endTime',
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 170,
          render: (value: number, record: any) => {
            const operatingData: TableOperateButtonType[] = []
            // 查看
            operatingData.push({
              name: '查看',
              authCode: authBasic.QUERY,
              svg: 'table_see.png',
              onClick: () => {
                setState((prev) => {
                  prev.handleModal.visible = true
                  prev.handleModal.disable = true
                  prev.handleModal.id = record.id
                  prev.handleModal.title = '查看资源权限'
                  return prev
                })
                getDetails(record.id)
              },
            })
            if (value > 0) {
              // 编辑
              operatingData.push({
                name: '编辑',
                authCode: authBasic.EDIT,
                svg: 'table_edit.png',
                onClick: () => {
                  setState((prev) => {
                    prev.handleModal.visible = true
                    prev.handleModal.disable = false
                    prev.handleModal.id = record.id
                    prev.handleModal.title = '编辑资源权限'
                    return prev
                  })
                  getDetails(record.id)
                },
              })
              // 挂起和启用
              operatingData.push({
                name: value === 1 ? '启用' : '挂起',
                authCode: authBasic.ENABLEANDSUSPEND,
                svg: value === 1 ? 'table_enable.png' : 'table_locking.png',
                onClick: () => {
                  if (layoutTableRef.current) {
                    handleRowEnableDisable(
                      {
                        id: [record.id],
                        status: record.status,
                      },
                      switchResourceRowsList,
                      layoutTableRef.current.getTableList,
                      ['', '挂起', '启用'],
                    )
                  }
                },
              })
              // 删除
              operatingData.push({
                name: '删除',
                authCode: authBasic.DELETE,
                svg: 'table_delete.png',
                onClick: () => {
                  if (layoutTableRef.current) {
                    handleRowDelete(
                      [record.id],
                      handleResourceButtonList,
                      layoutTableRef.current.getTableList,
                    )
                  }
                },
              })
            }
            return <TableOperate operateButton={operatingData} />
          },
        },
      ],
    })
  }, [
    authBasic.DELETE,
    authBasic.EDIT,
    authBasic.ENABLEANDSUSPEND,
    authBasic.QUERY,
    resourceClassSelectList,
    setState,
  ])

  return (
    <>
      <LayoutTableList
        ref={layoutTableRef}
        api={getResourceButtonMenuList}
        searchFormList={state.searchFormList}
        autoGetList
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle="资源权限"
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.tableColumnsList,
          tableConfig: {
            scroll: { x: 1300, y: 500 },
          },
        }}
      />
      <LayoutFormModal
        ref={layoutFormModalRef}
        formConfig={{
          initialValues: {
            persistFlag: '0',
            authFlag: '1',
            publicFlag: '0',
            scopeFlag: '0',
          },
        }}
        onCancel={() => {
          setState((prev) => {
            prev.handleModal.visible = false
            return prev
          })
        }}
        onConfirm={() => layoutTableRef.current?.getTableList()}
        {...state.handleModal}
      />
    </>
  )
}

export default PageAuthMainList
