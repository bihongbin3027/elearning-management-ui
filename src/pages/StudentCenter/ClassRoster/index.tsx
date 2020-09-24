import React, { useRef, useReducer, useEffect } from 'react'
import {
  Space,
  Button,
  Avatar,
  Alert,
  Typography,
  Row,
  Col,
  message,
  Modal,
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
import { SxyButton } from '@/style/module/button'
import { AnyObjectType } from '@/typings'
import TableOperate from '@/components/TableOperate'
import { handleRowDelete } from '@/utils'
import { SxyBadge } from '@/style/module/badge'
import ResetPasswordModal from '@/components/ResetPasswordModal'
import NewNotificationModal from '@/pages/StudentCenter/ClassRoster/NewNotificationModal'
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
  SET_RESET_PASSWORD_MODAL = '[SetResetPasswordModal Action]',
  SET_BATCH_ADJUSTMENT_MODAL = '[SetBatchAdjustmentModal Action]',
  SET_GLOBAL_ADJUSTMENT_MODAL = '[SetGlobalAdjustmentModal Action]',
  SET_CREATE_NOTIFICATION_MODAL = '[SetCreateNotificationModal Action]',
}

const stateValue = {
  searchFormList: [] as FormListCallType[], // 头部搜索数据
  tableColumns: [] as ColumnType<AnyObjectType>[], // 表格头,
  // 新增编辑弹窗
  handleModal: {
    visible: false,
    id: '',
    title: '新增花名册',
    submitApi: handleBasicQtyList,
    formList: [] as LayoutFormModalListType[],
  },
  // 重置密码弹窗
  resetPasswordModal: {
    visible: false,
    title: '重置密码',
    id: '',
  },
  // 批量调整弹窗
  batchAdjustmentModal: {
    visible: false,
    id: '',
    width: 420,
    title: '批量调整',
    submitApi: handleBasicQtyList,
    formList: [] as LayoutFormModalListType[],
  },
  // 全局调整弹窗
  globalAdjustmentModal: {
    visible: false,
    id: '',
    width: 420,
    title: '全局调整',
    submitApi: handleBasicQtyList,
    formList: [] as LayoutFormModalListType[],
  },
  // 新建通知弹窗
  createNotificationModal: {
    visible: false,
  },
}

