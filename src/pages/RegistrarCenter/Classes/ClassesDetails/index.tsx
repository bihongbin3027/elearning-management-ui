import React, { useReducer, useEffect, useRef } from 'react'
import {
  Card,
  Select,
  Button,
  Space,
  Divider,
  Row,
  Col,
  Typography,
  Tabs,
  Input,
  Dropdown,
  Menu,
} from 'antd'
import { SearchOutlined, DownOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/es/table'
import GenerateForm, {
  FormCallType,
  FormListType,
} from '@/components/GenerateForm'
import GenerateTable, { TableCallType } from '@/components/GenerateTable'
import TableOperate, { TableOperateButtonType } from '@/components/TableOperate'
import { handleRowDelete } from '@/utils'
import { AnyObjectType } from '@/typings'
import { SxyButton } from '@/style/module/button'
import { getBasicQtyList, deleteBasicQtyList } from '@/api/basicData'

const { Option } = Select
const { Text } = Typography
const { TabPane } = Tabs

type ReducerType = (state: StateType, action: Action) => StateType
interface Action {
  type: ActionType
  payload: any
}
type StateType = typeof stateValue

enum ActionType {
  SET_CLASS_DETAILS_FORM_LIST = '[SetClassDetailsFormList Action]',
  SET_STUDENT_TABLE_COLUMNS = '[SetStudentTableColumns Action]',
}

const stateValue = {
  classDetailsFormList: [] as FormListType[], // 班级详情表单
  studentTableColumns: [] as ColumnType<AnyObjectType>[], // 学员列表表格头
}

const ClassesDetails = () => {
  const classDetailsFormRef = useRef<FormCallType>(null)
  const studentTableRef = useRef<TableCallType>(null)
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_CLASS_DETAILS_FORM_LIST: // 班级详情表单
        return {
          ...state,
          classDetailsFormList: action.payload,
        }
      case ActionType.SET_STUDENT_TABLE_COLUMNS: // 学员列表表格头
        return {
          ...state,
          studentTableColumns: action.payload,
        }
    }
  }, stateValue)

  /**
   * @Description 设置班级详情表单数据
   * @Author bihongbin
   * @Date 2020-09-07 17:48:00
   */
  const handleClassDetailsFormState = (
    data: StateType['classDetailsFormList'],
  ) => {
    dispatch({
      type: ActionType.SET_CLASS_DETAILS_FORM_LIST,
      payload: data,
    })
  }

  /**
   * @Description 设置学员表格头数据
   * @Author bihongbin
   * @Date 2020-09-08 15:21:50
   */
  const handleStudentColumnsState = (
    data: StateType['studentTableColumns'],
  ) => {
    dispatch({
      type: ActionType.SET_STUDENT_TABLE_COLUMNS,
      payload: data,
    })
  }

  /**
   * @Description 搜索
   * @Author bihongbin
   * @Date 2020-09-08 10:05:10
   */
  const onSearchText = (e: any) => {
    e.persist()
    console.log(e.target.value)
  }

  /**
   * @Description
   * @Author bihongbin
   * @Date 2020-09-07 17:50:31
   */
  useEffect(() => {
    handleClassDetailsFormState([
      {
        componentName: 'Input',
        name: 'a',
        label: '所属课程',
      },
      {
        componentName: 'Input',
        name: 'b',
        label: '收费标准',
      },
      {
        componentName: 'Input',
        name: 'c',
        label: '上课校区',
      },
      {
        componentName: 'Input',
        name: 'd',
        label: '开班日期',
      },
      {
        componentName: 'Input',
        name: 'e',
        label: '结班日期',
      },
      {
        componentName: 'Input',
        name: 'f',
        label: '班级人数',
      },
      {
        componentName: 'Input',
        name: 'g',
        label: '教师',
      },
      {
        componentName: 'Input',
        name: 'h',
        label: '助教',
      },
      {
        componentName: 'Input',
        name: 'i',
        label: '教师',
      },
      {
        componentName: 'Input',
        name: 'j',
        label: '开班日期',
      },
      {
        componentName: 'Input',
        name: 'k',
        label: '备注',
      },
    ])
  }, [])

  /**
   * @Description 设置教育学员表格头数据
   * @Author bihongbin
   * @Date 2020-09-08 15:22:18
   */
  useEffect(() => {
    handleStudentColumnsState([
      { title: '学员姓名', dataIndex: 'qtyCname' },
      { title: '性别', dataIndex: 'costCategory' },
      { title: '关系', dataIndex: 'dataStep' },
      { title: '联系方式', dataIndex: 'sourceType' },
      { title: '已用数量', dataIndex: 'sourceType' },
      { title: '剩余数量', dataIndex: 'sourceType' },
      { title: '客户来源', dataIndex: 'sourceType' },
      { title: '上课时间', dataIndex: 'createTime' },
      {
        title: '操作',
        dataIndex: 'status',
        fixed: 'right',
        width: 90,
        render: (value: number, record: any) => {
          const operatingData: TableOperateButtonType[] = []
          // 删除
          operatingData.push({
            name: '删除',
            type: 'delete',
            onClick: () => {
              if (studentTableRef.current) {
                handleRowDelete(
                  [record.id],
                  deleteBasicQtyList,
                  studentTableRef.current.getTableList,
                )
              }
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
                name: '更多1',
                onClick: () => {},
              },
            ],
          })
          return <TableOperate operateButton={operatingData} />
        },
      },
    ])
  }, [])

  useEffect(() => {
    studentTableRef.current?.getTableList()
  }, [])

  return (
    <>
      <Card
        title={
          <Space>
            <span className="btn btn-blue btn-round">班</span>
            <Select defaultValue="0" bordered={false}>
              <Option value="0">背景校区初中物理1班</Option>
            </Select>
          </Space>
        }
        extra={
          <Space size={10}>
            <SxyButton mode="deep-green" radius={15}>
              开班中
            </SxyButton>
            <Divider type="vertical" />
            <Button className="is-btn-link" type="text">
              编辑
            </Button>
          </Space>
        }
      >
        <Row justify="center">
          <Col span={20}>
            <GenerateForm
              ref={classDetailsFormRef}
              className="form-item-mb-small form-item-label-des"
              formConfig={{
                size: 'large',
                labelCol: { span: 24 },
              }}
              rowGridConfig={{ gutter: [50, 0] }}
              colGirdConfig={{ xs: 24, sm: 24, md: 12, lg: 12, xl: 8 }}
              list={state.classDetailsFormList}
            />
          </Col>
        </Row>
        <Divider />
        <Space className="font-12" size={30}>
          <Text type="secondary">在读学生</Text>
          <span>在读学生：5</span>
          <span>满班率：50.00%</span>
          <span>新生率：50.00%</span>
          <span>转出率：50.00%</span>
          <span>退费率：50.00%</span>
          <span>停课率：50.00%</span>
          <span>升期率：0.00%</span>
          <span>出勤率：50.00%</span>
        </Space>
      </Card>
      <Card className="mt-5">
        <Tabs defaultActiveKey="1" tabBarGutter={80} style={{ marginTop: -10 }}>
          <TabPane tab="学员" key="1" />
          <TabPane tab="排课" key="2" />
          <TabPane tab="上课记录" key="3" />
          <TabPane tab="成绩" key="4" />
          <TabPane tab="课堂点评" key="5" />
          <TabPane tab="作业" key="6" />
          <TabPane tab="点名表" key="7" />
          <TabPane tab="信息表" key="8" />
        </Tabs>
        <Row className="mt-1" justify="space-between">
          <Col>
            <Space size={10}>
              <Button type="primary">添加学员</Button>
              <Button>导出</Button>
            </Space>
          </Col>
          <Col className="ant-form form-ash-theme">
            <div className="ant-form-item-control">
              <Input
                className="search-input"
                placeholder="请输入姓名/关键词"
                prefix={<SearchOutlined />}
                onPressEnter={(e) => onSearchText(e)}
              />
            </div>
          </Col>
        </Row>
        <Divider className="mt-5 mb-5" />
        <Row justify="space-between">
          <Col>
            <Space size={10}>
              <Button>批量发送通知</Button>
              <Button>批量转课</Button>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item key="1">1st menu item</Menu.Item>
                    <Menu.Item key="2">2nd menu item</Menu.Item>
                  </Menu>
                }
              >
                <Button>
                  更多操作 <DownOutlined />
                </Button>
              </Dropdown>
            </Space>
          </Col>
          <Col>
            <Button type="primary">自定义列</Button>
          </Col>
        </Row>
        <div className="sxy-alert-box mt-5">
          当前结果：共计
          <Button className="is-btn-link ml-1 mr-1" type="link">
            5
          </Button>
          个学员
        </div>
        <GenerateTable
          ref={studentTableRef}
          rowType="checkbox"
          apiMethod={getBasicQtyList}
          columns={state.studentTableColumns}
          scroll={{ x: 1300, y: 500 }}
        />
      </Card>
    </>
  )
}

export default ClassesDetails
