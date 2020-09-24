import React, { useRef, useReducer, useEffect } from 'react'
import { Space, Button, Avatar, Tabs } from 'antd'
import { ColumnType } from 'antd/es/table'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import LayoutFormModal, {
  LayoutFormModalCallType,
  LayoutFormModalListType,
} from '@/components/LayoutFormModal'
import GenerateTable from '@/components/GenerateTable'
import { SxyButton } from '@/style/module/button'
import { AnyObjectType } from '@/typings'
import TableOperate from '@/components/TableOperate'
import { handleRowDelete } from '@/utils'
import { SxyBadge } from '@/style/module/badge'
import {
  getBasicQtyList,
  handleBasicQtyList,
  deleteBasicQtyList,
} from '@/api/basicData'

const { TabPane } = Tabs

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
    width: 600,
    id: '',
    title: '新生报名',
    type: '',
    submitApi: handleBasicQtyList,
    formList: [] as LayoutFormModalListType[],
    courseRecordColumns: [] as ColumnType<AnyObjectType>[], // 课程记录表头
    curriculumOrderColumns: [] as ColumnType<AnyObjectType>[], // 订单记录-课程订单表头
    commodityOrderColumns: [] as ColumnType<AnyObjectType>[], // 订单记录-商品订单表头
    signSearchList: [] as FormListCallType[], // 签到记录搜索表单
    signColumns: [] as ColumnType<AnyObjectType>[], // 签到记录表格头
  },
}

