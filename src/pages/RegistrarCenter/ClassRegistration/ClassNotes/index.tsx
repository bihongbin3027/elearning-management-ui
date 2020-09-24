import React, { useRef, useReducer, useEffect } from 'react'
import { Button, Typography, Space } from 'antd'
import { ColumnType } from 'antd/es/table'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import TableOperate from '@/components/TableOperate'
import { SxyButton } from '@/style/module/button'
import { handleRowDelete } from '@/utils'
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
  SET_TAB_BTN_INDEX = '[SetTabBtnIndex Action]',
  SET_SEARCH_FORM_LIST = '[SetSearchFormList Action]',
  SET_TABLE_TIPS = '[SetTableTips Action]',
  SET_TABLE_COLUMNS = '[SetMainTableColumns Action]',
  SET_HANDLE_MODAL = '[SetHandleModal Action]',
  SET_TABLE_MODAL_COLUMNS = '[SetTableModalColumns Action]',
}

const stateValue = {
  tabBtnList: ['按班级', '按学员'], // tab切换
  tabBtnIndex: 0, // tab切换索引
  searchFormList: [] as FormListCallType[], // 头部搜索数据
  tableTips: <></>, // 表格头tips
  tableColumns: [] as ColumnType<AnyObjectType>[], // 上课登记主列表表格头,
  // 新增编辑查看弹窗
  handleModal: {
    visible: false,
    id: '',
    width: 700,
    title: '编辑上课记录',
    submitApi: handleBasicQtyList,
    formList: [] as FormListCallType[],
  },
  // 弹窗表格头
  tableModalColumns: [] as ColumnType<AnyObjectType>[],
}

const ClassNotes = () => {
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
      case ActionType.SET_TABLE_TIPS: // 设置表格头tips
        return {
          ...state,
          tableTips: action.payload,
        }
      case ActionType.SET_TABLE_COLUMNS: // 设置上课记录表格头
        return {
          ...state,
          tableColumns: action.payload,
        }
      case ActionType.SET_HANDLE_MODAL: // 设置新增编辑查看弹窗
        return {
          ...state,
          handleModal: {
            ...state.handleModal,
            ...action.payload,
          },
        }
      case ActionType.SET_TABLE_MODAL_COLUMNS: // 设置弹窗表格头
        return {
          ...state,
          tableModalColumns: action.payload,
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
    // 按班级
    if (state.tabBtnIndex === 0) {
      handleSearchFormState([
        {
          componentName: 'DatePicker',
          name: 'a',
          placeholder: '上课日期',
        },
        {
          componentName: 'Select',
          name: 'b',
          placeholder: '课程类型',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'd',
          placeholder: '课程',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'e',
          placeholder: '校区',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'f',
          placeholder: '上课教室',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'g',
          placeholder: '助教',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'h',
          placeholder: '科目',
          selectData: [],
        },
      ])
    }
    // 按学员
    if (state.tabBtnIndex === 1) {
      handleSearchFormState([
        {
          componentName: 'DatePicker',
          name: 'a',
          placeholder: '上课日期',
        },
        {
          componentName: 'Select',
          name: 'b',
          placeholder: '课程类型',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'd',
          placeholder: '课程',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'e',
          placeholder: '校区',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'f',
          placeholder: '到课状态',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'g',
          placeholder: '到课类型',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'h',
          placeholder: '上课类型',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'i',
          placeholder: '科目',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'j',
          placeholder: '教师',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'k',
          placeholder: '助教',
          selectData: [],
        },
      ])
    }
  }, [state.tabBtnIndex])

  /**
   * @Description 设置表格头tips
   * @Author bihongbin
   * @Date 2020-09-11 17:00:31
   */
  useEffect(() => {
    let node = null
    // 按班级
    if (state.tabBtnIndex === 0) {
      node = (
        <Text type="secondary">
          共 47 条学员上课记录 ，学员课时总计 109.50，上课教师课时总计 350.00
          ，学费消耗总计 12779.19
        </Text>
      )
    }
    // 按学员
    if (state.tabBtnIndex === 1) {
      node = (
        <Text type="secondary">
          共 110 条学员上课记录 ，学费消耗总计 12779.19
        </Text>
      )
    }
    dispatch({
      type: ActionType.SET_TABLE_TIPS,
      payload: node,
    })
  }, [state.tabBtnIndex])

  /**
   * @Description 设置表格头数据
   * @Author bihongbin
   * @Date 2020-09-11 15:39:43
   */
  useEffect(() => {
    let columns: ColumnType<AnyObjectType>[] = [
      {
        title: '操作',
        dataIndex: 'status',
        width: 130,
        fixed: 'right',
        render: (value: number, record: any) => {
          const operatingData = []
          // 编辑
          operatingData.push({
            name: '编辑',
            onClick: () => {
              // handleModalState({
              //   visible: true,
              //   disable: false,
              //   id: record.id,
              //   title: '编辑上课记录',
              // })
            },
            svg: 'table_edit.png',
          })
          // 删除
          operatingData.push({
            name: '删除',
            onClick: () => {
              if (mainListTableRef.current) {
                handleRowDelete(
                  [record.id],
                  deleteBasicQtyList,
                  mainListTableRef.current.getTableList,
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
                name: '未知',
                onClick: () => {},
              },
            ],
          })
          return <TableOperate operateButton={operatingData} />
        },
      },
    ]
    // 按班级
    if (state.tabBtnIndex === 0) {
      handleTableColumnsState([
        { title: '上课时段', dataIndex: 'createTime' },
        {
          title: '班级',
          dataIndex: 'qtyEname',
          render: () => (
            <div>
              <span className="btn btn-blue btn-round mr-2">班</span>
              张某某_钢琴三级
            </div>
          ),
        },
        { title: '所属课程', dataIndex: 'qtyEname' },
        { title: '上课教室', dataIndex: 'qtyEname' },
        { title: '应到/实到', dataIndex: 'qtyEname' },
        { title: '到课', dataIndex: 'qtyEname' },
        { title: '请假', dataIndex: 'qtyEname' },
        { title: '旷课', dataIndex: 'qtyEname' },
        { title: '学员课时', dataIndex: 'qtyEname' },
        { title: '创建人', dataIndex: 'createName' },
        ...columns,
      ])
    }
    // 按学员
    if (state.tabBtnIndex === 1) {
      handleTableColumnsState([
        { title: '上课日期', dataIndex: 'createTime' },
        { title: '上课时段', dataIndex: 'qtyEname' },
        { title: '学员姓名', dataIndex: 'qtyEname' },
        { title: '联系电话', dataIndex: 'qtyEname' },
        {
          title: '班级',
          dataIndex: 'qtyEname',
          render: () => (
            <div>
              <span className="btn btn-blue btn-round mr-2">班</span>
              张某某_钢琴三级
            </div>
          ),
        },
        { title: '所属课程', dataIndex: 'qtyEname' },
        { title: '到课状态', dataIndex: 'qtyEname' },
        { title: '已消耗课时', dataIndex: 'qtyEname' },
        { title: '上课类型', dataIndex: 'qtyEname' },
        { title: '学费消耗', dataIndex: 'qtyEname' },
        ...columns,
      ])
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
        cardTopTitle={<Button>全部导出</Button>}
        cardTopButton={[
          { name: '自定义列表', type: 'default', clickConfirm: () => {} },
        ]}
        censusTips={<div className="sxy-alert-box">{state.tableTips}</div>}
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.tableColumns,
          tableConfig: {
            scroll: { x: 1700, y: 500 },
          },
        }}
      />
    </div>
  )
}

export default ClassNotes
