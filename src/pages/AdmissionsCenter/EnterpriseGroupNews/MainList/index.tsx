import React, { useRef, useReducer, useEffect } from 'react'
import { Space, Button, Row, Col, Modal } from 'antd'
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
import TableOperate, { TableOperateButtonType } from '@/components/TableOperate'
import { SxyBadge } from '@/style/module/badge'
import { AnyObjectType } from '@/typings'
import LayoutTableModal from '@/components/LayoutTableModal'
import { getBasicQtyList, handleBasicQtyList } from '@/api/basicData'

const { confirm } = Modal

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
  SET_REVIEW_MODAL = '[SetReviewModal Action]',
  SET_HANDLE_LOG_MODAL = '[SetHandleLogModal Action]',
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
    title: '新增企业团报',
    submitApi: handleBasicQtyList,
    formList: [] as LayoutFormModalListType[],
  },
  // 审核弹窗
  reviewModal: {
    visible: false,
    id: '',
    width: 420,
    title: '审核',
    submitApi: handleBasicQtyList,
    formList: [] as LayoutFormModalListType[],
  },
  handleLogModal: {
    visible: false,
    title: '操作日志',
    apiMethod: getBasicQtyList,
    width: 800,
    tableColumnsList: {
      tableConfig: {
        className: 'table-header-grey',
        scroll: { y: 500 },
      },
      list: [
        {
          title: '操作人',
          dataIndex: 'qtyEname',
        },
        {
          title: '被操作对象',
          dataIndex: 'b',
        },
        {
          title: '操作内容',
          dataIndex: 'c',
        },
        {
          title: '操作时间',
          dataIndex: 'createTime',
        },
      ],
    },
  },
}