const EnrolledStudents = () => {
  const mainListTableRef = useRef<LayoutTableCallType>(null)
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const courseRecordRef = useRef<LayoutTableCallType>(null)
  const curriculumOrderRef = useRef<LayoutTableCallType>(null)
  const commodityOrderRef = useRef<LayoutTableCallType>(null)
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
        placeholder: '就读班级',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'b',
        placeholder: '报名状态',
        selectData: [],
      },
      {
        componentName: 'Select',
        name: 'c',
        placeholder: '学员状态',
        selectData: [],
      },
      {
        componentName: 'Input',
        name: 'd',
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
                width: 1000,
                type: 'edit',
                title: '编辑在读学生',
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
                name: '休学',
                onClick: () => {},
              },
              {
                name: '停课',
                onClick: () => {},
              },
              {
                name: '请假',
                onClick: () => {},
              },
              {
                name: '结课',
                onClick: () => {},
              },
              {
                name: '退学',
                onClick: () => {},
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
          componentName: 'HideInput',
          name: 'a',
          label: '头像',
          placeholder: '请上传头像',
          colProps: { span: 24 },
          rules: [
            {
              required: true,
              message: '请上传头像',
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
          name: 'b',
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
          name: 'c',
          label: '手机号',
          placeholder: '请输入手机号',
        },
        {
          componentName: 'Input',
          name: 'd',
          label: '就读班级',
          placeholder: '请输入就读班级',
        },
        {
          componentName: 'Select',
          name: 'e',
          label: '单位',
          placeholder: '请输入单位',
          selectData: [],
          rules: [
            {
              required: true,
              message: '请输入单位',
            },
          ],
        },
        {
          componentName: 'Select',
          name: 'f',
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
          name: 'g',
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
          name: 'g1',
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
      // 课程记录表头
      courseRecordColumns: [
        { title: '课程名称/组合包名称', dataIndex: 'qtyEname' },
        { title: '总课时', dataIndex: 'qtyEname' },
        { title: '报名前已上', dataIndex: 'qtyEname' },
        { title: '报名后已上', dataIndex: 'qtyEname' },
        { title: '剩余', dataIndex: 'qtyEname' },
        { title: '截至时间', dataIndex: 'qtyEname' },
        { title: '请假限制次数/限制次数', dataIndex: 'qtyEname' },
      ],
      // 订单记录-课程订单表头
      curriculumOrderColumns: [
        { title: '订单编号', dataIndex: 'qtyEname' },
        { title: '课程名称', dataIndex: 'qtyEname' },
        { title: '老师', dataIndex: 'qtyEname' },
        { title: '金额', dataIndex: 'qtyEname' },
        { title: '优惠', dataIndex: 'qtyEname' },
        { title: '签单金额', dataIndex: 'qtyEname' },
        { title: '实收', dataIndex: 'qtyEname' },
        { title: '尾款', dataIndex: 'qtyEname' },
        { title: '订单状态', dataIndex: 'qtyEname' },
        { title: '交易时间', dataIndex: 'qtyEname' },
      ],
      // 订单记录-商品订单表头
      commodityOrderColumns: [
        { title: '订单编号', dataIndex: 'qtyEname' },
        { title: '商品名称', dataIndex: 'qtyEname' },
        { title: '单价', dataIndex: 'qtyEname' },
        { title: '数量', dataIndex: 'qtyEname' },
        { title: '优惠', dataIndex: 'qtyEname' },
        { title: '签单金额', dataIndex: 'qtyEname' },
        { title: '实收', dataIndex: 'qtyEname' },
        { title: '尾款', dataIndex: 'qtyEname' },
        { title: '订单状态', dataIndex: 'qtyEname' },
        { title: '交易时间', dataIndex: 'qtyEname' },
      ],
      // 签到记录搜索表单
      signSearchList: [
        {
          componentName: 'Select',
          name: 'a',
          placeholder: '课程类型',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'b',
          placeholder: '签到方式',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'c',
          placeholder: '签到类型',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'd',
          placeholder: '签到状态',
          selectData: [],
        },
      ],
      // 签到记录表头
      signColumns: [
        { title: '课程名称', dataIndex: 'qtyEname' },
        { title: '老师', dataIndex: 'qtyEname' },
        { title: '上课时间', dataIndex: 'qtyEname' },
        { title: '签到状态', dataIndex: 'qtyEname' },
        { title: '签到时间', dataIndex: 'qtyEname' },
        { title: '签到方式', dataIndex: 'qtyEname' },
        { title: '签到类型', dataIndex: 'qtyEname' },
        { title: '消耗金额', dataIndex: 'qtyEname' },
        { title: '备注', dataIndex: 'qtyEname' },
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
            <Button>导入</Button>
            <Button>导出</Button>
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
            name: '新生报名',
            icon: 'card_add.png',
            clickConfirm: () => {
              handleModalState({
                visible: true,
                width: 600,
                type: 'add',
                title: '新生报名',
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
      >
        {state.handleModal.type !== 'add' ? (
          <>
            <Space className="mt-5" size={10} style={{ width: '100%' }}>
              <SxyBadge bg="#5860F8" />
              <span className="font-16">记录</span>
            </Space>
            <Tabs>
              <TabPane tab="课程记录" key="1">
                <GenerateTable
                  ref={courseRecordRef}
                  apiMethod={getBasicQtyList}
                  columns={state.handleModal.courseRecordColumns}
                  tableConfig={{
                    className: 'table-header-grey',
                    scroll: { x: 1000 },
                    pagination: false,
                  }}
                />
              </TabPane>
              <TabPane tab="订单记录" key="2">
                <div className="mb-5">
                  <div className="font-16 mb-2">课程订单</div>
                  <GenerateTable
                    ref={curriculumOrderRef}
                    apiMethod={getBasicQtyList}
                    columns={state.handleModal.curriculumOrderColumns}
                    tableConfig={{
                      className: 'table-header-grey',
                      scroll: { x: 1000 },
                      pagination: false,
                    }}
                  />
                </div>
                <div className="mb-5">
                  <div className="font-16 mb-2">商品订单</div>
                  <GenerateTable
                    ref={commodityOrderRef}
                    apiMethod={getBasicQtyList}
                    columns={state.handleModal.commodityOrderColumns}
                    tableConfig={{
                      className: 'table-header-grey',
                      scroll: { x: 1000 },
                      pagination: false,
                    }}
                  />
                </div>
              </TabPane>
              <TabPane tab="签到记录" key="3">
                <LayoutTableList
                  api={getBasicQtyList}
                  searchClassName
                  searchFormList={state.handleModal.signSearchList}
                  autoGetList
                  searchRightBtnOpen={false}
                  censusTips={
                    <div className="sxy-alert-box">
                      当前结果：
                      <Button className="is-btn-link ml-1 mr-1" type="link">
                        23
                      </Button>
                      条<span className="ml-5">消费总金额：</span>
                      <Button className="is-btn-link ml-1 mr-1" type="link">
                        2344
                      </Button>
                      元
                    </div>
                  }
                  tableColumnsList={{
                    list: state.handleModal.signColumns,
                    tableConfig: {
                      scroll: { x: 1200 },
                    },
                  }}
                />
              </TabPane>
              <TabPane tab="沟通记录" key="4">
                4
              </TabPane>
              <TabPane tab="上课记录" key="5">
                5
              </TabPane>
              <TabPane tab="未上课记录" key="6">
                6
              </TabPane>
              <TabPane tab="操作日志" key="7">
                7
              </TabPane>
            </Tabs>
          </>
        ) : null}
      </LayoutFormModal>
    </div>
  )
}

export default EnrolledStudents
