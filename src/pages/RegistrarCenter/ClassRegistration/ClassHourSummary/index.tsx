import React, { useRef, useReducer, useEffect } from 'react'
import { Space } from 'antd'
import { ColumnType } from 'antd/es/table'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import { SxyButton } from '@/style/module/button'
import { SxyIcon } from '@/style/module/icon'
import { AnyObjectType } from '@/typings'
import { getBasicQtyList } from '@/api/basicData'

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_TAB_BTN_INDEX = '[SetTabBtnIndex Action]',
  SET_SEARCH_FORM_LIST = '[SetSearchFormList Action]',
  SET_TABLE_COLUMNS = '[SetMainTableColumns Action]',
}

const stateValue = {
  tabBtnList: ['教师课时', '学员课时'], // tab切换
  tabBtnIndex: 0, // tab切换索引
  searchFormList: [] as FormListCallType[], // 头部搜索数据
  tableColumns: [] as ColumnType<AnyObjectType>[], // 表格头,
}

const ClassHourSummary = () => {
  const mainListTableRef = useRef<LayoutTableCallType>(null)
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_TAB_BTN_INDEX: // 设置tab切换索引
        return {
          ...state,
          tabBtnIndex: action.payload,
        }
      case ActionType.SET_SEARCH_FORM_LIST: // 设置头部搜索表单
        return {
          ...state,
          searchFormList: action.payload,
        }
      case ActionType.SET_TABLE_COLUMNS: // 设置上课记录表格头
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
    // 教师课时
    if (state.tabBtnIndex === 0) {
      handleSearchFormState([
        {
          componentName: 'Select',
          name: 'a',
          placeholder: '校区',
        },
        {
          componentName: 'Select',
          name: 'b',
          placeholder: '科目',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'd',
          placeholder: '课程类别',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'e',
          placeholder: '课程',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'f',
          placeholder: '教师',
          selectData: [],
        },
        {
          componentName: 'RangePicker',
          name: 'g',
        },
      ])
    }
    // 学员课时
    if (state.tabBtnIndex === 1) {
      handleSearchFormState([])
    }
  }, [state.tabBtnIndex])

  /**
   * @Description 设置表格头数据
   * @Author bihongbin
   * @Date 2020-09-11 15:39:43
   */
  useEffect(() => {
    // 教师课时
    if (state.tabBtnIndex === 0) {
      handleTableColumnsState([
        {
          title: '教师',
          dataIndex: 'createTime',
          width: 500,
          ellipsis: true,
          render: () => (
            <Space size={30}>
              张三<span>所属校区：潍坊校区，北京校区</span>
            </Space>
          ),
        },
        { title: '到课人次', dataIndex: 'qtyEname' },
        { title: '扣课时人次', dataIndex: 'qtyEname' },
        { title: '学员课时', dataIndex: 'qtyEname' },
        { title: '助教课时', dataIndex: 'qtyEname' },
        { title: '学费消耗（元）', dataIndex: 'qtyEname' },
      ])
    }
    // 学员课时
    if (state.tabBtnIndex === 1) {
      handleTableColumnsState([])
    }
  }, [state.tabBtnIndex])

  return (
    <div className="mt-4">
      <div className="text-center mb-4">
        <Space size={20}>
          {stateValue.tabBtnList.map((item, index) => (
            <SxyButton
              width={120}
              radius={20}
              mode="white"
              className={
                index === state.tabBtnIndex
                  ? 'btn-white-active-text'
                  : undefined
              }
              key={index}
              onClick={() => {
                dispatch({
                  type: ActionType.SET_TAB_BTN_INDEX,
                  payload: index,
                })
              }}
            >
              {item}
            </SxyButton>
          ))}
        </Space>
      </div>
      <LayoutTableList
        ref={mainListTableRef}
        api={getBasicQtyList}
        searchFormList={state.searchFormList}
        autoGetList
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.tableColumns,
          tableConfig: {
            expandable: {
              expandedRowRender: (record) => (
                <div>
                  需要把数据结构改为有子children属性的数据，然后参照设计图修改
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
            scroll: { x: 1600, y: 500 },
          },
        }}
      />
    </div>
  )
}

export default ClassHourSummary
