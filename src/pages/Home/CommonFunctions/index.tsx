import React, { useReducer } from 'react'
import { useHistory } from 'react-router-dom'
import { Card, Row, Col, Tabs, Typography, Button } from 'antd'
import { MinusOutlined, CheckOutlined, PlusOutlined } from '@ant-design/icons'
import { SxyIcon } from '@/style/module/icon'
import { SxyBadge } from '@/style/module/badge'
import { HomeStyle, CardTitle, CommonItemBlock } from '@/pages/Home/style'

const { TabPane } = Tabs
const { Text } = Typography

type ReducerType = (state: StateType, action: Action) => StateType
interface Action {
  type: ActionType
  payload: any
}
type StateType = typeof stateValue

enum ActionType {
  SET_SAVE_LOADING = '[SetSaveLoading Action]',
}

const stateValue = {
  saveLoading: false, // 保存loading
}

const CommonFunctions = () => {
  const history = useHistory()
  const [state] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_SAVE_LOADING: // 保存loading
        return {
          ...state,
          saveLoading: action.payload,
        }
    }
  }, stateValue)

  /**
   * @Description 保存
   * @Author bihongbin
   * @Date 2020-09-15 17:33:44
   */
  const onSave = () => {
    console.log('保存')
  }

  return (
    <>
      <HomeStyle>
        <Card className="card-header-tabs">
          <Tabs>
            <TabPane tab="常用功能自定义" key="1" />
          </Tabs>
        </Card>
        <Card
          className="card-head-border-none card-body-common-style mt-4"
          title={<CardTitle>已选功能</CardTitle>}
        >
          {/* <Empty /> */}
          <Row gutter={[20, 0]}>
            <Col>
              <CommonItemBlock>
                <SxyBadge
                  className="common-delete"
                  size={20}
                  radius={20}
                  bg="#e56a67"
                >
                  <MinusOutlined style={{ color: '#fff' }} />
                </SxyBadge>
                <div className="common-head">
                  <SxyIcon
                    width={30}
                    height={30}
                    name="home_consultation_record.png"
                  />
                </div>
                <div className="common-title">
                  <div className="mb-1">咨询记录</div>
                  <Text className="font-12" type="secondary">
                    今日咨询0
                  </Text>
                </div>
              </CommonItemBlock>
            </Col>
          </Row>
        </Card>
        <Card
          className="card-head-border-none card-body-common-style mt-4"
          title={<CardTitle>可选功能</CardTitle>}
        >
          <div>
            <div className="mb-4">
              <Button className="is-btn-link" type="link">
                课程管理
              </Button>
            </div>
            {/* <Empty /> */}
            <Row gutter={[20, 0]}>
              <Col>
                <CommonItemBlock>
                  <SxyBadge
                    className="common-delete"
                    size={20}
                    radius={20}
                    bg="#5860f8"
                  >
                    <CheckOutlined style={{ color: '#fff' }} />
                  </SxyBadge>
                  <div className="common-head">
                    <SxyIcon
                      width={30}
                      height={30}
                      name="home_consultation_record.png"
                    />
                  </div>
                  <div className="common-title">
                    <div className="mb-1">咨询记录</div>
                    <Text className="font-12" type="secondary">
                      今日咨询0
                    </Text>
                  </div>
                </CommonItemBlock>
              </Col>
              <Col>
                <CommonItemBlock>
                  <SxyBadge
                    className="common-delete"
                    size={20}
                    radius={20}
                    bg="#5860f8"
                  >
                    <PlusOutlined style={{ color: '#fff' }} />
                  </SxyBadge>
                  <div className="common-head">
                    <SxyIcon
                      width={30}
                      height={30}
                      name="home_consultation_record.png"
                    />
                  </div>
                  <div className="common-title">
                    <div className="mb-1">发送通知</div>
                  </div>
                </CommonItemBlock>
              </Col>
            </Row>
          </div>
          <div className="mt-5">
            <div className="mb-4">
              <Button className="is-btn-link" type="link">
                营销管理
              </Button>
            </div>
            {/* <Empty /> */}
            <Row gutter={[20, 0]}>
              <Col>
                <CommonItemBlock>
                  <SxyBadge
                    className="common-delete"
                    size={20}
                    radius={20}
                    bg="#5860f8"
                  >
                    <CheckOutlined style={{ color: '#fff' }} />
                  </SxyBadge>
                  <div className="common-head">
                    <SxyIcon
                      width={30}
                      height={30}
                      name="home_consultation_record.png"
                    />
                  </div>
                  <div className="common-title">
                    <div className="mb-1">咨询记录</div>
                    <Text className="font-12" type="secondary">
                      今日咨询0
                    </Text>
                  </div>
                </CommonItemBlock>
              </Col>
              <Col>
                <CommonItemBlock>
                  <SxyBadge
                    className="common-delete"
                    size={20}
                    radius={20}
                    bg="#5860f8"
                  >
                    <PlusOutlined style={{ color: '#fff' }} />
                  </SxyBadge>
                  <div className="common-head">
                    <SxyIcon
                      width={30}
                      height={30}
                      name="home_consultation_record.png"
                    />
                  </div>
                  <div className="common-title">
                    <div className="mb-1">发送通知</div>
                  </div>
                </CommonItemBlock>
              </Col>
            </Row>
          </div>
          <Row className="mt-10 mb-5" justify="center">
            <Col>
              <Button
                className="font-14"
                size="large"
                onClick={() => history.goBack()}
              >
                取消
              </Button>
            </Col>
            <Col>
              <Button
                className="font-14 ml-5"
                size="large"
                type="primary"
                loading={state.saveLoading}
                onClick={onSave}
              >
                保存
              </Button>
            </Col>
          </Row>
        </Card>
      </HomeStyle>
    </>
  )
}

export default CommonFunctions
