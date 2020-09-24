import React, { useEffect, useRef, useReducer, useCallback } from 'react'
import { Space, Avatar, Button, Typography } from 'antd'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import TableOperate from '@/components/TableOperate'
import LayoutFormModal, {
  LayoutFormModalCallType,
} from '@/components/LayoutFormModal'
import { handleRowDelete } from '@/utils'
import { SxyIcon } from '@/style/module/icon'
import { AnyObjectType } from '@/typings'
import {
  getBasicQtyList,
  handleBasicQtyList,
  deleteBasicQtyList,
} from '@/api/basicData'

const { Text } = Typography

type ReducerType = (state: StateType, action: Action) => StateType
interface Action {
  type: ActionType
  payload: any
}
type StateType = typeof stateValue

enum ActionType {
  SET_SEARCH_FORM_LIST = '[SetSearchFormList Action]',
  SET_COLUMNS = '[SetColumns Action]',
  SET_CARD_HANDLE_BUTTON_LIST = '[SetCardHandleButtonList Action]',
  SET_HANDLE_MODAL = '[SetHandleModal Action]',
  SET_TRANSFER_MODAL = '[SetTransferModal Action]',
}

const stateValue = {
  // 头部搜索数据
  searchFormList: [] as FormListCallType[],
  // 表格表头
  tableColumns: [],
  // 卡片操作按钮
  cardHandleButtonList: [],
  // 分类弹窗
  handleModal: {
    visible: false,
    title: '新增商品信息',
    disabled: false,
    loading: false,
    saveLoading: false,
    submitApi: handleBasicQtyList,
    formList: [] as FormListCallType[],
  },
  // 商品转移弹窗
  transferModal: {
    visible: false,
    title: '商品转移',
    width: 420,
    submitApi: handleBasicQtyList,
    formList: [] as FormListCallType[],
  },
}

