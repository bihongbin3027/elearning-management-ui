import React, { useRef, useReducer, useEffect } from 'react'
import { Space, Button, Row, Col, message, Modal } from 'antd'
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
import { getBasicQtyList, deleteBasicQtyList } from '@/api/basicData'

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
    title: '',
    formList: [] as LayoutFormModalListType[],
  },
}

const MainPage = () => {
  const mainListTableRef = useRef<LayoutTableCallType>(null)
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
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
   * @Description 审批
   * @Author bihongbin
   * @Date 2020-09-27 14:43:10
   */
  const onApprove = () => {
    if (mainListTableRef.current) {
      const selectedRows = mainListTableRef.current.getSelectRowsArray()
      if (selectedRows.length) {
        Modal.confirm({
          title: '审批处理',
          width: 360,
          className: 'confirm-modal',
          centered: true,
          maskClosable: true,
          content: '请您尽快审批处理此条付款记录',
          cancelText: '驳回',
          okText: '提交',
          onOk() {
            // 这里需要使用promise
            console.log('OK')
          },
          onCancel() {
            console.log('驳回')
          },
        })
      } else {
        message.warn('请选择数据', 1.5)
      }
    }
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
        placeholder: '付款凭证单号',
      },
      {
        componentName: 'Input',
        name: 'b',
        placeholder: '交易流水号',
      },
      {
        componentName: 'Select',
        name: 'c',
        placeholder: '付款方式',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'd',
        placeholder: '付款状态',
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
      { title: '序号', dataIndex: 'sortSeq', width: 60 },
      { title: '付款凭证单号', dataIndex: 'qtyEname' },
      { title: '交易流水号', dataIndex: 'qtyEname' },
      { title: '付款人', dataIndex: 'qtyEname' },
      { title: '收款人', dataIndex: 'qtyEname' },
      { title: '收款方式', dataIndex: 'qtyEname' },
      { title: '应付金额', dataIndex: 'qtyEname' },
      { title: '收款日期', dataIndex: 'qtyEname' },
      { title: '收款状态', dataIndex: 'qtyEname' },
      { title: '经办人', dataIndex: 'qtyEname' },
      { title: '财务人员', dataIndex: 'qtyEname' },
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
                title: '编辑付款申请',
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
          label: '付款凭证单号',
          placeholder: '请输入付款凭证单号',
        },
        {
          componentName: 'Input',
          name: 'b',
          label: '交易流水号',
          placeholder: '请输入交易流水号',
        },
        {
          componentName: 'Select',
          name: 'c',
          label: '付款方式',
          placeholder: '请选择付款方式',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'q',
          label: '付款状态',
          placeholder: '请选择付款状态',
          selectData: [],
        },
        {
          componentName: 'Input',
          name: 'e',
          label: '付款人',
          placeholder: '请输入付款人',
        },
        {
          componentName: 'Input',
          name: 'f',
          label: '付款账号',
          placeholder: '请输入付款账号',
        },
        {
          componentName: 'Input',
          name: 'f1',
          label: '收款人',
          placeholder: '请输入收款人',
        },
        {
          componentName: 'Input',
          name: 'i',
          label: '收款账号',
          placeholder: '请输入收款账号',
        },
        {
          componentName: 'Input',
          name: 'j',
          label: '应付金额',
          placeholder: '请输入应付金额',
        },
        {
          componentName: 'DatePicker',
          name: 'l',
          label: '付款日期',
        },
        {
          componentName: 'Input',
          name: 'm',
          label: '费用说明',
          placeholder: '请输入费用说明',
        },
        {
          componentName: 'Input',
          name: 'o',
          label: '经办人',
          placeholder: '请输入经办人',
        },
        {
          componentName: 'Input',
          name: 'p',
          label: '财务人员',
          placeholder: '请输入财务人员',
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
        cardTopTitle={
          <Row gutter={20} align="middle">
            <Col>应付款项</Col>
            <Col>
              <Space size={10}>
                <Button onClick={onApprove}>审批</Button>
              </Space>
            </Col>
          </Row>
        }
        cardTopButton={[
          {
            name: '付款申请',
            icon: 'card_add.png',
            clickConfirm: () => {
              handleModalState({
                visible: true,
                title: '新增付款申请',
              })
            },
          },
        ]}
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.tableColumns,
          tableConfig: {
            scroll: { x: 1600, y: 500 },
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

export default MainPage