const ClassRoster = () => {
  const mainListTableRef = useRef<LayoutTableCallType>(null)
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const batchAdjustmentRef = useRef<LayoutFormModalCallType>()
  const globalAdjustmentRef = useRef<LayoutFormModalCallType>()
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
      case ActionType.SET_RESET_PASSWORD_MODAL: // 设置重置密码弹窗
        return {
          ...state,
          resetPasswordModal: {
            ...state.resetPasswordModal,
            ...action.payload,
          },
        }
      case ActionType.SET_BATCH_ADJUSTMENT_MODAL: // 设置批量调整弹窗
        return {
          ...state,
          batchAdjustmentModal: {
            ...state.batchAdjustmentModal,
            ...action.payload,
          },
        }
      case ActionType.SET_GLOBAL_ADJUSTMENT_MODAL: // 设置全局调整弹窗
        return {
          ...state,
          globalAdjustmentModal: {
            ...state.globalAdjustmentModal,
            ...action.payload,
          },
        }
      case ActionType.SET_CREATE_NOTIFICATION_MODAL: // 设置新建通知弹窗
        return {
          ...state,
          createNotificationModal: {
            ...state.createNotificationModal,
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
   * @Description 设置批量调整弹窗数据
   * @Author bihongbin
   * @Date 2020-09-17 15:48:28
   */
  const handleBatchAdjustmentState = (
    data: Partial<StateType['batchAdjustmentModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_BATCH_ADJUSTMENT_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置全局调整弹窗数据
   * @Author bihongbin
   * @Date 2020-09-17 15:48:28
   */
  const handleGlobalAdjustmentState = (
    data: Partial<StateType['globalAdjustmentModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_GLOBAL_ADJUSTMENT_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置重置密码弹窗数据
   * @Author bihongbin
   * @Date 2020-09-17 15:24:01
   */
  const handleResetPasswordState = (
    data: Partial<StateType['resetPasswordModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_RESET_PASSWORD_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置通知弹窗数据
   * @Author bihongbin
   * @Date 2020-09-17 18:23:41
   */
  const handleCreateNotificationState = (
    data: Partial<StateType['createNotificationModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_CREATE_NOTIFICATION_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 批量操作
   * @Author bihongbin
   * @Date 2020-09-17 16:02:41
   */
  const onBatchOperation = (type: 'batch' | 'global') => {
    message.destroy()
    if (
      mainListTableRef.current &&
      mainListTableRef.current.getSelectIds().length
    ) {
      // 批量调整
      if (type === 'batch') {
        handleBatchAdjustmentState({ visible: true })
      }
      // 全局调整
      if (type === 'global') {
        handleGlobalAdjustmentState({ visible: true })
      }
    } else {
      message.warn('请选择数据', 1.5)
    }
  }

  /**
   * @Description 发送通知
   * @Author bihongbin
   * @Date 2020-09-17 17:17:48
   */
  const onSendNotification = () => {
    message.destroy()
    if (
      mainListTableRef.current &&
      mainListTableRef.current.getSelectIds().length
    ) {
      Modal.confirm({
        title: '温馨提示',
        content:
          '系统只支持给已关注华旅云创的学员发送公告通知。本次您勾选了1位学员，其中1位学员已关注华旅云创',
        okText: '知道啦',
        onOk: () => {
          handleCreateNotificationState({ visible: true })
        },
      })
    } else {
      message.warn('请选择数据', 1.5)
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
        componentName: 'Select',
        name: 'a',
        placeholder: '学员状态',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'b',
        placeholder: '报读校区',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'c',
        placeholder: '性别',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'd',
        placeholder: '是否欠费',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'e',
        placeholder: '新老生',
        selectData: [],
      },
      {
        componentName: 'Input',
        name: 'f',
        placeholder: '学员姓名',
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
      { title: '手机', dataIndex: 'qtyEname' },
      { title: '性别', dataIndex: 'qtyEname' },
      { title: '身份证号码', dataIndex: 'qtyEname' },
      {
        title: '状态',
        dataIndex: 'qtyEname',
        render: () => {
          return (
            <SxyButton mode="light-green" radius={15}>
              学习中
            </SxyButton>
            // <SxyButton mode="pale-yellow" radius={15}>
            //   休学
            // </SxyButton>
            // <SxyButton mode="light-red" radius={15}>
            //   退学
            // </SxyButton>
            // <SxyButton mode="light-gray" radius={15}>
            //   已学完
            // </SxyButton>
          )
        },
      },
      { title: '就读班级', dataIndex: 'qtyEname' },
      { title: '单位', dataIndex: 'qtyEname' },
      {
        title: '操作',
        dataIndex: 'status',
        fixed: 'right',
        width: 135,
        render: (value: number, record: any) => {
          const operatingData = []
          // 编辑
          operatingData.push({
            name: '编辑',
            onClick: () => {
              handleModalState({
                visible: true,
                id: record.id,
                title: '编辑花名册',
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
          // 更多
          operatingData.push({
            name: '更多',
            type: 'more',
            svg: 'table_more.png',
            moreList: [
              {
                name: '重置密码',
                onClick: () => {
                  handleResetPasswordState({ visible: true })
                },
              },
            ],
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
          label: '姓名',
          placeholder: '请输入姓名',
          rules: [
            {
              required: true,
              message: '请输入姓名',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'b',
          label: '手机号',
          placeholder: '请输入手机号',
          rules: [
            {
              required: true,
              message: '请输入手机号',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'c',
          label: '就读班级',
          placeholder: '请输入就读班级',
        },
        {
          componentName: 'Input',
          name: 'd',
          label: '单位',
          placeholder: '请输入单位',
        },
        {
          componentName: 'Select',
          name: 'e',
          label: '学习状态',
          placeholder: '请选择学习状态',
          selectData: [],
          rules: [
            {
              required: true,
              message: '请选择学习状态',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'f',
          label: '身份证号码',
          placeholder: '请输入身份证号码',
          rules: [
            {
              required: true,
              message: '请输入身份证号码',
            },
          ],
        },
        {
          componentName: 'HideInput',
          name: 'g',
          label: '证件照片',
          placeholder: '请上传证件照片',
          colProps: { span: 24 },
          rules: [
            {
              required: true,
              message: '请上传证件照片',
            },
          ],
          render: () => (
            <Space size={20}>
              <Avatar shape="square" size={100} />
              <Button size="middle" type="primary">
                上传
              </Button>
            </Space>
          ),
        },
        {
          componentName: 'Input',
          name: 'h',
          label: '证书',
          placeholder: '请输入证书',
          render: () => (
            <Space className="mt-5" size={10} style={{ width: '100%' }}>
              <SxyBadge bg="#5860F8" />
              <span className="font-16">其他信息</span>
            </Space>
          ),
        },
        {
          componentName: 'Input',
          name: 'i',
          label: '考试',
          placeholder: '请输入考试',
        },
        {
          componentName: 'Select',
          name: 'j',
          label: '证书目录',
          placeholder: '请选择证书目录',
          selectData: [],
          rules: [
            {
              required: true,
              message: '请选择证书目录',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'k',
          label: '考试成绩',
          placeholder: '请输入考试成绩',
        },
      ],
    })
  }, [])

  /**
   * @Description 设置批量调整表单
   * @Author bihongbin
   * @Date 2020-09-17 15:54:54
   */
  useEffect(() => {
    handleBatchAdjustmentState({
      formList: [
        {
          componentName: 'Select',
          name: 'a',
          label: '调整内容',
          placeholder: '请选择调整内容',
          colProps: { span: 24 },
          rules: [{ required: true, message: '请选择调整内容' }],
        },
        {
          componentName: 'Select',
          name: 'b',
          label: '统一调整为',
          placeholder: '请选择内容',
          colProps: { span: 24 },
          rules: [{ required: true, message: '请选择内容' }],
        },
      ],
    })
  }, [])

  /**
   * @Description 设置全局调整表单
   * @Author bihongbin
   * @Date 2020-09-17 16:15:37
   */
  useEffect(() => {
    handleGlobalAdjustmentState({
      formList: [
        {
          componentName: 'Radio',
          name: 'a',
          label: '调整内容',
          placeholder: '请选择调整内容',
          colProps: { span: 24 },
          selectData: [
            {
              label: '隔周重复',
              value: '0',
            },
          ],
          rules: [{ required: true, message: '请选择调整内容' }],
        },
        {
          componentName: 'Select',
          name: 'b',
          label: '当前年纪',
          placeholder: '请选择内容',
          colProps: { span: 24 },
          rules: [{ required: true, message: '请选择内容' }],
        },
        {
          componentName: 'Select',
          name: 'c',
          label: '全部调整为',
          placeholder: '请选择内容',
          colProps: { span: 24 },
          rules: [{ required: true, message: '请选择内容' }],
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
          <Space size={10}>
            <Button
              onClick={() =>
                console.log('批量导入暂定（不确定是否按照设计图来写）')
              }
            >
              批量导入
            </Button>
            <Button onClick={() => onBatchOperation('batch')}>批量调整</Button>
            <Button onClick={() => onBatchOperation('global')}>全局调整</Button>
            <Button>导出当前结果</Button>
            <Button onClick={onSendNotification}>发送通知公告</Button>
            <Button>批量打印二维码</Button>
          </Space>
        }
        censusTips={
          <div className="sxy-alert-box">
            当前结果：学员共计
            <Button className="is-btn-link ml-1 mr-1" type="link">
              2
            </Button>
            名，欠费共计0.00元
          </div>
        }
        cardTopButton={[
          {
            name: '新增',
            icon: 'card_add.png',
            clickConfirm: () => {
              handleModalState({
                visible: true,
                title: '新增花名册',
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
        topRender={
          <Space size={10} style={{ width: '100%' }}>
            <SxyBadge bg="#5860F8" />
            <span className="font-16">基础信息</span>
          </Space>
        }
        onCancel={() => handleModalState({ visible: false })}
        {...state.handleModal}
      />
      <LayoutFormModal
        ref={batchAdjustmentRef}
        topRender={
          <Alert
            message="如果比例为空，则使用固定规则，如果都为空则无分销佣金"
            type="warning"
            closable
          />
        }
        onCancel={() => handleBatchAdjustmentState({ visible: false })}
        {...state.batchAdjustmentModal}
      >
        <Row justify="space-between">
          <Col>
            <Text className="font-12" type="secondary">
              【年级】、【公立校】属性支持全局调整
            </Text>
          </Col>
          <Col>
            <Button className="is-btn-link font-12" type="link">
              点击查看
            </Button>
          </Col>
        </Row>
      </LayoutFormModal>
      <LayoutFormModal
        ref={globalAdjustmentRef}
        formConfig={{
          initialValues: {
            a: '0',
          },
        }}
        topRender={
          <Alert
            message="慎重操作，请先将高年级的学员调整后，再调整低年级的学员"
            type="warning"
            closable
          />
        }
        onCancel={() => handleGlobalAdjustmentState({ visible: false })}
        {...state.globalAdjustmentModal}
      />
      <NewNotificationModal
        {...state.createNotificationModal}
        onCancel={() => {
          handleCreateNotificationState({ visible: false })
        }}
      />
      <ResetPasswordModal
        onCancel={() => handleResetPasswordState({ visible: false })}
        {...state.resetPasswordModal}
      />
    </div>
  )
}

export default ClassRoster
