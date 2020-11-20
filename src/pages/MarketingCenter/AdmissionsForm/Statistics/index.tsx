import React, { useReducer, useRef } from 'react'
import { Row, Col, Card, Typography, Divider, Space, Select } from 'antd'
import { ColumnType } from 'antd/es/table'
import { Line } from '@ant-design/charts'
import Empty from '@/components/Empty'
import GenerateTable, { TableCallType } from '@/components/GenerateTable'
import { AnyObjectType } from '@/typings'
import { getBasicQtyList } from '@/api/basicData'
import { StatisticsWrapper } from '@/pages/MarketingCenter/AdmissionsForm/Statistics/style'

const { Text, Title } = Typography
const { Option } = Select

type ReducerType = (state: StateType, action: Action) => StateType
interface Action {
  type: ActionType
  payload: any
}
type StateType = typeof stateValue

enum ActionType {
  SET_TREND = '[SetTrend Action]',
}

const stateValue = {
  // 采单趋势图
  trend: {
    data: [
      {
        date: '2018/8/1',
        type: '线索量',
        value: 4623,
      },
      {
        date: '2018/8/1',
        type: '浏览量',
        value: 2208,
      },
      {
        date: '2018/8/2',
        type: '线索量',
        value: 6145,
      },
      {
        date: '2018/8/2',
        type: '浏览量',
        value: 2016,
      },
      {
        date: '2018/8/3',
        type: '线索量',
        value: 508,
      },
      {
        date: '2018/8/3',
        type: '浏览量',
        value: 2916,
      },
      {
        date: '2018/8/4',
        type: '线索量',
        value: 6268,
      },
      {
        date: '2018/8/4',
        type: '浏览量',
        value: 4512,
      },
      {
        date: '2018/8/5',
        type: '线索量',
        value: 6411,
      },
      {
        date: '2018/8/5',
        type: '浏览量',
        value: 8281,
      },
    ] as AnyObjectType[],
    forceFit: true,
    height: 336,
    padding: [10, 10, 80, 50],
    xField: 'date',
    yField: 'value',
    legend: { position: 'bottom-center' as 'bottom-center' },
    seriesField: 'type',
    color: (type: string) => {
      return type === '线索量' ? '#46d49f' : '#5860f8'
    },
  },
  // 线索列表表头
  tableColumns: [
    { title: '学员姓名', dataIndex: 'qtyCname' },
    { title: '电话', dataIndex: 'a' },
    { title: '咨询校区', dataIndex: 'b' },
    { title: '跟进状态', dataIndex: 'c' },
    { title: '采单员', dataIndex: 'd' },
    { title: '采单时间', dataIndex: 'e' },
    { title: '微信号', dataIndex: 'f' },
    { title: '民族', dataIndex: 'g' },
    { title: '生日', dataIndex: 'h' },
  ] as ColumnType<AnyObjectType>[],
}

const Statistics = () => {
  const tableRef = useRef<TableCallType>()
  const [state] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_TREND: // 采单趋势图
        return {
          ...state,
          trend: {
            ...state.trend,
            ...action.payload,
          },
        }
    }
  }, stateValue)

  return (
    <StatisticsWrapper>
      <Row className="mt-4" gutter={16}>
        <Col span={8}>
          <Card>
            <Row
              className="text-center total-card"
              align="middle"
              justify="center"
            >
              <Col>
                <Text type="secondary">今日浏览量</Text>
                <br />
                <div className="mt-6">
                  <Title className="mb-none" level={4}>
                    0
                  </Title>
                </div>
              </Col>
              <Col>
                <Divider className="ml-8 mr-8" type="vertical" />
              </Col>
              <Col>
                <Text type="secondary">总浏览量</Text>
                <br />
                <div className="mt-6">
                  <Title className="mb-none" level={4}>
                    12
                  </Title>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Row
              className="text-center total-card"
              align="middle"
              justify="center"
            >
              <Col>
                <Text type="secondary">今日线索量</Text>
                <br />
                <div className="mt-6">
                  <Title className="mb-none" level={4}>
                    0
                  </Title>
                </div>
              </Col>
              <Col>
                <Divider className="ml-8 mr-8" type="vertical" />
              </Col>
              <Col>
                <Text type="secondary">总线索量</Text>
                <br />
                <div className="mt-6">
                  <Title className="mb-none" level={4}>
                    12
                  </Title>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Row
              className="text-center total-card"
              align="middle"
              justify="center"
            >
              <Col>
                <Text type="secondary">线索概览</Text>
                <Empty
                  className="mt-3"
                  outerHeight={60}
                  description={false}
                  imageStyle={{ height: 56 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row className="mt-4" gutter={16}>
        <Col span={16}>
          <Card
            title="采单趋势"
            extra={
              <Space size={10}>
                <span>采单周期</span>
                <Select defaultValue="1">
                  <Option value="1">最近7天</Option>
                </Select>
              </Space>
            }
          >
            <Line {...state.trend} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="采单员总线索量排行">
            <Row
              className="text-center total-card"
              align="middle"
              justify="center"
              style={{ height: 343 }}
            >
              <Col>
                <Empty
                  className="mt-3"
                  outerHeight={343}
                  description={false}
                  imageStyle={{ height: 56 }}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Card
        className="table-card mt-4"
        title="线索列表"
        extra={
          <Space size={10}>
            <span>采单周期</span>
            <Select defaultValue="1">
              <Option value="1">最近7天</Option>
            </Select>
          </Space>
        }
      >
        <GenerateTable
          ref={tableRef}
          apiMethod={getBasicQtyList}
          columns={state.tableColumns}
        />
      </Card>
    </StatisticsWrapper>
  )
}

export default Statistics
