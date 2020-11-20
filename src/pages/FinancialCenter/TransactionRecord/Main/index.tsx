import React, { useRef, useReducer, useEffect } from 'react'
import { Space, Button, Row, Col } from 'antd'
import { ColumnType } from 'antd/es/table'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import { AnyObjectType } from '@/typings'
import { getBasicQtyList } from '@/api/basicData'

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_SEARCH_FORM_LIST = '[SetSearchFormList Action]',
  SET_TABLE_COLUMNS = '[SetMainTableColumns Action]',
}

const stateValue = {
  searchFormList: [] as FormListCallType[], // 头部搜索数据
  tableColumns: [] as ColumnType<AnyObjectType>[], // 表格头,
}

const MainPage = () => {
  const mainListTableRef = useRef<LayoutTableCallType>(null)
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_SEARCH_FORM_LIST: // 设置头部搜索表单
        return {
          ...state,
          searchFormList: action.payload,
        }
      case ActionType.SET_TABLE_COLUMNS: // 设置表格头
        return {
          ...state,
          tableColumns: action.payload,
        }
    }
  }, stateValue)

  /**
   * @Description 设置搜索表单值
   * @Author bihongbin
   * @Date 2020-09-11 15:34:35
   */
  const handleSearchFormState = (data: StateType['searchFormList']) => {
    dispatch({
      type: ActionType.SET_SEARCH_FORM_LIST,
      payload: data,
    })
  }

  /**
   * @Description 设置表格头数据
   * @Author bihongbin
   * @Date 2020-09-11 15:39:07
   */
  const handleTableColumnsState = (data: StateType['tableColumns']) => {
    dispatch({
      type: ActionType.SET_TABLE_COLUMNS,
      payload: data,
    })
  }

  /**
   * @Description 设置搜索表单数据
   * @Author bihongbin
   * @Date 2020-09-11 17:01:13
   */
  useEffect(() => {
    handleSearchFormState([
      {
        componentName: 'Input',
        name: 'a',
        placeholder: '名称',
      },
      {
        componentName: 'Input',
        name: 'b',
        placeholder: '收款/付款条目',
      },
      {
        componentName: 'Select',
        name: 'c',
        placeholder: '收支类型',
        selectData: [],
      },
    ])
  }, [])

  /**
   * @Description 设置表格头数据
   * @Author bihongbin
   * @Date 2020-09-11 15:39:43
   */
  useEffect(() => {
    handleTableColumnsState([
      { title: '名称', dataIndex: 'qtyEname' },
      { title: '收款/付款条目', dataIndex: 'qtyEname' },
      { title: '类型', dataIndex: 'qtyEname' },
      { title: '收支类型', dataIndex: 'qtyEname' },
      { title: '账户', dataIndex: 'qtyEname' },
      { title: '入账时间', dataIndex: 'createTime' },
    ])
  }, [])

  return (
    <div className="mt-4">
      <LayoutTableList
        ref={mainListTableRef}
        api={getBasicQtyList}
        searchFormList={state.searchFormList}
        autoGetList
        cardTopTitle={
          <Row gutter={20} align="middle">
            <Col>交易记录</Col>
            <Col>
              <Space size={10}>
                <Button>导出</Button>
              </Space>
            </Col>
          </Row>
        }
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.tableColumns,
          tableConfig: {
            scroll: { x: 1300, y: 500 },
          },
        }}
      />
    </div>
  )
}

export default MainPage
