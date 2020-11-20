import React, { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import { ColumnType } from 'antd/es/table'
import { RootStateType } from '@/store/rootReducer'
import useSetState from '@/hooks/useSetState'
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
import TableOperate, { TableOperateButtonType } from '@/components/TableOperate'
import { AnyObjectType } from '@/typings'
import { statusData } from '@/config/selectData'
import layoutStore from '@/store/module/layout'
import { handleRowEnableDisable, handleRowDelete } from '@/utils'
import {
  getDataButtonList,
  handleDataButtonList,
  switchDataRowsList,
} from '@/api/systemManage/menu'

interface StateType {
  searchFormList: FormListCallType[]
  cardHandleButtonList: CardButtonType[]
  tableColumnsList: ColumnType<AnyObjectType>[]
  handleModal: LayoutFormPropTypes
}

const DataAuthMainList = () => {
  const dispatchRedux = useDispatch()
  const authBasic = GlobalConstant.buttonPermissions.basic // 基础权限
  const layoutTableRef = useRef<LayoutTableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const {
    useLevelSelectList, // 使用等级
    appTypesSelectList, // 应用类型
  } = useSelector((state: RootStateType) => ({
    ...state.layout,
  }))
  const [state, setState] = useSetState<StateType>({
    // 头部搜索表单数据
    searchFormList: [
      {
        componentName: 'Input',
        name: 'ruleCname',
        placeholder: '权限名称',
      },
      {
        componentName: 'Input',
        name: 'ruleCode',
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
      submitApi: handleDataButtonList,
      formList: [],
    },
  })

  /**
   * @Description 获取详情
   * @Author bihongbin
   * @Date 2020-10-27 14:27:00
   */
  const getDetails = async (id: string) => {
    if (layoutFormModalRef.current) {
      layoutFormModalRef.current.setFormLoading(true)
      try {
        const result = await handleDataButtonList(
          {
            id,
          },
          'get',
        )
        layoutFormModalRef.current.setFormValues({
          ruleCode: result.data.ruleCode,
          ruleCname: result.data.ruleCname,
          ruleEname: result.data.ruleEname,
          sortSeq: result.data.sortSeq,
          resourceCategory: result.data.resourceCategory,
          resourceId: result.data.resourceId,
          ruleColumn: result.data.ruleColumn,
          ruleConditions: result.data.ruleConditions,
          ruleValue: result.data.ruleValue,
          sqlSegment: result.data.sqlSegment,
          className: result.data.className,
          assignLevel: result.data.assignLevel,
          startTime: moment(result.data.startTime),
          endTime: moment(result.data.endTime),
          remark: result.data.remark,
        })
      } catch (error) {}
      layoutFormModalRef.current.setFormLoading(false)
    }
  }

  /**
   * @Description 数据字典
   * @Author bihongbin
   * @Date 2020-10-14 12:03:00
   */
  useEffect(() => {
    // 公司
    dispatchRedux(layoutStore.actions.getCompanyData())
    // 使用等级
    dispatchRedux(
      layoutStore.actions.getDictionary({
        code: 'RBAC_PERMISSION_GRADE',
        saveName: 'useLevelSelectList',
      }),
    )
    // 应用类型
    dispatchRedux(
      layoutStore.actions.getDictionary({
        code: 'RBAC_RESOURCE_CATEGORY_DATA',
        saveName: 'appTypesSelectList',
      }),
    )
  }, [dispatchRedux])

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
          name: 'ruleCode',
          label: '规则编号',
          placeholder: '请输入规则编号',
          rules: [
            {
              required: true,
              message: '请输入规则编号',
            },
          ],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'ruleCname',
          label: '规则中文名称',
          placeholder: '请输入规则中文名称',
          rules: [
            {
              required: true,
              message: '请输入规则中文名称',
            },
          ],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'ruleEname',
          label: '规则英文名称',
          placeholder: '请输入规则英文名称',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'resourceCategory',
          label: '应用类型',
          placeholder: '请选择应用类型',
          selectData: appTypesSelectList,
          rules: [
            {
              required: true,
              message: '请选择应用类型',
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
          componentName: 'Input',
          name: 'ruleColumn',
          label: '规则字段',
          placeholder: '请输入规则字段',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'ruleConditions',
          label: '条件规则',
          placeholder: '请输入条件规则',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'ruleValue',
          label: '规则值',
          placeholder: '请输入规则值',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'TextArea',
          name: 'sqlSegment',
          label: '自定义规则',
          placeholder: '请输入自定义规则',
          rows: 3,
          colProps: {
            span: 24,
          },
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'className',
          label: '实体类名',
          placeholder: '请输入实体类名',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'assignLevel',
          label: '应用等级',
          placeholder: '请选择应用等级',
          selectData: useLevelSelectList,
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
    appTypesSelectList,
    setState,
    state.handleModal.disable,
    useLevelSelectList,
  ])

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
              prev.handleModal.title = '新增数据权限'
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
          dataIndex: 'ruleCname',
          ellipsis: true,
        },
        {
          title: '编号',
          dataIndex: 'ruleCode',
          ellipsis: true,
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
                  prev.handleModal.title = '查看数据权限'
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
                    prev.handleModal.title = '编辑数据权限'
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
                      switchDataRowsList,
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
                      handleDataButtonList,
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
    setState,
  ])

  return (
    <>
      <LayoutTableList
        ref={layoutTableRef}
        api={getDataButtonList}
        searchFormList={state.searchFormList}
        autoGetList
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle="数据权限"
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

export default DataAuthMainList
