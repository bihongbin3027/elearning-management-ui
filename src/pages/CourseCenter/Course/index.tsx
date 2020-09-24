import React, { useReducer, useRef, useEffect } from 'react'
import {
  Card,
  Row,
  Col,
  Divider,
  Select,
  Input,
  Space,
  Button,
  Switch,
} from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { SxyButton, SxyButtonIconGroup } from '@/style/module/button'
import { SxyIcon } from '@/style/module/icon'
import GenerateTable, { TableCallType } from '@/components/GenerateTable'
import LayoutFormModal, {
  LayoutFormModalCallType,
  LayoutFormModalListType,
} from '@/components/LayoutFormModal'
import TableOperate from '@/components/TableOperate'
import { handleRowDelete } from '@/utils'
import {
  getBasicQtyList,
  handleBasicQtyList,
  deleteBasicQtyList,
} from '@/api/basicData'

const { Option } = Select

type ReducerType = (state: StateType, action: Action) => StateType
interface Action {
  type: ActionType
  payload: any
}
type StateType = typeof stateValue

enum ActionType {
  SET_TABLE_COLUMNS = '[SetTableColumns Action]',
  SET_HANDLE_MODAL = '[SetHandleModal Action]',
}

const stateValue = {
  // 所属校区
  campusData: {
    value: '-1',
    list: [
      {
        label: '所属校区',
        value: '-1',
      },
      {
        label: '校区一',
        value: '0',
      },
    ],
  },
  // 课程类型
  courseTypeData: {
    value: '-1',
    list: [
      {
        label: '课程类型',
        value: '-1',
      },
      {
        label: '类型一',
        value: '0',
      },
    ],
  },
  // 课程分类
  courseClassData: {
    value: '-1',
    list: [
      {
        label: '课程分类',
        value: '-1',
      },
      {
        label: '分类一',
        value: '0',
      },
    ],
  },
  // 推荐状态
  recommendationStatusData: {
    value: '-1',
    list: [
      {
        label: '推荐状态',
        value: '-1',
      },
      {
        label: '状态一',
        value: '0',
      },
    ],
  },
  // 科目
  subjectData: {
    value: '-1',
    list: [
      {
        label: '科目',
        value: '-1',
      },
      {
        label: '科目一',
        value: '0',
      },
    ],
  },
  tableColumns: [], // 表格头
  // 新增编辑查看弹窗
  handleModal: {
    visible: false,
    disable: false,
    id: '',
    title: '',
    submitApi: handleBasicQtyList,
    formList: [] as LayoutFormModalListType[],
  },
}

