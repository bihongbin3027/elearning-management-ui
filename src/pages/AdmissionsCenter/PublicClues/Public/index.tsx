import React, { useRef, useReducer, useEffect } from 'react'
import { Space, Button, message } from 'antd'
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
import { SxyIcon } from '@/style/module/icon'
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
  SET_COMMUNICATION_MODAL = '[SetCommunicationModal Action]',
  SET_BATCH_EDITING_MODAL = '[SetBatchEditingModal Action]',
  SET_SEND_GROUP_MSG_MODAL = '[SetSendGroupMsgModal Action]',
}

const stateValue = {
  searchFormList: [] as FormListCallType[], // 头部搜索数据
  tableColumns: [] as ColumnType<AnyObjectType>[], // 表格头,
  // 新增编辑弹窗
  handleModal: {
    visible: false,
    id: '',
    disable: false,
    width: 650,
    title: '新建线索',
    submitApi: handleBasicQtyList,
    formList: [] as LayoutFormModalListType[],
  },
  // 新增沟通弹窗
  communicationModal: {
    visible: false,
    id: '',
    width: 420,
    title: '新增沟通',
    submitApi: handleBasicQtyList,
    formList: [] as LayoutFormModalListType[],
  },
  // 批量编辑弹窗
  batchEditingModal: {
    visible: false,
    width: 420,
    title: '批量编辑',
    submitApi: handleBasicQtyList,
    formList: [] as LayoutFormModalListType[],
  },
  // 群发短信
  sendGroupMsgModal: {
    visible: false,
    width: 420,
    title: '群发短信',
    submitApi: handleBasicQtyList,
    formList: [] as LayoutFormModalListType[],
  },
}

