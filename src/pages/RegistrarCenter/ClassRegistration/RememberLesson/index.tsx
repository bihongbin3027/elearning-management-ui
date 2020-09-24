import React, { useReducer, useRef, useEffect } from 'react'
import { Space, Button, Row, Col, Typography } from 'antd'
import { ColumnType } from 'antd/es/table'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import { SxyButton } from '@/style/module/button'
import { AnyObjectType } from '@/typings'
import TableOperate from '@/components/TableOperate'
import LayoutFormModal, {
  LayoutFormModalCallType,
  LayoutFormModalListType,
} from '@/components/LayoutFormModal'
import GenerateTable, { TableCallType } from '@/components/GenerateTable'
import { SxyBadge } from '@/style/module/badge'
import { handleRowDelete } from '@/utils'
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
  SET_TABLE_COLUMNS = '[SetMainTableColumns Action]',
  SET_HANDLE_MODAL = '[SetHandleModal Action]',
  SET_TABLE_MODAL_COLUMNS = '[SetTableModalColumns Action]',
}

const stateValue = {
  searchFormList: [] as FormListCallType[], // 头部搜索数据
  tableColumns: [] as ColumnType<AnyObjectType>[], // 上课登记表格头,
  // 新增编辑查看弹窗
  handleModal: {
    visible: false,
    id: '',
    width: 700,
    title: '编辑上课信息',
    submitApi: handleBasicQtyList,
    formList: [] as LayoutFormModalListType[],
  },
  // 弹窗表格头
  tableModalColumns: [] as ColumnType<AnyObjectType>[],
}

