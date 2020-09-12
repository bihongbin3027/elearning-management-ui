import React, { useRef, useReducer, useEffect } from 'react'
import { Button, Typography, Space } from 'antd'
import { ColumnType } from 'antd/es/table'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import LayoutFormModal, {
  LayoutFormModalCallType,
  LayoutFormModalListType,
} from '@/components/LayoutFormModal'
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
  SET_SEARCH_FORM_LIST = '[SetSearchFormList Action]',
  SET_TABLE_TIPS = '[SetTableTips Action]',
  SET_TABLE_COLUMNS = '[SetMainTableColumns Action]',
  SET_HANDLE_MODAL = '[SetHandleModal Action]',
  SET_TABLE_MODAL_COLUMNS = '[SetTableModalColumns Action]',
}

const stateValue = {
  searchFormList: [] as FormListCallType[], // 头部搜索数据
  tableTips: <></>, // 表格头tips
  tableColumns: [] as ColumnType<AnyObjectType>[], // 上课登记主列表表格头,
  // 新增编辑查看弹窗
  handleModal: {
    visible: false,
    id: '',
    width: 420,
    title: '补课编辑',
    submitApi: handleBasicQtyList,
    formList: [] as LayoutFormModalListType[],
  },
  // 弹窗表格头
  tableModalColumns: [] as ColumnType<AnyObjectType>[],
}

const MakeUpLessons = () => {
  const mainListTableRef = useRef<LayoutTableCallType>(null)
  const layoutFormModalRef = useRef<LayoutFormModalCallType>(null)
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
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
   * @Description 设置弹窗表单值
   * @Author bihongbin
   * @Date 2020-09-11 17:48:23
   */
  const handleModalState = (data: Partial<StateType['handleModal']>) => {
    dispatch({
      type: ActionType.SET_HANDLE_MODAL,
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
   * @Description 设置弹窗表单数据
   * @Author bihongbin
   * @Date 2020-09-11 17:50:03
   */
  useEffect(() => {
    handleModalState({
      formList: [
        {
          componentName: 'Radio',
          name: 'a',
          placeholder: '重复方式',
          colProps: { span: 24 },
          selectData: [
            { label: '到课', value: '0' },
            { label: '请假', value: '1' },
            { label: '旷课', value: '2' },
          ],
        },
        {
          componentName: 'Input',
          name: 'b',
          label: '扣除课时',
          placeholder: '请输入扣除课时',
          rules: [{ required: true, message: '请输入扣除课时' }],
          colProps: { span: 24 },
          render: () => (
            <Text className="font-12" type="secondary">
              可填写小数如:0.5
            </Text>
          ),
        },
      ],
    })
  }, [])

  /**
   * @Description 设置搜索表单数据
   * @Author bihongbin
   * @Date 2020-09-11 17:01:13
   */
  useEffect(() => {
    handleSearchFormState([
      {
        componentName: 'Select',
        name: 'b',
        placeholder: '到课状态',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'd',
        placeholder: '补课状态',
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
        placeholder: '课程',
        selectData: [],
      },
      {
        componentName: 'RangePicker',
        name: 'g',
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
      { title: '上课日期', dataIndex: 'createTime' },
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
      { title: '课程', dataIndex: 'qtyEname' },
      { title: '上课内容', dataIndex: 'qtyEname' },
      { title: '到课状态', dataIndex: 'qtyEname' },
      { title: '课时', dataIndex: 'qtyEname' },
      { title: '教师', dataIndex: 'qtyEname' },
      {
        title: '补课状态',
        dataIndex: 'qtyEname',
        render: () => (
          <SxyButton mode="pale-yellow" radius={15}>
            未安排
          </SxyButton>
        ),
      },
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
              handleModalState({
                visible: true,
                id: record.id,
                title: '补课编辑',
              })
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
          <Space size={10}>
            <Button>插班补课</Button>
            <Button>新建日程补课</Button>
            <Button>导出当前结果</Button>
            <Button>批量编辑</Button>
          </Space>
        }
        censusTips={
          <div className="sxy-alert-box">
            <Text type="secondary">共计 47 条补课记录</Text>
          </div>
        }
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.tableColumns,
          tableConfig: {
            scroll: { x: 1800, y: 500 },
          },
        }}
      />
      <LayoutFormModal
        ref={layoutFormModalRef}
        formConfig={{
          initialValues: {
            a: '0',
          },
        }}
        onCancel={() => handleModalState({ visible: false })}
        {...state.handleModal}
      />
    </div>
  )
}

export default MakeUpLessons
