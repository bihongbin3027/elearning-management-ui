import React, { useRef, useEffect } from 'react'
import { Avatar } from 'antd'
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
import TableOperate, { TableOperateButtonType } from '@/components/TableOperate'
import IconSelectionModal from '@/pages/SystemManage/AuthorityManagement/IconSelectionModal'
import { handleRowEnableDisable, handleRowDelete } from '@/utils'
import { AnyObjectType } from '@/typings'
import {
  getBasicQtyList,
  handleBasicQtyList,
  deleteBasicQtyList,
  setBasicQtyStatus,
} from '@/api/basicData'

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

const ParameterConfigMainList = () => {
  const layoutTableRef = useRef<LayoutTableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const [state, setState] = useSetState<StateType>({
    // 头部搜索表单数据
    searchFormList: [
      {
        componentName: 'Input',
        name: 'a',
        placeholder: '权限名称',
      },
      {
        componentName: 'Input',
        name: 'b',
        placeholder: '权限编号',
      },
      {
        componentName: 'Select',
        name: 'c',
        placeholder: '状态',
        selectData: [],
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
      submitApi: handleBasicQtyList,
      formList: [],
    },
    // 图标弹窗
    iconModal: {
      visible: false,
      src: '',
    },
  })

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
          name: 'a2',
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
          name: 'a1',
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
          name: 'a3',
          label: '操作标识',
          placeholder: '请输入操作标识',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'a4',
          label: '排序序号',
          placeholder: '请输入排序序号',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'a5',
          label: '应用类型',
          placeholder: '请选择应用类型',
          disabled: state.handleModal.disable,
          selectData: [],
        },
        {
          componentName: 'Input',
          name: 'a6',
          label: '应用名称',
          placeholder: '请输入应用名称',
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
          componentName: 'Input',
          name: 'a61',
          label: '参数内容',
          placeholder: '请输入参数内容',
          disabled: state.handleModal.disable,
          colProps: {
            span: 24,
          },
        },
        {
          componentName: 'Select',
          name: 'a612',
          label: '父节点',
          placeholder: '请选择父节点',
          disabled: state.handleModal.disable,
          selectData: [],
        },
        {
          componentName: 'Switch',
          name: 'a9',
          label: '是否审核',
          valuePropName: 'checked',
          disabled: state.handleModal.disable,
        },
        // TODO 图标功能未做（此页面交互功能未作）
        {
          componentName: 'HideInput',
          name: 'ii',
          label: '图标',
          render: () => {
            return (
              <div
                className="mb-5"
                onClick={() => {
                  setState((prev) => {
                    prev.iconModal.visible = false
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
          colProps: {
            span: 24,
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
          clickConfirm: () => {
            setState((prev) => {
              prev.handleModal.visible = true
              prev.handleModal.disable = false
              prev.handleModal.id = ''
              prev.handleModal.title = '新增参数配置'
              return prev
            })
          },
        },
      ],
    })
  }, [setState])

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
        },
        {
          title: '名称',
          dataIndex: 'd',
        },
        {
          title: '编号',
          dataIndex: 'e',
        },
        {
          title: '状态',
          dataIndex: 'f',
        },
        {
          title: '操作标识',
          dataIndex: 'g',
        },
        {
          title: '生效日期',
          dataIndex: 'startTime',
        },
        {
          title: '失效日期',
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
              type: 'lookOver',
              onClick: () => {
                setState((prev) => {
                  prev.handleModal.visible = true
                  prev.handleModal.disable = true
                  prev.handleModal.id = record.id
                  prev.handleModal.title = '查看参数配置'
                  return prev
                })
              },
              svg: 'table_see.png',
            })
            // 编辑
            operatingData.push({
              name: '编辑',
              type: 'edit',
              onClick: () => {
                setState((prev) => {
                  prev.handleModal.visible = true
                  prev.handleModal.disable = false
                  prev.handleModal.id = record.id
                  prev.handleModal.title = '编辑参数配置'
                  return prev
                })
              },
              svg: 'table_edit.png',
            })
            // 删除
            operatingData.push({
              name: '删除',
              type: 'delete',
              onClick: () => {
                if (layoutTableRef.current) {
                  handleRowDelete(
                    [record.id],
                    deleteBasicQtyList,
                    layoutTableRef.current.getTableList,
                  )
                }
              },
              svg: 'table_delete.png',
            })
            // 更多
            operatingData.push({
              name: '更多',
              type: 'more',
              svg: 'table_more.png',
              moreList: [
                {
                  name:
                    (value === 1 && '禁用') ||
                    (value === 2 && '启用') ||
                    '未知',
                  onClick: () => {
                    if (layoutTableRef.current) {
                      handleRowEnableDisable(
                        {
                          id: record.id,
                          status: (value === 1 && 2) || (value === 2 && 1) || 0,
                        },
                        setBasicQtyStatus,
                        layoutTableRef.current.getTableList,
                      )
                    }
                  },
                },
              ],
            })
            return <TableOperate operateButton={operatingData} />
          },
        },
      ],
    })
  }, [setState])

  return (
    <>
      <LayoutTableList
        ref={layoutTableRef}
        api={getBasicQtyList}
        searchFormList={state.searchFormList}
        autoGetList
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle="参数配置"
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.tableColumnsList,
          tableConfig: {
            scroll: { y: 500 },
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

export default ParameterConfigMainList