const RememberLesson = () => {
  const mainListTableRef = useRef<LayoutTableCallType>(null)
  const modalFormRef = useRef<LayoutFormModalCallType>(null)
  const modalTableRef = useRef<TableCallType>(null)
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_SEARCH_FORM_LIST: // 设置头部搜索表单
        return {
          ...state,
          searchFormList: action.payload,
        }
      case ActionType.SET_TABLE_COLUMNS: // 设置上课登记表格头
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
   * @Date 2020-09-10 18:08:19
   */
  const handleSearchFormState = (data: StateType['searchFormList']) => {
    dispatch({
      type: ActionType.SET_SEARCH_FORM_LIST,
      payload: data,
    })
  }

  /**
   * @Description 设置上课登记表格头
   * @Author bihongbin
   * @Date 2020-09-11 10:44:37
   */
  const handleMainTableColumnsState = (data: StateType['tableColumns']) => {
    dispatch({
      type: ActionType.SET_TABLE_COLUMNS,
      payload: data,
    })
  }

  /**
   * @Description 设置弹出框表单
   * @Author bihongbin
   * @Date 2020-09-11 13:58:36
   */
  const handleModalFormState = (data: Partial<StateType['handleModal']>) => {
    dispatch({
      type: ActionType.SET_HANDLE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置弹窗表格头
   * @Author bihongbin
   * @Date 2020-09-11 14:45:43
   */
  const handleTableModalColumnsState = (
    data: StateType['tableModalColumns'],
  ) => {
    dispatch({
      type: ActionType.SET_TABLE_MODAL_COLUMNS,
      payload: data,
    })
  }

  /**
   * @Description 设置搜索表单数据
   * @Author bihongbin
   * @Date 2020-09-10 18:08:53
   */
  useEffect(() => {
    handleSearchFormState([
      {
        componentName: 'Select',
        name: 'a',
        placeholder: '校区',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'b',
        placeholder: '教室',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'c',
        placeholder: '授课模式',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'd',
        placeholder: '科目',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'e',
        placeholder: '上课教室',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'f',
        placeholder: '记上课状态',
        selectData: [],
      },
    ])
  }, [])

  /**
   * @Description 设置上课信息弹窗数据
   * @Author bihongbin
   * @Date 2020-09-11 14:01:47
   */
  useEffect(() => {
    handleModalFormState({
      formList: [
        {
          componentName: 'Input',
          name: 'a',
          label: '上课主题',
          placeholder: '请输入上课主题',
          rules: [{ required: true, message: '请输入上课主题' }],
        },
        {
          componentName: 'Input',
          name: 'b',
          label: '班级',
          placeholder: '请选择班级',
          rules: [{ required: true, message: '请选择班级' }],
        },
        {
          componentName: 'Radio',
          name: 'c',
          label: '排课方式',
          selectData: [
            { label: '自由排课', value: '0' },
            { label: '重复排课', value: '1' },
          ],
        },
        {
          componentName: 'TextArea',
          name: 'd',
          label: '备注',
          rows: 3,
          colProps: { span: 24 },
          placeholder: '最多可以输入300个字',
          rules: [{ max: 300, message: '最多可以输入300个字' }],
        },
      ],
    })
  }, [])

  /**
   * @Description 设置上课登记表格头
   * @Author bihongbin
   * @Date 2020-09-11 10:46:26
   */
  useEffect(() => {
    handleMainTableColumnsState([
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
      { title: '状态', dataIndex: 'qtyEname' },
      { title: '上课校区', dataIndex: 'qtyEname' },
      { title: '教室', dataIndex: 'qtyEname' },
      {
        title: '操作',
        dataIndex: 'status',
        fixed: 'right',
        width: 50,
        render: (value: number, record: any) => {
          const operatingData = []
          // 编辑
          operatingData.push({
            name: '编辑',
            onClick: () => {
              handleModalFormState({
                visible: true,
                id: record.id,
                title: '编辑上课信息',
              })
            },
            svg: 'table_edit.png',
          })
          return <TableOperate operateButton={operatingData} />
        },
      },
    ])
  }, [])

  /**
   * @Description 设置弹窗表格头数据
   * @Author bihongbin
   * @Date 2020-09-11 14:44:50
   */
  useEffect(() => {
    handleTableModalColumnsState([
      { title: '学员姓名', dataIndex: 'a' },
      { title: '剩余课时/天数', dataIndex: 'b' },
      { title: '有效课时', dataIndex: 'c' },
      { title: '助教', dataIndex: 'd' },
      { title: '请假次数', dataIndex: 'e' },
      { title: '到课状态', dataIndex: 'f' },
      { title: '到课类型', dataIndex: 'g' },
      {
        title: '操作',
        dataIndex: 'status',
        fixed: 'right',
        width: 50,
        render: (value: number, record: any) => {
          const operatingData = []
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
          return <TableOperate operateButton={operatingData} />
        },
      },
    ])
  }, [])

  return (
    <>
      <div className="text-center mt-3 mb-3">
        <Space size={20}>
          <SxyButton
            className="btn-white-active-text"
            width={120}
            radius={20}
            mode="white"
          >
            今日上课
          </SxyButton>
          <SxyButton width={120} radius={20} mode="white">
            补记上课
          </SxyButton>
        </Space>
      </div>
      <LayoutTableList
        ref={mainListTableRef}
        api={getBasicQtyList}
        searchFormList={state.searchFormList}
        autoGetList
        cardTopTitle={
          <Space size={20}>
            <span>记上课</span>
            <Button type="primary">未排课记上课</Button>
          </Space>
        }
        cardTopButton={[
          { name: '自定义列表', type: 'default', clickConfirm: () => {} },
        ]}
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.tableColumns,
          tableConfig: {
            scroll: { x: 1300, y: 500 },
          },
        }}
      />
      <LayoutFormModal
        ref={modalFormRef}
        onCancel={() => handleModalFormState({ visible: false })}
        formConfig={{
          initialValues: {
            c: '0',
          },
        }}
        topRender={
          <Space className="mb-2" size={15} style={{ width: '100%' }}>
            <SxyBadge bg="#5860F8" />
            <span className="font-16">上课信息</span>
          </Space>
        }
        {...state.handleModal}
      >
        <Space className="mt-5" size={15} style={{ width: '100%' }}>
          <SxyBadge bg="#5860F8" />
          <span className="font-16">学员记上课</span>
        </Space>
        <Row className="mt-3">
          <Col>
            <Space>
              <Button type="primary">批量到课</Button>
              <Button>添加临时学员</Button>
              <Button>添加补课学员</Button>
            </Space>
          </Col>
        </Row>
        <div className="mt-3">
          <Text type="secondary">
            共 1 名学员， 到课 0 人 ， 请假 0 人， 旷课 0 人， 未记录 1 人
          </Text>
          <GenerateTable
            ref={modalTableRef}
            columns={state.tableModalColumns}
            tableConfig={{
              className: 'table-border-single mt-3',
            }}
            scroll={{ x: 900 }}
          />
        </div>
      </LayoutFormModal>
    </>
  )
}

export default RememberLesson
