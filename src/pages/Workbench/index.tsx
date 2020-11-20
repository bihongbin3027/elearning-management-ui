import React, { useReducer, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import { Card, Row, Col, Tabs, Typography, Button, Badge } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { StackedColumn } from '@ant-design/charts'
// import Empty from '@/components/Empty'
import { SxyButton } from '@/style/module/button'
import { AnyObjectType } from '@/typings'
import {
  HomeStyle,
  CardTitle,
  StepsContainer,
  StepsBox,
  CommonItemBlock,
} from '@/pages/Workbench/style'
import { SxyIcon } from '@/style/module/icon'

const { TabPane } = Tabs
const { Text } = Typography

type ReducerType = (state: StateType, action: Action) => StateType
interface Action {
  type: ActionType
  payload: any
}
type StateType = typeof stateValue

enum ActionType {
  SET_STEP_STRETCH = '[SetStepStretch Action]',
  SET_REGISTRATION_OVERVIEW = '[SetRegistrationOverview Action]',
}

const stateValue = {
  stepStretch: true, // 步骤展开收起
  // 今日报名总览
  registrationOverview: {
    data: [] as AnyObjectType[],
    forceFit: true,
    height: 180,
    padding: [10, 100, 20, 30],
    xField: 'year',
    yField: 'value',
    xAxis: {
      title: {
        visible: true,
        text: `${moment().format('YYYY-MM-DD')}`,
      },
    },
    yAxis: {
      min: 0,
      title: {
        visible: false,
      },
      label: {
        visible: true,
        formatter: (v: any) => {
          return parseInt(v).toString()
        },
      },
    },
    meta: {
      value: {
        formatter: (v: any) => {
          return `${v}人`
        },
      },
    },
    color: ['#5860f8', ' #46d49f', '#fdCa40'],
    stackField: 'type',
    columnSize: 30,
  },
}

function Home() {
  const history = useHistory()
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_STEP_STRETCH: // 步骤展开收起
        return {
          ...state,
          stepStretch: action.payload,
        }
      case ActionType.SET_REGISTRATION_OVERVIEW: // 设置今日报名总览
        return {
          ...state,
          registrationOverview: {
            ...state.registrationOverview,
            ...action.payload,
          },
        }
    }
  }, stateValue)

  /**
   * @Description 设置今日报名总览
   * @Author bihongbin
   * @Date 2020-09-23 11:15:57
   */
  const handleRegistrationOverviewState = (
    data: Partial<StateType['registrationOverview']>,
  ) => {
    dispatch({
      type: ActionType.SET_REGISTRATION_OVERVIEW,
      payload: data,
    })
  }

  /**
   * @Description 设置今日报名总览
   * @Author bihongbin
   * @Date 2020-09-23 11:16:55
   */
  useEffect(() => {
    handleRegistrationOverviewState({
      data: [
        {
          year: '北京校区',
          value: 1,
          type: '新生报名',
        },
        {
          year: '北京校区',
          value: 2,
          type: '老生报名',
        },
        {
          year: '北京校区',
          value: 1,
          type: '新增咨询',
        },
      ],
    })
  }, [])

  return (
    <HomeStyle>
      <Card className="card-header-tabs">
        <Tabs>
          <TabPane tab="工作台" key="1" />
        </Tabs>
      </Card>
      <Row gutter={16}>
        <Col xs={24} sm={24} xl={16}>
          <Card
            className={`card-head-border-none mt-4 card-body-style ${
              state.stepStretch ? 'step-stretch' : ''
            }`}
            title={<CardTitle>四步快速完成初始设置（4/4）</CardTitle>}
            extra={
              <div
                onClick={() => {
                  dispatch({
                    type: ActionType.SET_STEP_STRETCH,
                    payload: !state.stepStretch,
                  })
                }}
              >
                <Text className="pointer" type="secondary">
                  {state.stepStretch ? '展开' : '收起'}
                </Text>
              </div>
            }
          >
            <StepsContainer className="mb-5">
              <StepsBox>
                <div className="step-avatar-wrap">
                  <div className="step-avatar step-tail">
                    <SxyIcon width={30} height={30} name="home_staff.png" />
                  </div>
                </div>
                <div className="step-title">
                  <Button className="is-btn-link font-16" type="link">
                    员工
                  </Button>
                  设置
                </div>
                <Row className="step-foot" justify="space-between">
                  <Col>
                    <Text className="font-12" type="secondary">
                      创建账号
                    </Text>
                  </Col>
                  <Col>
                    <Text className="font-12" type="secondary">
                      分配权限
                    </Text>
                  </Col>
                </Row>
              </StepsBox>
              <StepsBox>
                <div className="step-avatar-wrap">
                  <div className="step-avatar step-tail">
                    <SxyIcon
                      width={30}
                      height={30}
                      name="home_curriculum.png"
                    />
                  </div>
                </div>
                <div className="step-title">
                  <Button className="is-btn-link font-16" type="link">
                    课程
                  </Button>
                  设置
                </div>
                <Row className="step-foot" justify="space-between">
                  <Col>
                    <Text className="font-12" type="secondary">
                      收费模式
                    </Text>
                  </Col>
                  <Col>
                    <Text className="font-12" type="secondary">
                      课程价格
                    </Text>
                  </Col>
                </Row>
              </StepsBox>
              <StepsBox>
                <div className="step-avatar-wrap">
                  <div className="step-avatar step-tail">
                    <SxyIcon width={30} height={30} name="home_class.png" />
                  </div>
                </div>
                <div className="step-title">
                  <Button className="is-btn-link font-16" type="link">
                    班级
                  </Button>
                  设置
                </div>
                <Row className="step-foot" justify="space-between">
                  <Col>
                    <Text className="font-12" type="secondary">
                      班级名称
                    </Text>
                  </Col>
                  <Col>
                    <Text className="font-12" type="secondary">
                      满班人数
                    </Text>
                  </Col>
                </Row>
              </StepsBox>
              <StepsBox>
                <div className="step-avatar-wrap">
                  <div className="step-avatar step-tail">
                    <SxyIcon width={30} height={30} name="home_student.png" />
                  </div>
                </div>
                <div className="step-title">
                  <Button className="is-btn-link font-16" type="link">
                    学员
                  </Button>
                  设置
                </div>
                <Row className="step-foot" justify="space-between">
                  <Col>
                    <Text className="font-12" type="secondary">
                      学员信息
                    </Text>
                  </Col>
                  <Col>
                    <Text className="font-12" type="secondary">
                      批量导入
                    </Text>
                  </Col>
                </Row>
              </StepsBox>
            </StepsContainer>
          </Card>
          <Card
            className="card-head-border-none card-body-style mt-4"
            title={<CardTitle>常用功能</CardTitle>}
            extra={
              <Button
                className="is-btn-link"
                type="link"
                onClick={() => history.push('/common-functions')}
              >
                <Row align="middle">
                  自定义
                  <RightOutlined className="ml-1" />
                </Row>
              </Button>
            }
          >
            {/* <Empty /> */}
            <Row className="mb-2" gutter={[20, 20]}>
              <Col>
                <CommonItemBlock>
                  <div className="common-head">
                    <SxyIcon
                      width={30}
                      height={30}
                      name="home_consultation_record.png"
                    />
                  </div>
                  <div className="common-title font-12">咨询记录</div>
                </CommonItemBlock>
              </Col>
              <Col>
                <CommonItemBlock>
                  <div className="common-head">
                    <SxyIcon
                      width={30}
                      height={30}
                      name="home_registration_renewal_fee.png"
                    />
                  </div>
                  <div className="common-title font-12">报名续费</div>
                </CommonItemBlock>
              </Col>
              <Col>
                <CommonItemBlock>
                  <div className="common-head">
                    <SxyIcon width={30} height={30} name="home_schedule.png" />
                  </div>
                  <div className="common-title font-12">排课</div>
                </CommonItemBlock>
              </Col>
              <Col>
                <CommonItemBlock>
                  <div className="common-head">
                    <SxyIcon
                      width={30}
                      height={30}
                      name="home_recording_lessons.png"
                    />
                  </div>
                  <div className="common-title font-12">记上课</div>
                </CommonItemBlock>
              </Col>
              <Col>
                <CommonItemBlock>
                  <div className="common-head">
                    <SxyIcon
                      width={30}
                      height={30}
                      name="home_send_notification.png"
                    />
                  </div>
                  <div className="common-title">发送通知</div>
                </CommonItemBlock>
              </Col>
            </Row>
          </Card>
          <Card
            className="card-head-border-none card-body-style mt-4"
            title={<CardTitle>今日报名总览</CardTitle>}
          >
            {/* <Empty /> */}
            <StackedColumn {...state.registrationOverview} />
          </Card>
          <Card
            className="card-head-border-none card-body-style mt-4"
            title={<CardTitle>在线用户</CardTitle>}
          >
            {/* <Empty /> */}
            <Row gutter={[0, 15]}>
              <Col span={24}>
                <Badge color="#5860f8" />
                <span className="ml-1">王二嫩</span>
                <Text className="ml-5" type="secondary">
                  深圳市
                </Text>
              </Col>
              <Col span={24}>
                <Badge color="#5860f8" />
                <span className="ml-1">顶三胖</span>
                <Text className="ml-5" type="secondary">
                  深圳市
                </Text>
              </Col>
              <Col span={24}>
                <Badge color="#5860f8" />
                <span className="ml-1">苏大强</span>
                <Text className="ml-5" type="secondary">
                  深圳市
                </Text>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={24} xl={8}>
          <Card
            className="card-head-border-none card-body-style mt-4"
            title={<CardTitle>待办提醒</CardTitle>}
          >
            {/* <Empty /> */}
            <Row gutter={[0, 15]}>
              <Col>
                <SxyButton
                  size="small"
                  mode="deep-yellow"
                  font={12}
                  radius={16}
                >
                  到期
                </SxyButton>
              </Col>
              <Col className="text-overstep-ellipsis">
                <span className="link-text-hover ml-3">
                  104个 按时间学员将到期
                </span>
              </Col>
            </Row>
            <Row gutter={[0, 15]}>
              <Col>
                <SxyButton size="small" mode="primary" font={12} radius={16}>
                  到期
                </SxyButton>
              </Col>
              <Col className="text-overstep-ellipsis">
                <span className="link-text-hover ml-3">按期学员将到期</span>
              </Col>
            </Row>
            <Row gutter={[0, 15]}>
              <Col>
                <SxyButton size="small" mode="deep-green" font={12} radius={16}>
                  到期
                </SxyButton>
              </Col>
              <Col className="text-overstep-ellipsis">
                <span className="link-text-hover ml-3">
                  104个 家长申请需处理
                </span>
              </Col>
            </Row>
            <Row gutter={[0, 15]}>
              <Col>
                <SxyButton size="small" mode="deep-red" font={12} radius={16}>
                  到期
                </SxyButton>
              </Col>
              <Col className="text-overstep-ellipsis">
                <span className="link-text-hover ml-3">
                  104个 待点评作业需处理
                </span>
              </Col>
            </Row>
          </Card>
          <Card
            className="card-head-border-none card-body-style mt-4"
            title={<CardTitle>员工通知</CardTitle>}
            extra={
              <Button
                className="is-btn-link"
                type="link"
                onClick={() => history.push('/notice')}
              >
                <SxyIcon width={16} height={16} name="card_add.png" />
              </Button>
            }
          >
            {/* <Empty /> */}
            <Row gutter={[0, 15]}>
              <Col span={24}>
                <Row justify="space-between" gutter={10}>
                  <Col className="text-overstep-ellipsis" span={20}>
                    <Button className="is-btn-link" type="link">
                      【人事】
                    </Button>
                    <span className="link-text-hover ml-2">
                      未命名文档未命名文档未命名文档未命名文档未命名文档未命名文档未命名文档未命名文档未命名文档
                    </span>
                  </Col>
                  <Col className="text-right" span={4}>
                    09/10
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row justify="space-between" gutter={10}>
                  <Col className="text-overstep-ellipsis" span={20}>
                    <Button className="is-btn-link" type="link">
                      【公告】
                    </Button>
                    <span className="link-text-hover ml-2">未命名文档</span>
                  </Col>
                  <Col className="text-right" span={4}>
                    09/10
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Row justify="space-between" gutter={10}>
                  <Col className="text-overstep-ellipsis" span={20}>
                    <Button className="is-btn-link" type="link">
                      【人事】
                    </Button>
                    <span className="link-text-hover ml-2">未命名文档</span>
                  </Col>
                  <Col className="text-right" span={4}>
                    09/10
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
          <Card
            className="card-head-border-none card-body-style mt-4"
            title={<CardTitle>产品动态</CardTitle>}
          >
            {/* <Empty /> */}
            <Row gutter={[0, 15]}>
              <Col span={24}>
                <Row justify="space-between" gutter={10}>
                  <Col
                    className="text-overstep-ellipsis link-text-hover"
                    span={20}
                  >
                    课堂点评全面升级，新增点评消息推送功能,课堂点评全面升级，新增点评消息推送功能
                  </Col>
                  <Col className="text-right" span={4}>
                    09/10
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
          <Card
            className="card-head-border-none card-body-style mt-4"
            title={<CardTitle>消息通知</CardTitle>}
            extra={
              <>
                <Button className="is-btn-link" type="link">
                  <Row align="middle">
                    查看更多
                    <RightOutlined className="ml-1" />
                  </Row>
                </Button>
              </>
            }
          >
            {/* <Empty /> */}
            <Row gutter={[0, 15]}>
              <Col span={24}>
                <Row justify="space-between" gutter={10}>
                  <Col
                    className="text-overstep-ellipsis link-text-hover"
                    span={20}
                  >
                    课堂点评全面升级，新增点评消息推送功能
                  </Col>
                  <Col className="text-right" span={4}>
                    09/10
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </HomeStyle>
  )
}

export default Home