const CourseMainList = () => {
  const tableRef = useRef<TableCallType>(null)
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_TABLE_COLUMNS: // 设置表格头
        return {
          ...state,
          tableColumns: action.payload,
        }
      case ActionType.SET_HANDLE_MODAL: // 设置新增编辑查看弹窗数据
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
   * @Description 渲染下拉菜单
   * @Author bihongbin
   * @Date 2020-08-19 18:13:45
   */
  const renderOption = (data: StateType['campusData']) => {
    return (
      <Select defaultValue={data.value} bordered={false}>
        {data.list.map((item, index) => (
          <Option value={item.value} key={index}>
            {item.label}
          </Option>
        ))}
      </Select>
    )
  }

  /**
   * @Description 设置新增编辑查看弹窗数据
   * @Author bihongbin
   * @Date 2020-08-07 15:36:34
   */
  const handleModalState = (data: Partial<StateType['handleModal']>) => {
    dispatch({
      type: ActionType.SET_HANDLE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 查询
   * @Author bihongbin
   * @Date 2020-08-20 11:05:21
   */
  const formSubmit = () => {
    if (tableRef.current) {
      tableRef.current.getTableList()
    }
  }

  /**
   * @Description 搜索
   * @Author bihongbin
   * @Date 2020-08-19 18:50:49
   */
  const onSearchText = (e: any) => {
    e.persist()
    console.log(e.target.value)
  }

  /**
   * @Description 修改课程状态
   * @Author bihongbin
   * @Date 2020-08-20 11:02:30
   */
  const handleCourseStatus = (data: number) => {
    console.log('课程状态', data)
  }

  /**
   * @Description 设置表格头数据
   * @Author bihongbin
   * @Date 2020-08-20 10:07:49
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_TABLE_COLUMNS,
      payload: [
        { title: '课程名称', dataIndex: 'qtyCname' },
        { title: '课程类型', dataIndex: 'costCategory' },
        { title: '授课分类', dataIndex: 'dataStep' },
        { title: '推荐状态', dataIndex: 'sourceType' },
        { title: '开课校区', dataIndex: 'startTime' },
        {
          title: '课程状态',
          dataIndex: 'status',
          render: (value: number, record: any) => {
            return (
              <Switch
                defaultChecked
                checkedChildren="开售"
                unCheckedChildren="停售"
                onChange={() => handleCourseStatus(value)}
              />
            )
          },
        },
        { title: '创建日期', dataIndex: 'createTime' },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 135,
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
                  title: '课程详情',
                })
              },
              svg: 'table_see.png',
            })
            // 编辑
            operatingData.push({
              name: '编辑',
              onClick: () => {
                handleModalState({
                  visible: true,
                  disable: false,
                  id: record.id,
                  title: '编辑课程',
                })
              },
              svg: 'table_edit.png',
            })
            // 删除
            operatingData.push({
              name: '删除',
              onClick: () => {
                if (tableRef.current) {
                  handleRowDelete(
                    [record.id],
                    deleteBasicQtyList,
                    tableRef.current.getTableList,
                  )
                }
              },
              svg: 'table_delete.png',
            })
            return <TableOperate operateButton={operatingData} />
          },
        },
      ],
    })
  }, [])

  /**
   * @Description 设置新增编辑查看弹窗默认表单字段
   * @Author bihongbin
   * @Date 2020-08-07 15:44:58
   */
  useEffect(() => {
    handleModalState({
      formList: [
        {
          componentName: 'Input',
          name: 'a1',
          label: '课程名称',
          placeholder: '请输入课程名称',
          rules: [
            {
              required: true,
              message: '请输入课程名称',
            },
          ],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'a2',
          label: '课程类型',
          placeholder: '请选择课程类型',
          rules: [
            {
              required: true,
              message: '请选择课程类型',
            },
          ],
          selectData: [],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'RemoteSearch',
          name: 'a3',
          label: '课程科目',
          placeholder: '请输入课程科目',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'a4',
          label: '课程分类',
          placeholder: '请选择课程分类',
          selectData: [],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'a5',
          label: '课程代码',
          placeholder: '请输入课程代码',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'a6',
          label: '班主任',
          placeholder: '请选择班主任',
          selectData: [],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'a7',
          label: '报名表单',
          placeholder: '请选择报名表单',
          selectData: [],
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'TextArea',
          name: 'a8',
          label: '课程副标题',
          rows: 3,
          colProps: { span: 24 },
          placeholder: '请输入课程副标题',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'TextArea',
          name: 'a9',
          label: '课程摘要',
          rows: 3,
          colProps: { span: 24 },
          placeholder: '请输入课程摘要',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'TextArea',
          name: 'a10',
          label: '课程目标',
          rows: 3,
          colProps: { span: 24 },
          placeholder: '请输入课程目标',
          disabled: state.handleModal.disable,
        },
        {
          componentName: 'TextArea',
          name: 'a11',
          label: '适合人群',
          rows: 3,
          colProps: { span: 24 },
          placeholder: '请输入适合人群',
          disabled: state.handleModal.disable,
        },
      ],
    })
  }, [state.handleModal.disable])

  /**
   * @Description 初始化
   * @Author bihongbin
   * @Date 2020-08-20 11:05:59
   */
  useEffect(() => {
    formSubmit()
  }, [])

  return (
    <>
      <Card className="card-body-small">
        <Row justify="space-between">
          <Col>
            <Row align="middle">
              {renderOption(state.campusData)}
              <span className="ml-2 mr-2">
                <Divider type="vertical" />
              </span>
              {renderOption(state.courseTypeData)}
              <span className="ml-2 mr-2">
                <Divider type="vertical" />
              </span>
              {renderOption(state.courseClassData)}
              <span className="ml-2 mr-2">
                <Divider type="vertical" />
              </span>
              {renderOption(state.recommendationStatusData)}
              <span className="ml-2 mr-2">
                <Divider type="vertical" />
              </span>
              {renderOption(state.subjectData)}
            </Row>
          </Col>
          <Col>
            <Space size={20}>
              <div className="ant-form form-ash-theme">
                <div className="ant-form-item-control">
                  <Input
                    className="search-input"
                    placeholder="请输入课程名称/课程代码"
                    prefix={<SearchOutlined />}
                    onPressEnter={(e) => onSearchText(e)}
                  />
                </div>
              </div>
              <SxyButtonIconGroup>
                <SxyButton title="刷新" onClick={formSubmit}>
                  <SxyIcon
                    width={12}
                    height={12}
                    name="search_form_reset.png"
                  />
                </SxyButton>
                <SxyButton title="筛选">
                  <SxyIcon
                    width={12}
                    height={12}
                    name="search_form_screen.png"
                  />
                </SxyButton>
              </SxyButtonIconGroup>
            </Space>
          </Col>
        </Row>
      </Card>
      <Card
        className="table-card mt-4"
        title={
          <Space size={10}>
            <Button type="primary">批量推荐</Button>
            <Button>批量开启</Button>
            <Button>批量关闭</Button>
            <Button>批量删除</Button>
          </Space>
        }
        extra={
          <Button
            className="btn-text-icon"
            type="text"
            onClick={() => {
              handleModalState({
                visible: true,
                disable: false,
                id: '',
                title: '新增课程',
              })
            }}
          >
            <SxyIcon width={16} height={16} name="card_add.png" />
            新增
          </Button>
        }
      >
        <div className="sxy-alert-box">
          当前结果：总计
          <Button className="is-btn-link ml-1 mr-1" type="link">
            70
          </Button>
          个课程
          <Button className="is-btn-link ml-1 mr-1" type="link">
            29
          </Button>
          个课程正在开班/课
        </div>
        <GenerateTable
          ref={tableRef}
          rowType="checkbox"
          apiMethod={getBasicQtyList}
          columns={state.tableColumns}
          scroll={{ x: 1300, y: 500 }}
          tableConfig={{
            expandable: {
              expandedRowRender: (record) => (
                <div style={{ marginLeft: 106 }}>{record.qtyCname}</div>
              ),
              expandIcon: ({ expanded, onExpand, record }) => {
                let iconName = expanded
                  ? 'table_tree_open2.png'
                  : 'table_tree_shut2.png'
                return (
                  <SxyIcon
                    width={12}
                    height={12}
                    name={iconName}
                    className="pointer"
                    onClick={(e) => onExpand(record, e)}
                  />
                )
              },
            },
          }}
        />
      </Card>
      <LayoutFormModal
        ref={layoutFormModalRef}
        onCancel={() => handleModalState({ visible: false })}
        {...state.handleModal}
      />
    </>
  )
}

export default CourseMainList
