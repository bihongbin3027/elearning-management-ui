import React, { useRef, useEffect } from 'react'
import { Avatar } from 'antd'
import moment from 'moment'
import { ColumnType } from 'antd/es/table'
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
import IconSelectionModal from '@/pages/SystemManage/AuthorityManagement/IconSelectionModal'
import { handleRowEnableDisable, handleRowDelete } from '@/utils'
import { AnyObjectType } from '@/typings'
import { statusData } from '@/config/selectData'
import {
  getBasicButtonList,
  handleBasicButtonList,
  switchBasicButtonRowsList,
} from '@/api/systemManage/menu'

interface StateType {
  searchFormList: FormListCallType[]
  cardHandleButtonList: CardButtonType[]
  tableColumnsList: ColumnType<AnyObjectType>[]
  handleModal: LayoutFormPropTypes
  iconModal: {
    visible: boolean
    src: string
  }
}

const BasicAuthMainList = () => {
  const authBasic = GlobalConstant.buttonPermissions.basic // 基础权限
  const layoutTableRef = useRef<LayoutTableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const [state, setState] = useSetState<StateType>({
    // 头部搜索表单数据
    searchFormList: [
      {
        componentName: 'Input',
        name: 'buttonCname',
        placeholder: '权限名称',
      },
      {
        componentName: 'Input',
        name: 'buttonCode',
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
      submitApi: handleBasicButtonList,
      formList: [],
    },
    // 图标弹窗
    iconModal: {
      visible: false,
      src: '',
    },
  })

  /**
   * @Description 获取详情
   * @Author bihongbin
   * @Date 2020-10-26 15:52:17
   */
  const getDetails = async (id: string) => {
    if (layoutFormModalRef.current) {
      layoutFormModalRef.current.setFormLoading(true)
      try {
        const result = await handleBasicButtonList(
          {
            id,
          },
          'get',
        )
        layoutFormModalRef.current.setFormValues({
          buttonCode: result.data.buttonCode,
          buttonCname: result.data.buttonCname,
          buttonAction: result.data.buttonAction,
          sortSeq: result.data.sortSeq,
          buttonTitle: result.data.buttonTitle,
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
          name: 'buttonCode',
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
          name: 'buttonCname',
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
          name: 'buttonAction',
          label: '操作标识',
          placeholder: '请输入操作标识',
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
          name: 'buttonTitle',
          label: '标记说明',
          placeholder: '请输入标记说明',
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
        // TODO 图标功能未做
        {
          componentName: 'HideInput',
          name: 'buttonNormalImg',
          label: '图标',
          disabled: state.handleModal.disable,
          render: () => {
            return (
              <div
                className="mb-5"
                onClick={() => {
                  setState((prev) => {
                    prev.iconModal.visible = true
                    return prev
                  })
                }}
              >
                <Avatar
                  className="pointer"
                  src={state.iconModal.src}
                  shape="square"
                  size="large"
                  alt="图标"
                />
                <span className="text-desc font-12 ml-2">
                  - 请选择自己心仪的图标
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
          disabled: state.handleModal.disable,
        },
      ]
      return prev
    })
  }, [setState, state.handleModal.disable, state.iconModal.src])

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
              prev.handleModal.title = '新增基础权限'
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
          dataIndex: 'buttonCname',
          ellipsis: true,
        },
        {
          title: '编号',
          dataIndex: 'buttonCode',
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
          title: '操作标识',
          dataIndex: 'buttonAction',
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
                  prev.handleModal.title = '查看基础权限'
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
                    prev.handleModal.title = '编辑基础权限'
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
                      switchBasicButtonRowsList,
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
                      handleBasicButtonList,
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
        api={getBasicButtonList}
        searchFormList={state.searchFormList}
        autoGetList
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle="基础权限"
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
      <IconSelectionModal
        {...state.iconModal}
        onCancel={() => {
          setState((prev) => {
            prev.iconModal.visible = false
            return prev
          })
        }}
        onConfirm={(item) => {
          layoutFormModalRef.current?.setFormValues({
            ii: item.src,
          })
          setState((prev) => {
            prev.iconModal.visible = false
            prev.iconModal.src = item.src
            return prev
          })
        }}
      />
    </>
  )
}

export default BasicAuthMainList