const GoodsSort = () => {
  const tableRef = useRef<LayoutTableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const transferModalRef = useRef<LayoutFormModalCallType>()
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_SEARCH_FORM_LIST: // 设置头部搜索表单数据
        return {
          ...state,
          searchFormList: action.payload,
        }
      case ActionType.SET_COLUMNS: // 设置表格头
        return {
          ...state,
          tableColumns: action.payload,
        }
      case ActionType.SET_CARD_HANDLE_BUTTON_LIST: // 设置卡片操作按钮
        return {
          ...state,
          cardHandleButtonList: action.payload,
        }
      case ActionType.SET_HANDLE_MODAL: // 设置新增、编辑、查看弹窗数据
        return {
          ...state,
          handleModal: {
            ...state.handleModal,
            ...action.payload,
          },
        }
      case ActionType.SET_TRANSFER_MODAL: // 设置商品转移弹窗数据
        return {
          ...state,
          transferModal: {
            ...state.transferModal,
            ...action.payload,
          },
        }
    }
  }, stateValue)

  /**
   * @Description 设置头部搜索表单数据
   * @Author bihongbin
   * @Date 2020-09-03 16:37:33
   */
  const handleSearchFormState = (data: StateType['searchFormList']) => {
    dispatch({
      type: ActionType.SET_SEARCH_FORM_LIST,
      payload: data,
    })
  }

  /**
   * @Description 设置新增、编辑、查看弹窗数据
   * @Author bihongbin
   * @Date 2020-09-03 16:47:00
   */
  const handleModalState = (data: Partial<StateType['handleModal']>) => {
    dispatch({
      type: ActionType.SET_HANDLE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置商品转移弹窗数据
   * @Author bihongbin
   * @Date 2020-09-03 17:34:25
   */
  const handleTransferModalState = (
    data: Partial<StateType['transferModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_TRANSFER_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 查询
   * @Author bihongbin
   * @Date 2020-09-03 16:27:35
   */
  const formSubmit = () => {
    if (tableRef.current) {
      tableRef.current.getTableList()
    }
  }

  /**
   * @Description 编辑和查看
   * @Author bihongbin
   * @Date 2020-09-03 16:46:12
   */
  const getOpenModal = useCallback(
    (record: AnyObjectType, type: 'look' | 'edit') => {
      // 查看
      if (type === 'look') {
        handleModalState({
          visible: true,
          title: '商品分类详情',
          disabled: true,
        })
      }
      // 编辑
      if (type === 'edit') {
        handleModalState({
          visible: true,
          title: '编辑商品分类',
          disabled: false,
        })
      }
    },
    [],
  )

  /**
   * @Description 设置头部搜索
   * @Author bihongbin
   * @Date 2020-09-03 16:37:01
   */
  useEffect(() => {
    handleSearchFormState([
      {
        componentName: 'Select',
        name: 'a',
        placeholder: '请选择店铺商品分类',
        selectData: [
          {
            label: '分类一',
            value: '1',
          },
          {
            label: '分类二',
            value: '2',
          },
        ],
      },
      {
        componentName: 'Input',
        name: 'b',
        placeholder: '请输入商品ID/名称/关键词搜索商品',
      },
    ])
  }, [])

  /**
   * @Description 设置卡片操作按钮数据
   * @Author bihongbin
   * @Date 2020-09-03 16:40:59
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_CARD_HANDLE_BUTTON_LIST,
      payload: [
        {
          name: '添加新分类',
          icon: 'card_add.png',
          clickConfirm: () => {
            handleModalState({
              visible: true,
              title: '新增商品分类',
              disabled: false,
            })
          },
        },
      ],
    })
  }, [])

  /**
   * @Description 设置表格头
   * @Author bihongbin
   * @Date 2020-09-03 16:44:31
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_COLUMNS,
      payload: [
        {
          title: '分类层级',
          dataIndex: 'qtyCname',
        },
        {
          title: '排序',
          dataIndex: 'costCategory',
        },
        {
          title: '分类名称',
          dataIndex: 'c1',
        },
        {
          title: '商品数量',
          dataIndex: 'd1',
        },
        {
          title: '是否显示',
          dataIndex: 'e1',
        },
        {
          title: '是否店铺首页推荐',
          dataIndex: 'f1',
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 135,
          render: (value: number, record: any) => {
            const operatingData = []
            // 编辑
            operatingData.push({
              name: '编辑',
              onClick: () => getOpenModal(record, 'edit'),
              svg: 'table_edit.png',
            })
            // 删除
            operatingData.push({
              name: '删除',
              onClick: () => {
                if (tableRef.current) {
                  handleRowDelete(
                    [record.id],
                    deleteBasicQtyList,
                    tableRef.current.getTableList,
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
                  name: '转移商品',
                  onClick: () => {
                    handleTransferModalState({ visible: true })
                  },
                },
                {
                  name: '添加子类',
                  onClick: () => {
                    handleModalState({
                      visible: true,
                      title: '添加商品子类',
                      disabled: false,
                    })
                  },
                },
              ],
            })
            return <TableOperate operateButton={operatingData} />
          },
        },
      ],
    })
  }, [getOpenModal])

  /**
   * @Description 设置新增编辑弹窗默认表单字段
   * @Author bihongbin
   * @Date 2020-09-03 17:14:23
   */
  useEffect(() => {
    handleModalState({
      formList: [
        {
          componentName: 'Input',
          name: 'a',
          label: '分类排序',
          placeholder: '请输入分类排序',
          disabled: state.handleModal.disabled,
        },
        {
          componentName: 'Select',
          name: 'b',
          label: '上级分类',
          placeholder: '请选择上级分类',
          disabled: state.handleModal.disabled,
        },
        {
          componentName: 'Input',
          name: 'c',
          label: '分类名称',
          placeholder: '请输入分类名称',
          rules: [{ required: true, message: '请输入分类名称' }],
          disabled: state.handleModal.disabled,
        },
        {
          componentName: 'Input',
          name: 'd',
          label: '关键词',
          placeholder: '请输入关键词',
          disabled: state.handleModal.disabled,
        },
        {
          componentName: 'HideInput',
          name: 'e',
          label: '分类图标',
          render: () => {
            return (
              <>
                <div>
                  <Space size={20}>
                    <Avatar
                      className="pointer"
                      shape="square"
                      size={100}
                      alt="分类图标"
                    />
                    {!state.handleModal.disabled && (
                      <Button type="primary">上传</Button>
                    )}
                  </Space>
                </div>
                <div className="mt-2">
                  <Text className="font-12" type="secondary">
                    分类图标最佳尺寸200*200，商品分类图标显示在分类页面，标识分类特征
                  </Text>
                </div>
              </>
            )
          },
          colProps: {
            span: 24,
          },
          disabled: state.handleModal.disabled,
        },
        {
          componentName: 'Radio',
          name: 'f',
          label: '是否关联平台分类',
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
          rules: [{ required: true, message: '请选择是否关联平台分类' }],
          disabled: state.handleModal.disabled,
          colProps: {
            span: 24,
          },
          render: () => (
            <Text className="font-12" type="secondary">
              设置是否在店铺分类页面展示分类名称
            </Text>
          ),
        },
        {
          componentName: 'Radio',
          name: 'g',
          label: '是否店铺首页推荐',
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
          rules: [{ required: true, message: '请选择是否店铺首页推荐' }],
          disabled: state.handleModal.disabled,
          colProps: {
            span: 24,
          },
          render: () => (
            <Text className="font-12" type="secondary">
              设置是否在店铺首页展示分类名称
            </Text>
          ),
        },
        {
          componentName: 'TextArea',
          name: 'h',
          label: '分类描述',
          placeholder: '最多可以输入300个字',
          rows: 3,
          colProps: {
            span: 24,
          },
          rules: [{ max: 300, message: '最多可以输入300个字' }],
          disabled: state.handleModal.disabled,
        },
      ],
    })
  }, [state.handleModal.disabled])

  /**
   * @Description 设置商品转移弹窗表单数据
   * @Author bihongbin
   * @Date 2020-09-03 17:37:02
   */
  useEffect(() => {
    handleTransferModalState({
      formList: [
        {
          componentName: 'Select',
          name: 'd',
          label: '转移的分类',
          placeholder: '请选择转移的分类',
          disabled: state.handleModal.disabled,
          selectData: [],
          rules: [{ required: true, message: '请选择转移的分类' }],
          colProps: {
            span: 24,
          },
          render: () => (
            <Text className="font-12" type="secondary">
              选择新分类后，所选商品将归属新的分类
            </Text>
          ),
        },
      ],
    })
  }, [state.handleModal.disabled])

  /**
   * @Description 初始化
   * @Author bihongbin
   * @Date 2020-09-03 16:27:54
   */
  useEffect(() => {
    formSubmit()
  }, [])

  return (
    <>
      <LayoutTableList
        ref={tableRef}
        api={getBasicQtyList}
        searchFormList={state.searchFormList}
        autoGetList
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle="商品分类"
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.tableColumns,
          tableConfig: {
            scroll: { x: 1300, y: 500 },
            expandable: {
              expandedRowRender: (record) => (
                <div style={{ marginLeft: 106 }}>{record.qtyCname}</div>
              ),
              expandIcon: ({ expanded, onExpand, record }) => {
                let iconName = expanded
                  ? 'table_tree_open2.png'
                  : 'table_tree_shut2.png'
                return (
                  <SxyIcon
                    width={12}
                    height={12}
                    name={iconName}
                    className="pointer"
                    onClick={(e) => onExpand(record, e)}
                  />
                )
              },
            },
          },
        }}
      />
      <LayoutFormModal
        ref={layoutFormModalRef}
        onCancel={() => handleModalState({ visible: false })}
        formConfig={{
          initialValues: {
            f: '0',
            g: '0',
          },
        }}
        {...state.handleModal}
      />
      <LayoutFormModal
        ref={transferModalRef}
        onCancel={() => handleTransferModalState({ visible: false })}
        {...state.transferModal}
      />
    </>
  )
}

export default GoodsSort
