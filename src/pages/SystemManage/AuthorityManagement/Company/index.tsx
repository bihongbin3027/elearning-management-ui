import React, { useRef, useEffect } from 'react'
import _ from 'lodash'
import moment from 'moment'
import { ColumnType } from 'antd/es/table'
import { message } from 'antd'
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
import { SxyIcon } from '@/style/module/icon'
import { handleRowEnableDisable, handleRowDelete } from '@/utils'
import { AnyObjectType } from '@/typings'
import { statusData } from '@/config/selectData'
import {
  getCompanyList,
  handleCompanyList,
  switchCompanyRowsList,
} from '@/api/systemManage/company'

interface StateType {
  searchFormList: FormListCallType[]
  cardHandleButtonList: CardButtonType[]
  tableColumnsList: ColumnType<AnyObjectType>[]
  handleModal: {
    currentRows: string[]
  } & LayoutFormPropTypes
}

const CompanyMainList = () => {
  const authBasic = GlobalConstant.buttonPermissions.basic // 基础权限
  const layoutTableRef = useRef<LayoutTableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const [state, setState] = useSetState<StateType>({
    // 头部搜索表单数据
    searchFormList: [
      {
        componentName: 'Input',
        name: 'companyName',
        placeholder: '公司名称',
      },
      {
        componentName: 'Input',
        name: 'companyCode',
        placeholder: '公司编号',
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
      currentRows: [], // 表格勾选中的id数据
      submitApi: handleCompanyList,
      formList: [],
    },
  })

  /**
   * @Description 获取详情
   * @Author bihongbin
   * @Date 2020-10-22 17:51:15
   */
  const getDetails = async (id: string) => {
    if (layoutFormModalRef.current) {
      layoutFormModalRef.current.setFormLoading(true)
      try {
        const result = await handleCompanyList(
          {
            id,
          },
          'get',
        )
        layoutFormModalRef.current.setFormValues({
          companyCode: result.data.companyCode,
          companyName: result.data.companyName,
          id: result.data.id,
          parentName: result.data.parentName || '0',
          startTime: moment(result.data.startTime),
          endTime: moment(result.data.endTime),
          groupFlag: String(result.data.groupFlag),
          innerFlag: String(result.data.innerFlag),
          publicFlag: String(result.data.publicFlag),
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
          name: 'companyCode',
          label: '公司编码',
          placeholder: '请输入公司编码',
          rules: [
            {
              required: true,
              message: '请输入公司编码',
            },
          ],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'companyName',
          label: '公司名称',
          placeholder: '请输入公司名称',
          rules: [
            {
              required: true,
              message: '请输入公司名称',
            },
          ],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'id',
          label: '公司id',
          disabled: true,
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
          name: 'parentName',
          label: '父级公司',
          disabled: true,
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
          componentName: 'Radio',
          name: 'groupFlag',
          label: '集团组织',
          selectData: [
            {
              label: '否',
              value: '0',
            },
            {
              label: '是',
              value: '1',
            },
          ],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Radio',
          name: 'innerFlag',
          label: '内部组织',
          selectData: [
            {
              label: '外部',
              value: '0',
            },
            {
              label: '内部',
              value: '1',
            },
          ],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Radio',
          name: 'publicFlag',
          label: '是否公开',
          selectData: [
            {
              label: '否',
              value: '0',
            },
            {
              label: '是',
              value: '1',
            },
          ],
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
  }, [setState, state.handleModal.disable])

  /**
   * @Description 设置父级公司
   * @Author bihongbin
   * @Date 2020-10-26 10:53:56
   */
  useEffect(() => {
    if (state.handleModal.visible) {
      if (layoutFormModalRef.current) {
        const rows = layoutTableRef.current?.getSelectRowsArray()
        if (rows && rows.length) {
          setTimeout(() => {
            layoutFormModalRef.current?.setFormValues({
              parentName: rows[0].companyName,
            })
          })
        }
      }
    }
  }, [state.handleModal.visible])

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
            if (layoutTableRef.current) {
              const rows = layoutTableRef.current.getSelectIds()
              if (rows.length > 1) {
                message.warn('只能选择一个公司', 1.5)
                return
              }
              setState((prev) => {
                prev.handleModal.visible = true
                prev.handleModal.disable = false
                prev.handleModal.id = ''
                prev.handleModal.currentRows = rows
                prev.handleModal.title = '新增公司'
                return prev
              })
            }
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
          width: 250,
          title: '公司名称',
          dataIndex: 'companyName',
          ellipsis: true,
        },
        {
          title: '公司编号',
          dataIndex: 'companyCode',
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
          title: '创建人',
          ellipsis: true,
          dataIndex: 'createUserName',
        },
        {
          title: '生效日期',
          ellipsis: true,
          dataIndex: 'startTime',
        },
        {
          title: '失效日期',
          ellipsis: true,
          dataIndex: 'endTime',
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
                  prev.handleModal.title = '查看公司'
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
                    prev.handleModal.title = '编辑公司'
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
                      switchCompanyRowsList,
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
                      handleCompanyList,
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
        api={getCompanyList}
        searchFormList={state.searchFormList}
        autoGetList
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle="公司列表"
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.tableColumnsList,
          tableConfig: {
            expandable: {
              indentSize: 50,
              expandIcon: ({ expanded, onExpand, record }) => {
                let iconName = expanded
                  ? 'table_tree_open2.png'
                  : 'table_tree_shut2.png'
                return _.isArray(record.children) && record.children.length ? (
                  <SxyIcon
                    width={12}
                    height={12}
                    name={iconName}
                    className="pointer mr-5"
                    onClick={(e) => onExpand(record, e)}
                  />
                ) : null
              },
            },
            scroll: { x: 1300, y: 500 },
          },
        }}
      />
      <LayoutFormModal
        ref={layoutFormModalRef}
        formConfig={{
          initialValues: {
            groupFlag: '0',
            innerFlag: '1',
            publicFlag: '1',
            parentName: '0',
          },
        }}
        submitExtraParameters={{
          parentId:
            state.handleModal.currentRows.length &&
            state.handleModal.currentRows[0],
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

export default CompanyMainList
