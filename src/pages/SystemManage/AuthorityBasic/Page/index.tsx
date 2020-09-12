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
}

const PageAuthMainList = () => {
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
          componentName: 'Input',
          name: 'a5',
          label: '参数',
          placeholder: '请输入参数',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'a6',
          label: '请求方式',
          placeholder: '请选择请求方式',
          disabled: state.handleModal.disable,
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'a61',
          label: '响应类型',
          placeholder: '请选择响应类型',
          disabled: state.handleModal.disable,
          selectData: [],
        },
        {
          componentName: 'Input',
          name: 'a62',
          label: '类名',
          placeholder: '请输入类目',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'a63',
          label: '引用等级',
          placeholder: '请选择引用等级',
          disabled: state.handleModal.disable,
          selectData: [],
        },
        {
          componentName: 'Input',
          name: 'a64',
          label: 'URL',
          placeholder: '请输入URL',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'a641',
          label: '父级id',
          placeholder: '请输入父级id',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'a65',
          label: '服务id',
          placeholder: '请输入服务id',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'a66',
          label: '方法名',
          placeholder: '请输入方法名',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'a67',
          label: '方法参数',
          placeholder: '请输入方法参数',
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
          name: 'a68',
          label: '请求路径',
          placeholder: '请输入请求路径',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Radio',
          name: 'a69',
          label: '是否保留数据',
          disabled: state.handleModal.disable,
          selectData: [
            {
              label: '是',
              value: '0',
            },
            {
              label: '否',
              value: '1',
            },
          ],
        },
        {
          componentName: 'Radio',
          name: 'a70',
          label: '是否需要认证',
          disabled: state.handleModal.disable,
          selectData: [
            {
              label: '是',
              value: '0',
            },
            {
              label: '否',
              value: '1',
            },
          ],
          colProps: {
            span: 24,
          },
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
          label: '是否公开',
          valuePropName: 'checked',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Switch',
          name: 'a9',
          label: '权限域',
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
  }, [state.handleModal.disable, state.iconModal.src])

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
              title: '新增页面权限',
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
                  title: '查看页面权限',
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
                  title: '编辑页面权限',
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
        cardTopTitle="页面权限"
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

export default PageAuthMainList