const MainList = () => {
  const mainListTableRef = useRef<LayoutTableCallType>(null)
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const reviewFormModalRef = useRef<LayoutFormModalCallType>()
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
      case ActionType.SET_REVIEW_MODAL: // 设置审核弹窗
        return {
          ...state,
          reviewModal: {
            ...state.reviewModal,
            ...action.payload,
          },
        }
      case ActionType.SET_HANDLE_LOG_MODAL: // 设置操作日志弹窗
        return {
          ...state,
          handleLogModal: {
            ...state.handleLogModal,
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
   * @Description 审核弹窗
   * @Author bihongbin
   * @Date 2020-09-23 10:02:36
   */
  const handleReviewModalState = (data: Partial<StateType['reviewModal']>) => {
    dispatch({
      type: ActionType.SET_REVIEW_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 操作日志弹窗
   * @Author bihongbin
   * @Date 2020-09-23 10:20:53
   */
  const handleLogModalState = (data: Partial<StateType['handleLogModal']>) => {
    dispatch({
      type: ActionType.SET_HANDLE_LOG_MODAL,
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
        placeholder: '缴费方式',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'b',
        placeholder: '审核状态',
        selectData: [],
      },
      {
        componentName: 'Input',
        name: 'c',
        placeholder: '请输入报名单位',
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
      { title: '报名单位', dataIndex: 'qtyEname' },
      { title: '学员人数', dataIndex: 'qtyEname' },
      { title: '单位联系人', dataIndex: 'qtyEname' },
      { title: '联系人电话', dataIndex: 'qtyEname' },
      { title: '缴费方式', dataIndex: 'qtyEname' },
      { title: '学费总额', dataIndex: 'qtyEname' },
      {
        title: '审核状态',
        dataIndex: 'status',
        render: (value: number) => {
          if (value === 1) {
            return (
              <SxyButton mode="light-green" radius={15}>
                通过
              </SxyButton>
            )
          }
          if (value === 2) {
            return (
              <SxyButton mode="light-red" radius={15}>
                不通过
              </SxyButton>
            )
          }
        },
      },
      {
        title: '操作',
        dataIndex: 'status',
        fixed: 'right',
        width: 135,
        render: (value: number, record: AnyObjectType) => {
          const operatingData: TableOperateButtonType[] = []
          // 查看
          operatingData.push({
            name: '查看',
            type: 'lookOver',
            onClick: () => {
              handleModalState({
                visible: true,
                id: record.id,
                disable: true,
                title: '企业团报详情',
              })
            },
            svg: 'table_see.png',
          })
          // 编辑
          operatingData.push({
            name: '编辑',
            type: 'edit',
            onClick: () => {
              handleModalState({
                visible: true,
                id: record.id,
                disable: false,
                title: '编辑企业团报',
              })
            },
            svg: 'table_edit.png',
          })
          // 更多
          operatingData.push({
            name: '更多',
            type: 'more',
            svg: 'table_more.png',
            moreList: [
              {
                name: '作废',
                onClick: () => {
                  confirm({
                    title: '作废',
                    width: 360,
                    className: 'confirm-modal',
                    content: '请问是否确认废除该团报？',
                    centered: true,
                    onOk() {
                      // 这里需要使用promise
                      console.log('OK')
                    },
                  })
                },
              },
              {
                name: '审核',
                onClick: () => {
                  handleReviewModalState({ visible: true })
                },
              },
              {
                name: '操作日志',
                onClick: () => {
                  handleLogModalState({ visible: true })
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
          label: '报名单位',
          placeholder: '请输入报名单位',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'b',
          label: '学员人数',
          placeholder: '请输入学员人数',
          inputConfig: {
            inputMode: 'number',
          },
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'c',
          label: '联系电话',
          placeholder: '请输入联系电话',
          inputConfig: {
            inputMode: 'number',
          },
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'd',
          label: '缴费方式',
          placeholder: '请选择缴费方式',
          disabled: state.handleModal.disable,
          selectData: [],
        },
        {
          componentName: 'Input',
          name: 'e',
          label: '学费总额',
          placeholder: '请输入续费总额',
          inputConfig: {
            inputMode: 'number',
          },
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'i',
          label: '预缴费用',
          placeholder: '请输入预缴费用',
          inputConfig: {
            inputMode: 'number',
          },
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'j',
          label: '营销费用',
          placeholder: '请输入营销费用',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'k',
          label: '结清时间',
          colProps: { span: 24 },
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'HideInput',
          name: 'l',
          label: '合同资料上传',
          colProps: { span: 24 },
          disabled: state.handleModal.disable,
          render: () => (
            <>
              <div>
                <Button size="middle" type="primary">
                  上传
                </Button>
              </div>
              <Space className="mt-5" size={10} style={{ width: '100%' }}>
                <SxyBadge bg="#5860F8" />
                <span className="font-16">团报班级信息</span>
              </Space>
            </>
          ),
        },
        {
          componentName: 'Input',
          name: 'm',
          label: '入班人数',
          placeholder: '请输入入班人数',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'n',
          label: '班级选择',
          placeholder: '请选择班级',
          disabled: state.handleModal.disable,
          selectData: [],
        },
        {
          componentName: 'Input',
          name: 'o',
          label: '课程单价',
          inputConfig: {
            inputMode: 'number',
          },
          placeholder: '请输入课程单价',
          disabled: state.handleModal.disable,
        },
      ],
    })
  }, [state.handleModal.disable])

  /**
   * @Description 审核弹窗
   * @Author bihongbin
   * @Date 2020-09-23 10:04:02
   */
  useEffect(() => {
    handleReviewModalState({
      formList: [
        {
          componentName: 'Select',
          name: 'a',
          label: '提出比例',
          placeholder: '请选择提出比例',
          colProps: { span: 24 },
          selectData: [],
        },
        {
          componentName: 'Radio',
          name: 'b',
          label: '审核',
          colProps: { span: 24 },
          selectData: [
            { label: '通过审核', value: '0' },
            { label: '不通过审核', value: '1' },
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
        cardTopTitle={
          <Row align="middle" gutter={20}>
            <Col>企业团报</Col>
            <Col>
              <Space size={10}>
                <Button>导出</Button>
              </Space>
            </Col>
          </Row>
        }
        cardTopButton={[
          {
            name: '新增',
            icon: 'card_add.png',
            type: 'text',
            clickConfirm: () => {
              handleModalState({
                visible: true,
                disable: false,
                id: '',
                title: '新增企业团报',
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
        ref={reviewFormModalRef}
        formConfig={{
          initialValues: {
            b: '0',
          },
        }}
        onCancel={() => handleReviewModalState({ visible: false })}
        {...state.reviewModal}
      />
      <LayoutTableModal
        {...state.handleLogModal}
        onCancel={() => handleLogModalState({ visible: false })}
        onConfirm={(data) => {
          return Promise.resolve(true)
        }}
      />
    </div>
  )
}

export default MainList
