import React, { useRef, useReducer, useEffect } from 'react'
import {
  Col,
  Row,
  Card,
  Typography,
  Space,
  Button,
  Tabs,
  Radio,
  Modal,
  Image,
} from 'antd'
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
import { SxyIcon } from '@/style/module/icon'
import { SxyButton } from '@/style/module/button'
import { handleRowDelete } from '@/utils'
import { AnyObjectType } from '@/typings'
import {
  getBasicQtyList,
  handleBasicQtyList,
  deleteBasicQtyList,
} from '@/api/basicData'

const { TabPane } = Tabs
const { Title, Text } = Typography

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
  SET_RECHARGE_MODAL = '[SetRechargeModal Action]',
  SET_WITHDRAW_MODAL = '[SetWithdrawModal Action]',
}

const stateValue = {
  searchFormList: [] as FormListCallType[], // 头部搜索数据
  tableColumns: [] as ColumnType<AnyObjectType>[], // 表格头,
  // 新增编辑弹窗
  handleModal: {
    visible: false,
    id: '',
    width: 420,
    title: '新增收支',
    tabKey: '1',
    submitApi: handleBasicQtyList,
    formList: [] as LayoutFormModalListType[],
  },
  // 充值弹窗
  rechargeModal: {
    visible: false,
    width: 420,
    title: '充值',
    formList: [] as LayoutFormModalListType[],
  },
  // 提现弹窗
  withdrawModal: {
    visible: false,
    width: 420,
    title: '提现',
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
      case ActionType.SET_RECHARGE_MODAL: // 设置充值弹窗
        return {
          ...state,
          rechargeModal: {
            ...state.rechargeModal,
            ...action.payload,
          },
        }
      case ActionType.SET_WITHDRAW_MODAL: // 设置提现弹窗
        return {
          ...state,
          withdrawModal: {
            ...state.withdrawModal,
            ...action.payload,
          },
        }
    }
  }, stateValue)

  /**
   * @Description 新增编辑弹窗
   * @Author bihongbin
   * @Date 2020-09-24 17:22:15
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
   * @Date 2020-09-24 17:22:30
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
   * @Date 2020-09-24 17:22:47
   */
  const handleTableColumnsState = (data: StateType['tableColumns']) => {
    dispatch({
      type: ActionType.SET_TABLE_COLUMNS,
      payload: data,
    })
  }

  /**
   * @Description 设置充值弹窗数据
   * @Author bihongbin
   * @Date 2020-09-25 09:38:25
   */
  const handleRechargeState = (data: Partial<StateType['rechargeModal']>) => {
    dispatch({
      type: ActionType.SET_RECHARGE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置提现弹窗数据
   * @Author bihongbin
   * @Date 2020-09-25 10:06:20
   */
  const handleWithdrawState = (data: Partial<StateType['withdrawModal']>) => {
    dispatch({
      type: ActionType.SET_WITHDRAW_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置搜索表单头
   * @Author bihongbin
   * @Date 2020-09-24 17:23:04
   */
  useEffect(() => {
    handleSearchFormState([
      {
        componentName: 'Input',
        name: 'a',
        placeholder: '请输入收支编号',
      },
      {
        componentName: 'Select',
        name: 'b',
        placeholder: '请选择账户类型',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'c',
        placeholder: '请选择操作类型',
        selectData: [],
      },
    ])
  }, [])

  /**
   * @Description 设置表格头数据
   * @Author bihongbin
   * @Date 2020-09-24 17:27:50
   */
  useEffect(() => {
    handleTableColumnsState([
      { title: '序号', dataIndex: 'sortSeq', width: 60 },
      { title: '收支编号', dataIndex: 'qtyEname' },
      { title: '操作类型', dataIndex: 'qtyEname' },
      { title: '收支项目', dataIndex: 'qtyEname' },
      { title: '收入金额', dataIndex: 'qtyEname' },
      { title: '支出金额', dataIndex: 'qtyEname' },
      { title: '客户', dataIndex: 'qtyEname' },
      { title: '账户类型', dataIndex: 'qtyEname' },
      { title: '操作时间', dataIndex: 'qtyEname' },
      { title: '操作人员', dataIndex: 'qtyEname' },
      {
        title: '操作',
        dataIndex: 'status',
        fixed: 'right',
        width: 90,
        render: (value: number, record: AnyObjectType) => {
          const operatingData = []
          // 编辑
          operatingData.push({
            name: '编辑',
            onClick: () => {
              handleModalState({
                visible: true,
                id: record.id,
                title: '编辑收支',
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
          return <TableOperate operateButton={operatingData} />
        },
      },
    ])
  }, [])

  /**
   * @Description 设置新增编辑弹窗表单
   * @Author bihongbin
   * @Date 2020-09-24 17:45:38
   */
  useEffect(() => {
    const tabKey = parseInt(state.handleModal.tabKey)
    // 收入
    if (tabKey === 1) {
      handleModalState({
        formList: [
          {
            componentName: 'Select',
            name: 'a',
            label: '校区',
            placeholder: '请选择校区',
            colProps: { span: 24 },
            selectData: [],
          },
          {
            componentName: 'Select',
            name: 'b',
            label: '收入账户',
            placeholder: '请选择收入账户',
            colProps: { span: 24 },
            selectData: [],
          },
          {
            componentName: 'Select',
            name: 'c',
            label: '收入项目',
            placeholder: '请选择收入项目',
            colProps: { span: 24 },
            selectData: [],
          },
          {
            componentName: 'Input',
            name: 'd',
            label: '收入金额',
            placeholder: '请输入收入金额',
            colProps: { span: 24 },
          },
          {
            componentName: 'Select',
            name: 'e',
            label: '核算人员',
            placeholder: '请选择核算人员',
            colProps: { span: 24 },
            selectData: [],
          },
          {
            componentName: 'DatePicker',
            name: 'f',
            label: '核算日期',
            colProps: { span: 24 },
          },
          {
            componentName: 'TextArea',
            name: 'g',
            label: '备注',
            rows: 3,
            colProps: { span: 24 },
          },
        ],
      })
    }
    // 支出
    if (tabKey === 2) {
      handleModalState({
        formList: [
          {
            componentName: 'Select',
            name: 'a',
            label: '校区',
            placeholder: '请选择校区',
            colProps: { span: 24 },
            selectData: [],
          },
          {
            componentName: 'Select',
            name: 'b',
            label: '支出账户',
            placeholder: '请选择支出账户',
            colProps: { span: 24 },
            selectData: [],
          },
          {
            componentName: 'Select',
            name: 'c',
            label: '支出项目',
            placeholder: '请选择支出项目',
            colProps: { span: 24 },
            selectData: [],
          },
          {
            componentName: 'Input',
            name: 'd',
            label: '支出金额',
            placeholder: '请输入支出金额',
            colProps: { span: 24 },
          },
          {
            componentName: 'Select',
            name: 'e',
            label: '核算人员',
            placeholder: '请选择核算人员',
            colProps: { span: 24 },
            selectData: [],
          },
          {
            componentName: 'DatePicker',
            name: 'f',
            label: '核算日期',
            colProps: { span: 24 },
          },
          {
            componentName: 'TextArea',
            name: 'g',
            label: '备注',
            rows: 3,
            colProps: { span: 24 },
          },
        ],
      })
    }
  }, [state.handleModal.tabKey])

  /**
   * @Description 设置充值弹窗数据
   * @Author bihongbin
   * @Date 2020-09-25 09:38:49
   */
  useEffect(() => {
    handleRechargeState({
      formList: [
        {
          componentName: 'Input',
          name: 'a',
          label: '充值金额',
          placeholder: '请输入充值金额',
          colProps: { span: 24 },
        },
        {
          componentName: 'Select',
          name: 'b',
          label: '充值方式',
          placeholder: '请选择充值方式',
          colProps: { span: 24 },
          selectData: [],
          render: () => (
            <div className="text-center">
              <div>
                <Text type="secondary">扫码二维码进行充值</Text>
              </div>
              <Image
                className="mt-2"
                width={120}
                height={120}
                src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              />
            </div>
          ),
        },
        {
          componentName: 'Select',
          name: 'c',
          label: '所属银行',
          placeholder: '请选择所属银行',
          colProps: { span: 24 },
          selectData: [],
        },
      ],
    })
  }, [])

  /**
   * @Description 设置提现弹窗数据
   * @Author bihongbin
   * @Date 2020-09-25 10:10:29
   */
  useEffect(() => {
    handleWithdrawState({
      formList: [
        {
          componentName: 'Input',
          name: 'a',
          label: '提现金额',
          placeholder: '请输入提现金额',
          colProps: { span: 24 },
        },
        {
          componentName: 'Select',
          name: 'b',
          label: '提现至银行卡',
          placeholder: '请选择银行卡',
          colProps: { span: 24 },
          selectData: [],
        },
        {
          componentName: 'Input',
          name: 'c',
          label: '银行卡号',
          placeholder: '请输入银行卡号',
          colProps: { span: 24 },
        },
      ],
    })
  }, [])

  return (
    <>
      <Card className="mt-4">
        <Row className="mt-1 mb-1" justify="space-between" align="middle">
          <Col className="font-16">
            <Space size={10}>
              <SxyIcon name="account_num.png" width={48} height={48} />
              账户余额
              <Title level={4} style={{ marginBottom: 0 }}>
                2000000.00
              </Title>
            </Space>
          </Col>
          <Col>
            <Space size={20}>
              <SxyButton
                mode="deep-green"
                size="large"
                width={80}
                font={16}
                radius={20}
                onClick={() => handleRechargeState({ visible: true })}
              >
                充值
              </SxyButton>
              <SxyButton
                mode="primary"
                size="large"
                width={80}
                font={16}
                radius={20}
                onClick={() => handleWithdrawState({ visible: true })}
              >
                提现
              </SxyButton>
            </Space>
          </Col>
        </Row>
      </Card>
      <div className="mt-4">
        <LayoutTableList
          ref={mainListTableRef}
          api={getBasicQtyList}
          searchFormList={state.searchFormList}
          autoGetList
          cardTopTitle={
            <Row align="middle" gutter={20}>
              <Col>
                <Radio.Group defaultValue="a" buttonStyle="solid">
                  <Radio.Button value="a">收支明细</Radio.Button>
                  <Radio.Button value="b">充值记录</Radio.Button>
                  <Radio.Button value="c">提现记录</Radio.Button>
                </Radio.Group>
              </Col>
              <Col>
                <Button>导出</Button>
              </Col>
            </Row>
          }
          cardTopButton={[
            {
              name: '新增',
              icon: 'card_add.png',
              clickConfirm: () => {
                handleModalState({
                  visible: true,
                  id: '',
                  title: '新增收支',
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
      </div>
      <LayoutFormModal
        ref={layoutFormModalRef}
        onCancel={() => handleModalState({ visible: false })}
        topRender={
          <Tabs
            activeKey={state.handleModal.tabKey}
            onChange={(key) => {
              handleModalState({ tabKey: key })
            }}
          >
            <TabPane tab="收入" key="1" />
            <TabPane tab="支出" key="2" />
          </Tabs>
        }
        {...state.handleModal}
      />
      <LayoutFormModal
        onCancel={() => handleRechargeState({ visible: false })}
        onConfirm={() => {
          handleRechargeState({ visible: false })
          Modal.confirm({
            title: '充值提示',
            width: 360,
            className: 'confirm-modal',
            centered: true,
            content:
              '请您在新打开的网上银行页面进行支付，支付完成前请不要关闭该窗口',
            cancelText: '支付遇到问题',
            okText: '已完成支付',
            onOk() {
              // 这里需要使用promise
              console.log('OK')
            },
            onCancel() {
              console.log('支付遇到问题')
            },
          })
        }}
        {...state.rechargeModal}
      />
      <LayoutFormModal
        onCancel={() => handleWithdrawState({ visible: false })}
        onConfirm={() => {
          handleWithdrawState({ visible: false })
          Modal.confirm({
            title: '提现处理中',
            width: 360,
            className: 'confirm-modal popup-success',
            centered: true,
            content: '您已申请提现100元，预计1-3工作日内到账，请您耐心等待',
            onOk() {
              // 这里需要使用promise
              console.log('OK')
            },
          })
        }}
        {...state.withdrawModal}
      />
    </>
  )
}

export default MainPage
