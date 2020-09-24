import React, { useRef, useReducer, useEffect } from 'react'
import { ColumnType } from 'antd/es/table'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import LayoutFormModal, {
  LayoutFormModalCallType,
  LayoutFormModalListType,
} from '@/components/LayoutFormModal'
import { AnyObjectType } from '@/typings'
import TableOperate from '@/components/TableOperate'
import { handleRowDelete } from '@/utils'
import {
  getBasicQtyList,
  handleBasicQtyList,
  deleteBasicQtyList,
} from '@/api/basicData'

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_SEARCH_FORM_LIST = '[SetSearchFormList Action]',
  SET_TABLE_COLUMNS = '[SetMainTableColumns Action]',
  SET_HANDLE_MODAL = '[SetHandleModal Action]',
}

const stateValue = {
  searchFormList: [] as FormListCallType[], // 头部搜索数据
  tableColumns: [] as ColumnType<AnyObjectType>[], // 表格头,
  // 新增编辑弹窗
  handleModal: {
    visible: false,
    id: '',
    title: '新建教室',
    submitApi: handleBasicQtyList,
    formList: [] as LayoutFormModalListType[],
  },
}

const Teacher = () => {
  const mainListTableRef = useRef<LayoutTableCallType>(null)
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
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
      case ActionType.SET_HANDLE_MODAL: // 设置新增编辑弹窗
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
   * @Description 新增编辑弹窗
   * @Author bihongbin
   * @Date 2020-09-12 14:52:16
   */
  const handleModalState = (data: Partial<StateType['handleModal']>) => {
    dispatch({
      type: ActionType.SET_HANDLE_MODAL,
      payload: data,
    })
  }

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
        placeholder: '教室名称',
      },
      {
        componentName: 'Select',
        name: 'b',
        placeholder: '校区',
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
      { title: '教师名称', dataIndex: 'qtyEname' },
      { title: '校区', dataIndex: 'qtyEname' },
      { title: '座位编排', dataIndex: 'qtyEname' },
      { title: '教师功能', dataIndex: 'qtyEname' },
      { title: '教师位置', dataIndex: 'qtyEname' },
      { title: '最大容纳数', dataIndex: 'qtyEname' },
      {
        title: '操作',
        dataIndex: 'status',
        fixed: 'right',
        width: 90,
        render: (value: number, record: any) => {
          const operatingData = []
          // 编辑
          operatingData.push({
            name: '编辑',
            onClick: () => {
              handleModalState({
                visible: true,
                id: record.id,
                title: '编辑教室',
              })
            },
            svg: 'table_edit.png',
          })
          // 删除
          operatingData.push({
            name: '删除',
            onClick: () => {
              handleRowDelete([record.id], deleteBasicQtyList, () =>
                mainListTableRef.current?.getTableList(),
              )
            },
            svg: 'table_delete.png',
          })
          return <TableOperate operateButton={operatingData} />
        },
      },
    ])
  }, [])

  /**
   * @Description 设置新增编辑查看弹窗默认表单字段
   * @Author bihongbin
   * @Date 2020-09-12 15:31:50
   */
  useEffect(() => {
    handleModalState({
      formList: [
        {
          componentName: 'Input',
          name: 'a',
          label: '教室名称',
          placeholder: '请输入教室名称',
          rules: [
            {
              required: true,
              message: '请输入教室名称',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'b',
          label: '教室功能',
          placeholder: '请输入教室功能',
          rules: [
            {
              required: true,
              message: '请输入教室功能',
            },
          ],
        },
        {
          componentName: 'Select',
          name: 'c',
          label: '校区',
          placeholder: '请选择校区',
          selectData: [],
          rules: [
            {
              required: true,
              message: '请选择校区',
            },
          ],
        },
        {
          componentName: 'Select',
          name: 'd',
          label: '教室位置',
          placeholder: '请输入教室位置',
          selectData: [],
          rules: [
            {
              required: true,
              message: '请输入教室位置',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'e',
          label: '座位编排（行）',
          placeholder: '请输入行',
          selectData: [],
          rules: [
            {
              required: true,
              message: '请输入行',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'f',
          label: '座位编排（列）',
          placeholder: '请输入列',
          selectData: [],
          rules: [
            {
              required: true,
              message: '请输入列',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'g',
          label: '最大容纳认人数',
          placeholder: '请输入最大容纳认人数',
          selectData: [],
          rules: [
            {
              required: true,
              message: '请输入最大容纳认人数',
            },
          ],
        },
      ],
    })
  }, [])

  return (
    <div className="mt-4">
      <LayoutTableList
        ref={mainListTableRef}
        api={getBasicQtyList}
        searchFormList={state.searchFormList}
        autoGetList
        cardTopTitle="教室管理"
        censusTips={
          <div className="sxy-alert-box">
            当前结果：共计19个教室，可容纳总人数455
          </div>
        }
        cardTopButton={[
          {
            name: '新建',
            icon: 'card_add.png',
            clickConfirm: () => {
              handleModalState({
                visible: true,
                title: '新建教室',
              })
            },
          },
        ]}
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.tableColumns,
          tableConfig: {
            scroll: { x: 1500, y: 500 },
          },
        }}
      />
      <LayoutFormModal
        ref={layoutFormModalRef}
        onCancel={() => handleModalState({ visible: false })}
        {...state.handleModal}
      />
    </div>
  )
}

export default Teacher