const PublicClues = () => {
  const mainListTableRef = useRef<LayoutTableCallType>(null)
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const communicationFormModalRef = useRef<LayoutFormModalCallType>()
  const batchEditFormModalRef = useRef<LayoutFormModalCallType>()
  const sendGroupMsgFormModalRef = useRef<LayoutFormModalCallType>()
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
      case ActionType.SET_COMMUNICATION_MODAL: // 设置新增沟通弹窗
        return {
          ...state,
          communicationModal: {
            ...state.communicationModal,
            ...action.payload,
          },
        }
      case ActionType.SET_BATCH_EDITING_MODAL: // 设置批量编辑弹窗
        return {
          ...state,
          batchEditingModal: {
            ...state.batchEditingModal,
            ...action.payload,
          },
        }
      case ActionType.SET_SEND_GROUP_MSG_MODAL: // 设置群发短信弹窗
        return {
          ...state,
          sendGroupMsgModal: {
            ...state.sendGroupMsgModal,
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
   * @Description 新增沟通弹窗
   * @Author bihongbin
   * @Date 2020-09-19 11:44:50
   */
  const handleCommunicationModalState = (
    data: Partial<StateType['communicationModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_COMMUNICATION_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置批量编辑弹窗
   * @Author bihongbin
   * @Date 2020-09-19 16:04:46
   */
  const handleBatchEditModalState = (
    data: Partial<StateType['batchEditingModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_BATCH_EDITING_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置群发短信弹窗
   * @Author bihongbin
   * @Date 2020-09-19 16:04:46
   */
  const handleSendGroupMsgModalState = (
    data: Partial<StateType['sendGroupMsgModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_SEND_GROUP_MSG_MODAL,
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
   * @Description 批量操作
   * @Author bihongbin
   * @Date 2020-09-19 16:08:55
   */
  const handleBatch = (type: 'delete' | 'edit' | 'sendMsg' | 'allocation') => {
    if (mainListTableRef.current) {
      const ids = mainListTableRef.current.getSelectIds()
      if (!ids.length) {
        message.warn('请选择数据', 1.5)
        return
      }
      // 批量删除
      if (type === 'delete') {
        handleRowDelete(
          ids,
          deleteBasicQtyList,
          mainListTableRef.current.getTableList,
        )
      }
      // 批量编辑
      if (type === 'edit') {
        handleBatchEditModalState({ visible: true })
      }
      // 群发短信
      if (type === 'sendMsg') {
        handleSendGroupMsgModalState({ visible: true })
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
        componentName: 'Select',
        name: 'a',
        placeholder: '状态',
        selectData: [],
      },
      {
        componentName: 'Input',
        name: 'b',
        placeholder: '请输入姓名',
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
      {
        title: '星标',
        dataIndex: 'qtyEname',
        width: 100,
        render: () => {
          // <SxyIcon className="pointer" name="star_default.png" width={16} height={16} />
          return (
            <SxyIcon
              className="pointer"
              name="star_selected.png"
              width={16}
              height={16}
            />
          )
        },
      },
      { title: '姓名', dataIndex: 'qtyEname' },
      { title: '联系电话', dataIndex: 'qtyEname' },
      { title: '家长姓名', dataIndex: 'qtyEname' },
      { title: '意向课程', dataIndex: 'qtyEname' },
      {
        title: '沟通记录',
        dataIndex: 'id',
        render: (value) => {
          return (
            <SxyIcon
              className="pointer"
              name="form_add.png"
              width={16}
              height={16}
              onClick={() => {
                handleCommunicationModalState({ visible: true, id: value })
              }}
            />
          )
        },
      },
      { title: '标签', dataIndex: 'qtyEname' },
      {
        title: '跟进状态',
        dataIndex: 'qtyEname',
        render: () => {
          return (
            <SxyButton mode="light-blue" radius={15}>
              跟进中
            </SxyButton>
            // <SxyButton mode="pale-yellow" radius={15}>
            //   待跟进
            // </SxyButton>
          )
        },
      },
      { title: '就读班级', dataIndex: 'qtyEname' },
      {
        title: '操作',
        dataIndex: 'status',
        fixed: 'right',
        width: 90,
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
                title: '线索详情',
              })
            },
            svg: 'table_see.png',
          })
          // 更多
          operatingData.push({
            name: '更多',
            type: 'more',
            svg: 'table_more.png',
            moreList: [
              {
                name: '分配',
                onClick: () => {},
              },
              {
                name: '移除',
                onClick: () => {
                  handleRowDelete([record.id], deleteBasicQtyList, () =>
                    mainListTableRef.current?.getTableList(),
                  )
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
              <span className="font-16">跟进信息</span>
            </Space>
          ),
        },
        {
          componentName: 'Input',
          name: 'e',
          label: '家长姓名',
          placeholder: '请输入家长姓名',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Radio',
          name: 'i',
          label: '考试',
          placeholder: '请选择沟通方式',
          colProps: { span: 24 },
          disabled: state.handleModal.disable,
          selectData: [
            { label: '来电', value: '0' },
            { label: '来访', value: '1' },
            { label: '网络', value: '2' },
            { label: '其他', value: '3' },
          ],
        },
        {
          componentName: 'Select',
          name: 'j',
          label: '意向度',
          placeholder: '请选择意向度',
          disabled: state.handleModal.disable,
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'k',
          label: '意向课程',
          placeholder: '请选择意向课程',
          disabled: state.handleModal.disable,
          selectData: [],
        },
        {
          componentName: 'TextArea',
          name: 'l',
          label: '沟通内容',
          placeholder: '最多可以输入300个字',
          rows: 3,
          colProps: { span: 24 },
          disabled: state.handleModal.disable,
          rules: [
            { required: false, max: 300, message: '最多可以输入300个字' },
          ],
          render: () => (
            <Space className="mt-5" size={10} style={{ width: '100%' }}>
              <SxyBadge bg="#5860F8" />
              <span className="font-16">经办信息</span>
            </Space>
          ),
        },
        {
          componentName: 'Select',
          name: 'm',
          label: '咨询校区',
          placeholder: '请选择咨询校区',
          disabled: state.handleModal.disable,
          selectData: [],
        },
        {
          componentName: 'DatePicker',
          name: 'n',
          label: '录入时间',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'o',
          label: '线索来源',
          placeholder: '请选择线索来源',
          disabled: state.handleModal.disable,
          selectData: [],
        },
        {
          componentName: 'Input',
          name: 'p',
          label: '采单员',
          placeholder: '请输入采单员',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'q',
          label: '电话销售',
          placeholder: '请选择电话销售',
          disabled: state.handleModal.disable,
          selectData: [],
        },
        {
          componentName: 'Input',
          name: 'r',
          label: '前台',
          placeholder: '请输入前台',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 's',
          label: '销售员',
          placeholder: '请选择销售员',
          disabled: state.handleModal.disable,
          selectData: [],
        },
        {
          componentName: 'Input',
          name: 't',
          label: '副销售员',
          placeholder: '请输入副销售员',
          disabled: state.handleModal.disable,
        },
      ],
    })
  }, [state.handleModal.disable])

  /**
   * @Description 沟通弹窗表单
   * @Author bihongbin
   * @Date 2020-09-19 14:01:26
   */
  useEffect(() => {
    handleCommunicationModalState({
      formList: [
        {
          componentName: 'Input',
          name: 'a',
          label: '学员姓名',
          placeholder: '请输入学员姓名',
          colProps: { span: 24 },
        },
        {
          componentName: 'Union',
          label: '联系电话',
          colProps: { span: 24 },
          unionConfig: {
            unionItems: [
              {
                componentName: 'Select',
                name: 'e2',
                placeholder: '请选择关系',
                selectData: [{ label: '父母', value: '0' }],
              },
              {
                componentName: 'Input',
                name: 'e1',
                placeholder: '请输入联系电话',
              },
            ],
          },
        },
        {
          componentName: 'DatePicker',
          name: 'c',
          label: '沟通日期',
          colProps: { span: 24 },
        },
        {
          componentName: 'Select',
          name: 'd',
          label: '沟通校区',
          colProps: { span: 24 },
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'e',
          label: '沟通类型',
          colProps: { span: 24 },
          selectData: [],
        },
        {
          componentName: 'DatePicker',
          name: 'f',
          label: '回访提醒',
          colProps: { span: 24 },
        },
        {
          componentName: 'TextArea',
          name: 'g',
          label: '沟通内容',
          rows: 3,
          colProps: { span: 24 },
        },
        {
          componentName: 'Input',
          name: 'h',
          label: '沟通结果',
          placeholder: '请输入沟通结果',
          colProps: { span: 24 },
        },
      ],
    })
  }, [])

  /**
   * @Description 设置批量编辑表单
   * @Author bihongbin
   * @Date 2020-09-19 16:06:19
   */
  useEffect(() => {
    handleBatchEditModalState({
      formList: [
        {
          componentName: 'Select',
          name: 'a',
          label: '需要修改的内容',
          placeholder: '请选择需要修改的内容',
          colProps: { span: 24 },
          rules: [{ required: true, message: '请选择需要修改的内容' }],
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'b',
          label: '修改为',
          placeholder: '请选择',
          colProps: { span: 24 },
          selectData: [],
        },
      ],
    })
  }, [])

  /**
   * @Description 设置群发短信弹窗
   * @Author bihongbin
   * @Date 2020-09-19 16:28:12
   */
  useEffect(() => {
    handleSendGroupMsgModalState({
      formList: [
        {
          componentName: 'TextArea',
          name: 'a',
          label: '群发短信',
          placeholder: '请输入电话号码，以，隔开',
          rows: 3,
          colProps: { span: 24 },
          rules: [{ required: true, message: '请输入电话号码，以，隔开' }],
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
            <Button onClick={() => handleBatch('delete')}>批量删除</Button>
            <Button onClick={() => handleBatch('edit')}>批量编辑</Button>
            <Button onClick={() => handleBatch('sendMsg')}>群发短信</Button>
            <Button>导入</Button>
            <Button>导出</Button>
          </Space>
        }
        censusTips={
          <div className="sxy-alert-box">
            当前结果：线索共计
            <Button className="is-btn-link ml-1 mr-1" type="link">
              2
            </Button>
            条
          </div>
        }
        cardTopButton={[
          {
            name: '新建',
            icon: 'card_add.png',
            clickConfirm: () => {
              handleModalState({
                visible: true,
                title: '新建线索',
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
        formConfig={{
          initialValues: {
            c: '0',
            i: '0',
          },
        }}
        onCancel={() => handleModalState({ visible: false })}
        {...state.handleModal}
      />
      <LayoutFormModal
        ref={communicationFormModalRef}
        onCancel={() => handleCommunicationModalState({ visible: false })}
        {...state.communicationModal}
      />
      <LayoutFormModal
        ref={batchEditFormModalRef}
        onCancel={() => handleBatchEditModalState({ visible: false })}
        {...state.batchEditingModal}
      />
      <LayoutFormModal
        ref={sendGroupMsgFormModalRef}
        onCancel={() => handleSendGroupMsgModalState({ visible: false })}
        {...state.sendGroupMsgModal}
      />
    </div>
  )
}

export default PublicClues
