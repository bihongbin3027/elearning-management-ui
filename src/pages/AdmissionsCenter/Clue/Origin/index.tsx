import React, { useReducer, useRef, useEffect } from 'react'
import { Card, Button, Row, Col } from 'antd'
import { ColumnType } from 'antd/es/table'
import GenerateForm, {
  FormCallType,
  FormListType,
} from '@/components/GenerateForm'
import LayoutFormModal, {
  LayoutFormModalCallType,
  LayoutFormModalListType,
} from '@/components/LayoutFormModal'
import { SxyIcon } from '@/style/module/icon'
import { AnyObjectType } from '@/typings'
import TableOperate from '@/components/TableOperate'
import GenerateTable, { TableCallType } from '@/components/GenerateTable'
import { getBasicQtyList, handleBasicQtyList } from '@/api/basicData'

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_MAIN_FORM_LIST = '[SetMainFormList Action]',
  SET_TABLE_COLUMNS = '[SetTableColumns Action]',
  SET_HANDLE_MODAL = '[SetHandleModal Action]',
}

const stateValue = {
  mainFormList: [] as FormListType[], // 头部搜索数据
  tableColumns: [] as ColumnType<AnyObjectType>[], // 表格头,
  // 新增编辑弹窗
  handleModal: {
    visible: false,
    id: '',
    width: 420,
    title: '新建线索来源',
    submitApi: handleBasicQtyList,
    formList: [] as LayoutFormModalListType[],
  },
}

const Origin = () => {
  const mainFormRef = useRef<FormCallType>() // 表单实例
  const tableRef = useRef<TableCallType>()
  const modalRef = useRef<LayoutFormModalCallType>()
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_MAIN_FORM_LIST: // 设置头部搜索表单
        return {
          ...state,
          mainFormList: action.payload,
        }
      case ActionType.SET_TABLE_COLUMNS: // 设置表格头
        return {
          ...state,
          tableColumns: action.payload,
        }
      case ActionType.SET_HANDLE_MODAL: // 设置编辑弹窗
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
   * @Description 设置主页面表单
   * @Author bihongbin
   * @Date 2020-09-22 09:23:19
   */
  const handleMainFormListState = (data: StateType['mainFormList']) => {
    dispatch({
      type: ActionType.SET_MAIN_FORM_LIST,
      payload: data,
    })
  }

  /**
   * @Description 设置表格头
   * @Author bihongbin
   * @Date 2020-09-22 09:24:36
   */
  const handleMainTableColumnsState = (data: StateType['tableColumns']) => {
    dispatch({
      type: ActionType.SET_TABLE_COLUMNS,
      payload: data,
    })
  }

  /**
   * @Description 设置编辑弹窗
   * @Author bihongbin
   * @Date 2020-09-22 09:34:01
   */
  const handleModalState = (data: Partial<StateType['handleModal']>) => {
    dispatch({
      type: ActionType.SET_HANDLE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置主页面表单
   * @Author bihongbin
   * @Date 2020-09-19 17:09:19
   */
  useEffect(() => {
    handleMainFormListState([
      {
        componentName: 'RangePicker',
        name: 'a',
        label: '创建时间',
        colProps: { span: 24 },
        rules: [{ required: true, message: '请选择创建时间' }],
      },
      {
        componentName: 'Radio',
        name: 'b',
        label: '分类',
        colProps: { span: 24 },
        rules: [{ required: true, message: '请选择分类' }],
        selectData: [
          { label: '用户', value: '0' },
          { label: '分销', value: '1' },
          { label: '招生表单', value: '2' },
          { label: '来电', value: '3' },
          { label: '来访', value: '4' },
          { label: '网站', value: '5' },
          { label: '微站', value: '6' },
          { label: '老学员再开发', value: '7' },
        ],
      },
    ])
  }, [])

  /**
   * @Description 设置表格头
   * @Author bihongbin
   * @Date 2020-09-22 09:23:19
   */
  useEffect(() => {
    handleMainTableColumnsState([
      { title: '渠道名称', dataIndex: 'qtyEname' },
      { title: '分类', dataIndex: 'qtyEname' },
      { title: '咨询量（人）', dataIndex: 'qtyEname' },
      { title: '成交量（人）', dataIndex: 'qtyEname' },
      { title: '成交率（%）', dataIndex: 'qtyEname' },
      { title: '创建时间', dataIndex: 'createTime' },
      { title: '备注', dataIndex: 'qtyEname' },
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
              handleModalState({
                visible: true,
                id: record.id,
                title: '编辑线索来源',
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
   * @Description 弹窗表单
   * @Author bihongbin
   * @Date 2020-09-22 10:37:22
   */
  useEffect(() => {
    handleModalState({
      formList: [
        {
          componentName: 'Input',
          name: 'a',
          label: '名称',
          placeholder: '请输入名称',
          colProps: { span: 24 },
          rules: [{ required: true, message: '请输入名称' }],
        },
        {
          componentName: 'Input',
          inputConfig: {
            inputMode: 'number',
          },
          name: 'b',
          label: '联系电话',
          placeholder: '请输入联系电话',
          colProps: { span: 24 },
          rules: [{ required: true, message: '请输入联系电话' }],
        },
        {
          componentName: 'TextArea',
          name: 'c',
          label: '沟通内容',
          placeholder: '请输入沟通内容',
          rows: 3,
          colProps: { span: 24 },
          rules: [{ required: true, message: '请输入沟通内容' }],
        },
      ],
    })
  }, [])

  /**
   * @Description 初始化
   * @Author bihongbin
   * @Date 2020-09-22 09:30:19
   */
  useEffect(() => {
    if (tableRef.current) {
      tableRef.current.getTableList()
    }
  }, [])

  return (
    <>
      <Card
        className="mt-4"
        title="线索来源"
        extra={
          <Button className="btn-text-icon" type="text">
            <SxyIcon width={16} height={16} name={'card_add.png'} />
            新建
          </Button>
        }
      >
        <Row>
          <Col span={12}>
            <GenerateForm
              ref={mainFormRef}
              className="form-ash-theme form-large-font14"
              formConfig={{
                size: 'large',
                labelCol: { span: 24 },
              }}
              rowGridConfig={{ gutter: [40, 0] }}
              colGirdConfig={{ span: 12 }}
              list={state.mainFormList}
            />
          </Col>
        </Row>
        <Row className="mt-5 mb-5" justify="center">
          <Col>
            <Button className="font-14" size="large" type="primary">
              保存
            </Button>
          </Col>
        </Row>
      </Card>
      <Card
        className="table-card mt-4"
        title={<Button>合并渠道</Button>}
        extra={
          <Button className="btn-text-icon" type="text">
            <SxyIcon width={16} height={16} name={'card_add.png'} />
            新建
          </Button>
        }
      >
        <div className="sxy-alert-box">
          当前结果：共4个渠道，咨询量总计为3，成交量总计为3，成交率为100%
        </div>
        <GenerateTable
          ref={tableRef}
          apiMethod={getBasicQtyList}
          columns={state.tableColumns}
          scroll={{
            x: 1300,
            y: 500,
          }}
        />
      </Card>
      <LayoutFormModal
        ref={modalRef}
        onCancel={() => handleModalState({ visible: false })}
        {...state.handleModal}
      />
    </>
  )
}

export default Origin
