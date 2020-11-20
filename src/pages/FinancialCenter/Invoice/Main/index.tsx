import React, { useRef, useReducer, useEffect } from 'react'
import { Space, Button, Avatar, Row, Col } from 'antd'
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
import { AnyObjectType } from '@/typings'
import TableOperate from '@/components/TableOperate'
import { handleRowDelete } from '@/utils'
import { SxyBadge } from '@/style/module/badge'
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
    title: '发票详情',
    width: 700,
    disable: false,
    shopTableColumns: [
      { title: '子单号', dataIndex: 'qtyEname' },
      { title: '商品名称', dataIndex: 'qtyEname' },
      { title: '商品编号', dataIndex: 'qtyEname' },
      { title: '规格', dataIndex: 'qtyEname' },
      { title: '价格', dataIndex: 'qtyEname' },
      { title: '数量', dataIndex: 'qtyEname' },
      { title: '商品金额', dataIndex: 'qtyEname' },
      { title: '优惠金额', dataIndex: 'qtyEname' },
      { title: '需付金额', dataIndex: 'qtyEname' },
    ],
    shopTableData: [],
    formList: [] as LayoutFormModalListType[],
  },
}

const MainPage = () => {
  const mainListTableRef = useRef<LayoutTableCallType>(null)
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const shopModalRef = useRef<TableCallType>(null)
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
   * @Description 设置搜索表单数据
   * @Author bihongbin
   * @Date 2020-09-11 17:01:13
   */
  useEffect(() => {
    handleSearchFormState([
      {
        componentName: 'Input',
        name: 'a',
        placeholder: '发票编号',
      },
      {
        componentName: 'Input',
        name: 'b',
        placeholder: '发票名称',
      },
      {
        componentName: 'Select',
        name: 'c',
        placeholder: '开票状态',
        selectData: [],
      },
      {
        componentName: 'Input',
        name: 'd',
        placeholder: '请输入发票名称/编号',
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
      { title: '发票票号', dataIndex: 'qtyEname' },
      { title: '发票抬头', dataIndex: 'qtyEname' },
      { title: '纳税识别号', dataIndex: 'qtyEname' },
      { title: '票据类型', dataIndex: 'qtyEname' },
      { title: '开票金额', dataIndex: 'qtyEname' },
      { title: '申请人', dataIndex: 'qtyEname' },
      { title: '开票日期', dataIndex: 'qtyEname' },
      { title: '开票状态', dataIndex: 'qtyEname' },
      {
        title: '操作',
        dataIndex: 'status',
        fixed: 'right',
        width: 90,
        render: (value: number, record: any) => {
          const operatingData = []
          // 查看
          operatingData.push({
            name: '查看',
            onClick: () => {
              handleModalState({
                visible: true,
                disable: true,
                id: record.id,
                title: '发票详情',
              })
            },
            svg: 'table_see.png',
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
          label: '发票名称',
          placeholder: '请输入发票名称',
          disabled: state.handleModal.disable,
          rules: [
            {
              required: true,
              message: '请输入发票名称',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'b',
          label: '纳税识别号',
          placeholder: '请输入纳税识别号',
          disabled: state.handleModal.disable,
          rules: [
            {
              required: true,
              message: '请输入纳税识别号',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'c',
          label: '单位地址',
          placeholder: '请输入单位地址',
          disabled: state.handleModal.disable,
          colProps: { span: 24 },
        },
        {
          componentName: 'Input',
          name: 'd',
          label: '电话号码',
          placeholder: '请输入电话号码',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'e',
          label: '邮箱地址',
          placeholder: '请输入邮箱地址',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'f',
          label: '开户银行',
          placeholder: '请输入开户银行',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'f1',
          label: '银行账号',
          placeholder: '请输入银行账号',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'h',
          label: '收货地址',
          placeholder: '请输入收货地址',
          colProps: { span: 24 },
          disabled: state.handleModal.disable,
          render: () => (
            <>
              <div>
                <Space className="mt-5" size={10} style={{ width: '100%' }}>
                  <SxyBadge bg="#5860F8" />
                  <span className="font-16">商品信息</span>
                </Space>
              </div>
              <div className="mt-2">
                <GenerateTable
                  ref={shopModalRef}
                  data={state.handleModal.shopTableData}
                  columns={state.handleModal.shopTableColumns}
                  tableConfig={{
                    className: 'table-header-grey',
                    scroll: {
                      x: 800,
                      y: 300,
                    },
                  }}
                />
                <Row className="mt-3" justify="end">
                  <Col span={8}>
                    <Row>
                      <Col className="text-desc text-right" span={14}>
                        商品总额：
                      </Col>
                      <Col className="text-right" span={9}>
                        ￥146.00
                      </Col>
                    </Row>
                    <Row>
                      <Col className="text-desc text-right" span={14}>
                        运费：
                      </Col>
                      <Col className="text-right" span={9}>
                        +￥0.00
                      </Col>
                    </Row>
                    <Row>
                      <Col className="text-desc text-right" span={14}>
                        活动减免金额：
                      </Col>
                      <Col className="text-right" span={9}>
                        -￥10.00
                      </Col>
                    </Row>
                    <Row>
                      <Col className="text-desc text-right" span={14}>
                        需付总金额：
                      </Col>
                      <Col className="text-right" span={9}>
                        ￥136.00
                      </Col>
                    </Row>
                    <Row>
                      <Col className="text-desc text-right" span={14}>
                        实付总金额：
                      </Col>
                      <Col className="text-right" span={9}>
                        ￥136.00
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </div>
              <div>
                <Space className="mt-5" size={10} style={{ width: '100%' }}>
                  <SxyBadge bg="#5860F8" />
                  <span className="font-16">开票信息</span>
                </Space>
              </div>
            </>
          ),
        },
        {
          componentName: 'DatePicker',
          name: 'i',
          label: '开发票日期',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'j',
          label: '发票编号',
          placeholder: '请输入发票编号',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'k',
          label: '已开发票资料',
          placeholder: '请输入已开发票资料',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'l',
          label: '开票内容',
          placeholder: '请输入开票内容',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'm',
          inputConfig: {
            inputMode: 'number',
          },
          label: '商品数量',
          placeholder: '请输入商品数量',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'n',
          label: '发票类型',
          placeholder: '请选择发票类型',
          selectData: [],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'o',
          inputConfig: {
            inputMode: 'number',
          },
          label: '发票金额',
          placeholder: '请输入发票金额',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'p',
          label: '是否有退款',
          placeholder: '请选择是否有退款',
          selectData: [],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'q',
          inputConfig: {
            inputMode: 'number',
          },
          label: '退款金额',
          placeholder: '请输入退款金额',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'HideInput',
          name: 'r',
          label: '上传发票',
          placeholder: '请上传发票',
          colProps: { span: 24 },
          disabled: state.handleModal.disable,
          render: () => (
            <Space size={20}>
              <Avatar shape="square" size={100} />
              <Button size="middle" type="primary">
                上传
              </Button>
            </Space>
          ),
        },
      ],
    })
  }, [
    state.handleModal.disable,
    state.handleModal.shopTableColumns,
    state.handleModal.shopTableData,
  ])

  return (
    <div className="mt-4">
      <LayoutTableList
        ref={mainListTableRef}
        api={getBasicQtyList}
        searchFormList={state.searchFormList}
        autoGetList
        cardTopTitle={
          <Row gutter={20} align="middle">
            <Col>发票</Col>
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
            scroll: { x: 1600, y: 500 },
          },
        }}
      />
      <LayoutFormModal
        ref={layoutFormModalRef}
        topRender={
          <Space size={10} style={{ width: '100%' }}>
            <SxyBadge bg="#5860F8" />
            <span className="font-16">申请信息</span>
          </Space>
        }
        onCancel={() => handleModalState({ visible: false })}
        {...state.handleModal}
      />
    </div>
  )
}

export default MainPage
