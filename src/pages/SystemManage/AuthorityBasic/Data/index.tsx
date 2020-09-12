import React, { useRef, useReducer, useEffect } from 'react'
import { Avatar } from 'antd'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import LayoutFormModal, {
  LayoutFormModalCallType,
} from '@/components/LayoutFormModal'
import TableOperate from '@/components/TableOperate'
import IconSelectionModal from '@/pages/SystemManage/AuthorityManagement/IconSelectionModal'
import { handleRowEnableDisable, handleRowDelete } from '@/utils'
import {
  getBasicQtyList,
  handleBasicQtyList,
  deleteBasicQtyList,
  setBasicQtyStatus,
} from '@/api/basicData'

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_SEARCH_FORM_LIST = '[SetSearchFormList Action]',
  SET_CARD_HANDLE_BUTTON_LIST = '[SetCardHandleButtonList Action]',
  SET_TABLE_COLUMNS_LIST = '[SetTableColumnsList Action]',
  SET_HANDLE_MODAL = '[SetHandleModal Action]',
  SET_ICON_MODAL = '[SetIconModal Action]',
  SET_CUSTOM_RULE_SWITCH_DISABLE = '[SetCustomRuleSwitchDisable Action]',
}

const stateValue = {
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
  ] as FormListCallType[],
  cardHandleButtonList: [], // 卡片操作按钮
  tableColumnsList: [], // 表格数据列表表头数据
  // 新增编辑查看弹窗
  handleModal: {
    visible: false,
    disable: false,
    id: '',
    title: '',
    submitApi: handleBasicQtyList,
    formList: [] as FormListCallType[],
  },
  // 图标弹窗
  iconModal: {
    visible: false,
    src: '',
  },
  // 自定义规则开关
  customRuleSwitchDisable: true,
}

const DataAuthMainList = () => {
  const layoutTableRef = useRef<LayoutTableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_SEARCH_FORM_LIST: // 设置头部搜索表单数据
        return {
          ...state,
          searchFormList: action.payload,
        }
      case ActionType.SET_CARD_HANDLE_BUTTON_LIST: // 设置卡片操作按钮
        return {
          ...state,
          cardHandleButtonList: action.payload,
        }
      case ActionType.SET_TABLE_COLUMNS_LIST: // 设置表格数据列表表头数据
        return {
          ...state,
          tableColumnsList: action.payload,
        }
      case ActionType.SET_HANDLE_MODAL: // 设置新增编辑查看弹窗数据
        return {
          ...state,
          handleModal: {
            ...state.handleModal,
            ...action.payload,
          },
        }
      case ActionType.SET_ICON_MODAL: // 设置图标弹窗数据
        return {
          ...state,
          iconModal: {
            ...state.iconModal,
            ...action.payload,
          },
        }
      case ActionType.SET_CUSTOM_RULE_SWITCH_DISABLE: // 自定义规则
        return {
          ...state,
          customRuleSwitchDisable: action.payload,
        }
    }
  }, stateValue)

  /**
   * @Description 设置新增编辑查看弹窗数据
   * @Author bihongbin
   * @Date 2020-08-07 15:36:34
   */
  const handleModalState = (data: Partial<StateType['handleModal']>) => {
    dispatch({
      type: ActionType.SET_HANDLE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置图标弹窗相关
   * @Author bihongbin
   * @Date 2020-08-07 16:41:16
   */
  const handleIconState = (data: Partial<StateType['iconModal']>) => {
    dispatch({
      type: ActionType.SET_ICON_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置新增编辑查看弹窗默认表单字段
   * @Author bihongbin
   * @Date 2020-08-07 15:44:58
   */
  useEffect(() => {
    handleModalState({
      formList: [
        {
          componentName: 'Input',
          name: 'a1',
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
          name: 'a2',
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
          componentName: 'Input',
          name: 'a5',
          label: '应用名称',
          placeholder: '请输入应用名称',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'a6',
          label: '应用类型',
          placeholder: '请选择应用类型',
          selectData: [],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'a61',
          label: '规则名称',
          placeholder: '请输入规则名称',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'a62',
          label: '规则字段',
          placeholder: '请输入规则字段',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'a63',
          label: '条件规则',
          placeholder: '请输入条件规则',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'a64',
          label: '规则值',
          placeholder: '请输入规则值',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Switch',
          name: 'o12',
          label: '自定义开关',
          valuePropName: 'checked',
          colProps: {
            span: 5,
          },
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'TextArea',
          name: 'o13',
          label: ' ',
          placeholder: '开启自定义后可以自定义规则',
          rows: 3,
          colProps: {
            span: 19,
          },
          disabled: state.customRuleSwitchDisable,
        },
        {
          componentName: 'Input',
          name: 'a65',
          label: '实体类名',
          placeholder: '请输入实体类名',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'a66',
          label: '应用等级',
          placeholder: '请选择应用等级',
          selectData: [],
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
          componentName: 'HideInput',
          name: 'ii',
          label: '图标',
          render: () => {
            return (
              <div
                className="mb-5"
                onClick={() => handleIconState({ visible: true })}
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
          componentName: 'Switch',
          name: 'a8',
          label: '内部组织开关',
          valuePropName: 'checked',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Switch',
          name: 'a9',
          label: '是否公开',
          valuePropName: 'checked',
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
      ],
    })
  }, [
    state.customRuleSwitchDisable,
    state.handleModal.disable,
    state.iconModal.src,
  ])

  /**
   * @Description 设置卡片操作按钮数据
   * @Author bihongbin
   * @Date 2020-08-07 15:32:06
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_CARD_HANDLE_BUTTON_LIST,
      payload: [
        {
          name: '新增',
          clickConfirm: () => {
            handleModalState({
              visible: true,
              disable: false,
              id: '',
              title: '新增数据权限',
            })
          },
        },
      ],
    })
  }, [])

  /**
   * @Description 设置表格列表表头数据
   * @Author bihongbin
   * @Date 2020-08-07 15:24:52
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_TABLE_COLUMNS_LIST,
      payload: [
        {
          width: 60,
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
            const operatingData = []
            // 查看
            operatingData.push({
              name: '查看',
              onClick: () => {
                handleModalState({
                  visible: true,
                  disable: true,
                  id: record.id,
                  title: '查看数据权限',
                })
              },
              svg: 'table_see.png',
            })
            // 编辑
            operatingData.push({
              name: '编辑',
              onClick: () => {
                handleModalState({
                  visible: true,
                  disable: false,
                  id: record.id,
                  title: '编辑数据权限',
                })
              },
              svg: 'table_edit.png',
            })
            // 删除
            operatingData.push({
              name: '删除',
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
  }, [])

  return (
    <>
      <LayoutTableList
        ref={layoutTableRef}
        api={getBasicQtyList}
        searchFormList={state.searchFormList}
        autoGetList
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle="数据权限"
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
        formConfig={{
          onValuesChange: (changedFields) => {
            const cs = changedFields['o12']
            // 设置自定义规则是否可编辑
            dispatch({
              type: ActionType.SET_CUSTOM_RULE_SWITCH_DISABLE,
              payload: !cs,
            })
          },
        }}
        onCancel={() => handleModalState({ visible: false })}
        {...state.handleModal}
      />
      <IconSelectionModal
        {...state.iconModal}
        onCancel={() => handleIconState({ visible: false })}
        onConfirm={(item) => {
          layoutFormModalRef.current?.setFormValues({
            ii: item.src,
          })
          handleIconState({
            visible: false,
            src: item.src,
          })
        }}
      />
    </>
  )
}

export default DataAuthMainList
