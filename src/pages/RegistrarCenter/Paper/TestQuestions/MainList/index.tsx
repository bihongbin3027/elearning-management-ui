import React, { useReducer, useRef, useEffect } from 'react'
import { Space, Button, message } from 'antd'
import { FormOutlined } from '@ant-design/icons'
import { SxyIcon } from '@/style/module/icon'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import TableOperate from '@/components/TableOperate'
import { handleRowDelete } from '@/utils'
import CreateEditModal from '@/pages/RegistrarCenter/Paper/TestQuestions/CreateEditModal'
import { getBasicQtyList, deleteBasicQtyList } from '@/api/basicData'

type ReducerType = (state: StateType, action: Action) => StateType
interface Action {
  type: ActionType
  payload: any
}
type StateType = typeof stateValue

enum ActionType {
  SET_SEARCH_FORM_LIST = '[SetSearchFormList Action]',
  SET_CARD_HANDLE_BUTTON_LIST = '[SetCardHandleButtonList Action]',
  SET_TABLE_COLUMNS = '[SetTableColumns Action]',
  SET_HANDLE_MODAL = '[SetHandleModal Action]',
}

const stateValue = {
  searchFormList: [] as FormListCallType[], // 头部搜索表单数据
  cardHandleButtonList: [], // 卡片操作按钮
  tableColumns: [], // 表格头
  // 新增编辑弹窗
  handleModal: {
    visible: false,
    id: '',
    title: '',
    type: 'add' as 'add' | 'look',
  },
}

const TestQuestionsMainList = () => {
  const layoutTableRef = useRef<LayoutTableCallType>(null)
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
      case ActionType.SET_TABLE_COLUMNS: // 设置表格头
        return {
          ...state,
          tableColumns: action.payload,
        }
      case ActionType.SET_HANDLE_MODAL: // 设置新增编辑弹窗数据
        return {
          ...state,
          handleModal: {
            ...state.handleModal,
            ...action.payload,
          },
        }
    }
  }, stateValue)

  /**
   * @Description 设置新增编辑弹窗数据
   * @Author bihongbin
   * @Date 2020-08-24 11:51:53
   */
  const handleModalState = (data: Partial<StateType['handleModal']>) => {
    dispatch({
      type: ActionType.SET_HANDLE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 批量删除
   * @Author bihongbin
   * @Date 2020-08-24 11:25:24
   */
  const handleBatchDelete = () => {
    if (layoutTableRef.current) {
      const ids = layoutTableRef.current.getSelectIds()
      if (ids.length) {
        handleRowDelete(
          ids,
          deleteBasicQtyList,
          layoutTableRef.current.getTableList,
        )
      } else {
        message.warn('请选择要删除的数据', 1.5)
      }
    }
  }

  /**
   * @Description 设置头部搜索表单数据
   * @Author bihongbin
   * @Date 2020-08-22 16:35:57
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_SEARCH_FORM_LIST,
      payload: [
        {
          componentName: 'Select',
          name: 'a',
          placeholder: '全部题型',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'b',
          placeholder: '全部章节',
          selectData: [],
        },
      ],
    })
  }, [])

  /**
   * @Description 设置表格头数据
   * @Author bihongbin
   * @Date 2020-08-20 10:07:49
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_TABLE_COLUMNS,
      payload: [
        { title: '编号', dataIndex: 'id', width: 60 },
        {
          title: '题型',
          dataIndex: 'costCategory',
          render: (value: string) => {
            // 组合题才有子题按钮
            return (
              <>
                {value}
                <Button
                  className="is-btn-link ml-3"
                  type="link"
                  icon={<FormOutlined />}
                >
                  子题
                </Button>
              </>
            )
          },
        },
        { title: '题目', dataIndex: 'dataStep' },
        { title: '答案', dataIndex: 'sourceType' },
        { title: '难易程度', dataIndex: 'status' },
        { title: '编辑时间', dataIndex: 'createTime' },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 85,
          render: (value: number, record: any) => {
            const operatingData = []
            // 编辑
            operatingData.push({
              name: '编辑',
              onClick: () => {
                handleModalState({
                  id: record.id,
                  visible: true,
                  title: '试题编辑',
                  type: 'look',
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
            return <TableOperate operateButton={operatingData} />
          },
        },
      ],
    })
  }, [])

  /**
   * @Description 设置卡片操作按钮数据
   * @Author bihongbin
   * @Date 2020-08-22 16:38:02
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_CARD_HANDLE_BUTTON_LIST,
      payload: [
        {
          name: '新增',
          icon: 'card_add.png',
          clickConfirm: () => {
            handleModalState({
              id: '',
              visible: true,
              title: '新增试题',
              type: 'add',
            })
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
        cardTopTitle={
          <Space size={10}>
            <Button onClick={handleBatchDelete}>批量删除</Button>
            <Button>试题去重</Button>
          </Space>
        }
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.tableColumns,
          tableConfig: {
            scroll: { x: 1200, y: 500 },
            expandable: {
              expandedRowRender: (record) => (
                <div style={{ marginLeft: 106 }}>
                  {record.qtyCname + '（组合题才有子题）'}
                </div>
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
      <CreateEditModal
        {...state.handleModal}
        onCancel={() => handleModalState({ visible: false })}
      />
    </>
  )
}

export default TestQuestionsMainList
