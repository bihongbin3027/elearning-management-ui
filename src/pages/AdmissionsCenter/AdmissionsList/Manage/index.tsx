import React, { useRef, useReducer, useEffect } from 'react'
import { Space, Button, Row, Col } from 'antd'
import { ColumnType } from 'antd/es/table'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import LayoutFormModal, {
  LayoutFormModalCallType,
  LayoutFormModalListType,
} from '@/components/LayoutFormModal'
import GenerateTable, { TableCallType } from '@/components/GenerateTable'
import TableOperate from '@/components/TableOperate'
import { SxyBadge } from '@/style/module/badge'
import { AnyObjectType } from '@/typings'
import { getBasicQtyList, handleBasicQtyList } from '@/api/basicData'

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
    disable: false,
    width: 700,
    title: '新建学员',
    submitApi: handleBasicQtyList,
    formList: [] as LayoutFormModalListType[],
    courseLogColumnsList: [] as ColumnType<AnyObjectType>[],
  },
}

const PublicClues = () => {
  const mainListTableRef = useRef<LayoutTableCallType>(null)
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const courseLogModalRef = useRef<TableCallType>(null)
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
        componentName: 'Select',
        name: 'a',
        placeholder: '来源线索',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'b',
        placeholder: '课程',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'c',
        placeholder: '是否分班',
        selectData: [],
      },
      {
        componentName: 'Input',
        name: 'd',
        placeholder: '请输入学员姓名',
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
      { title: '姓名', dataIndex: 'qtyEname' },
      { title: '联系电话', dataIndex: 'qtyEname' },
      { title: '家长姓名', dataIndex: 'qtyEname' },
      { title: '来源线索', dataIndex: 'qtyEname' },
      { title: '介绍人', dataIndex: 'qtyEname' },
      { title: '课程', dataIndex: 'qtyEname' },
      { title: '班级', dataIndex: 'qtyEname' },
      {
        title: '操作',
        dataIndex: 'status',
        fixed: 'right',
        width: 50,
        render: (value: number, record: AnyObjectType) => {
          const operatingData = []
          // 查看
          operatingData.push({
            name: '查看',
            onClick: () => {
              handleModalState({
                visible: true,
                id: record.id,
                disable: true,
                title: '学员详情',
              })
            },
            svg: 'table_see.png',
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
          label: '学员姓名',
          placeholder: '请输入学员姓名',
          disabled: state.handleModal.disable,
          rules: [
            {
              required: true,
              message: '请输入学员姓名',
            },
          ],
        },
        {
          componentName: 'Union',
          label: '联系电话',
          disabled: state.handleModal.disable,
          unionConfig: {
            unionItems: [
              {
                componentName: 'Input',
                name: 'e1',
                placeholder: '请输入联系电话',
              },
              {
                componentName: 'Select',
                name: 'e2',
                placeholder: '请选择关系',
                selectData: [],
              },
            ],
          },
        },
        {
          componentName: 'Radio',
          name: 'c',
          label: '学员性别',
          placeholder: '请选择学员性别',
          colProps: { span: 24 },
          disabled: state.handleModal.disable,
          selectData: [
            { label: '男性', value: '0' },
            { label: '女性', value: '1' },
            { label: '未知', value: '2' },
          ],
        },
        {
          componentName: 'Input',
          name: 'd',
          label: '介绍人',
          placeholder: '请输入介绍人',
          disabled: state.handleModal.disable,
          render: () => (
            <Space className="mt-5" size={10} style={{ width: '100%' }}>
              <SxyBadge bg="#5860F8" />
              <span className="font-16">更多信息</span>
            </Space>
          ),
        },
        {
          componentName: 'Input',
          name: 'd1',
          label: '家长姓名',
          placeholder: '请输入家长姓名',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'e',
          label: '磁卡卡号',
          placeholder: '请输入磁卡卡号',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'i',
          label: '微信号',
          placeholder: '请输入微信号',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'j',
          label: '生日',
          disabled: state.handleModal.disable,
          render: () => (
            <Space className="mt-5" size={10} style={{ width: '100%' }}>
              <SxyBadge bg="#5860F8" />
              <span className="font-16">课程记录</span>
            </Space>
          ),
        },
        {
          componentName: 'Select',
          name: 'k',
          label: '年纪',
          placeholder: '请选择年纪',
          disabled: state.handleModal.disable,
          selectData: [],
        },
      ],
      courseLogColumnsList: [
        { title: '课程名称/组合包名称', dataIndex: 'qtyEname', ellipsis: true },
        { title: '总课时', dataIndex: 'qtyEname', ellipsis: true },
        { title: '报名前已上', dataIndex: 'qtyEname', ellipsis: true },
        { title: '报名后已上', dataIndex: 'qtyEname', ellipsis: true },
        { title: '剩余', dataIndex: 'qtyEname', ellipsis: true },
        { title: '截止时间', dataIndex: 'qtyEname', ellipsis: true },
        {
          title: '请假限制次数/限制次数',
          dataIndex: 'qtyEname',
          ellipsis: true,
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 70,
          render: (value: number, record: AnyObjectType) => {
            return (
              <Button type="primary" size="small">
                分班
              </Button>
            )
          },
        },
      ],
    })
  }, [state.handleModal.disable])

  useEffect(() => {
    if (state.handleModal.visible) {
      setTimeout(() => {
        if (courseLogModalRef.current) {
          courseLogModalRef.current.getTableList() // 查询课程记录
        }
      })
    }
  }, [state.handleModal.visible])

  return (
    <div className="mt-4">
      <LayoutTableList
        ref={mainListTableRef}
        api={getBasicQtyList}
        searchFormList={state.searchFormList}
        autoGetList
        cardTopTitle={
          <Row align="middle" gutter={20}>
            <Col>学员列表</Col>
            <Col>
              <Space size={10}>
                <Button>分班</Button>
                <Button>导出</Button>
              </Space>
            </Col>
          </Row>
        }
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
        topRender={
          <Space size={10} style={{ width: '100%' }}>
            <SxyBadge bg="#5860F8" />
            <span className="font-16">基础信息</span>
          </Space>
        }
        onCancel={() => handleModalState({ visible: false })}
        {...state.handleModal}
      >
        <div className="mt-3">
          <GenerateTable
            ref={courseLogModalRef}
            apiMethod={getBasicQtyList}
            columns={state.handleModal.courseLogColumnsList}
            tableConfig={{
              className: 'table-header-grey',
              scroll: {
                x: 1300,
                y: 300,
              },
            }}
          />
        </div>
      </LayoutFormModal>
    </div>
  )
}

export default PublicClues
