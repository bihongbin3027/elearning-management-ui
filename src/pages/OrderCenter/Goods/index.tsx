import React, { useEffect, useRef, useReducer } from 'react'
import { Space, Avatar, Button } from 'antd'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import DetailsModal from '@/pages/OrderCenter/Goods/Details'
import { SxyButton } from '@/style/module/button'
import { getBasicQtyList } from '@/api/basicData'

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
  SET_DETAILS_MODAL = '[SetDetailsModal Action]',
}

const stateValue = {
  // 头部搜索数据
  searchFormList: [
    {
      componentName: 'Input',
      name: 'a',
      placeholder: '订单编号',
    },
    {
      componentName: 'Input',
      name: 'b',
      placeholder: '收货人',
    },
    {
      componentName: 'Input',
      name: 'c',
      placeholder: '用户联系方式',
    },
    {
      componentName: 'Select',
      name: 'd',
      placeholder: '订单状态',
    },
    {
      componentName: 'RangePicker',
      name: 'e',
      rangePickerPlaceholder: ['下单时间', '下单时间'],
    },
    {
      componentName: 'RangePicker',
      name: 'f',
      rangePickerPlaceholder: ['支付时间', '支付时间'],
    },
  ] as FormListCallType[],
  // 系统表头
  tableColumns: [],
  // 卡片操作按钮
  cardHandleButtonList: [],
  // 详情弹窗
  detailsModal: {
    visible: false,
    id: '',
    status: 0,
  },
}

const GoodsMainList = () => {
  const tableRef = useRef<LayoutTableCallType>()
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
      case ActionType.SET_DETAILS_MODAL: // 设置查看详情弹窗
        return {
          ...state,
          detailsModal: {
            ...state.detailsModal,
            ...action.payload,
          },
        }
    }
  }, stateValue)

  /**
   * @Description 设置表格头
   * @Author bihongbin
   * @Date 2020-08-19 11:07:19
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_COLUMNS,
      payload: [
        {
          title: '订单编号',
          dataIndex: 'a1',
          render: () => (
            <>
              <div>DLS10012S201812060004</div>
              <Space className="mt-1">
                <Avatar shape="square" size={64} />
                <span>商品名称</span>
              </Space>
            </>
          ),
        },
        {
          title: '订单金额',
          dataIndex: 'c1',
        },
        {
          title: '用户姓名',
          dataIndex: 'd1',
        },
        {
          title: '联系方式',
          dataIndex: 'e1',
        },
        {
          title: '地址',
          dataIndex: 'f1',
          ellipsis: true,
        },
        {
          title: '创建时间',
          dataIndex: 'h1',
        },
        {
          title: '订单状态',
          dataIndex: 'i1',
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 110,
          render: (value: number, record: any) => {
            return (
              <>
                <Button
                  className="is-btn-link"
                  type="link"
                  onClick={() => {
                    dispatch({
                      type: ActionType.SET_DETAILS_MODAL,
                      payload: {
                        visible: true,
                        id: record.id,
                        status: value,
                      },
                    })
                  }}
                >
                  查看详情
                </Button>
                <SxyButton className="mt-1" mode="deep-green">
                  确定发货
                </SxyButton>
                <SxyButton className="mt-1" mode="deep-red">
                  去付款
                </SxyButton>
              </>
            )
          },
        },
      ],
    })
  }, [])

  /**
   * @Description 设置卡片操作按钮数据
   * @Author bihongbin
   * @Date 2020-08-19 11:08:29
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_CARD_HANDLE_BUTTON_LIST,
      payload: [
        {
          name: '提醒支付',
          clickConfirm: () => {},
        },
        {
          name: '导出',
          clickConfirm: () => {},
        },
      ],
    })
  }, [])

  return (
    <>
      <LayoutTableList
        ref={tableRef}
        api={getBasicQtyList}
        searchFormList={state.searchFormList}
        autoGetList
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle="商品订单"
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.tableColumns,
          tableConfig: {
            scroll: { x: 1300, y: 500 },
          },
        }}
      />
      <DetailsModal
        {...state.detailsModal}
        onCancel={() =>
          dispatch({
            type: ActionType.SET_DETAILS_MODAL,
            payload: {
              visible: false,
            },
          })
        }
      />
    </>
  )
}

export default GoodsMainList
