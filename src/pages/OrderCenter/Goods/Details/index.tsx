import React, { useReducer } from 'react'
import { Modal, Spin, Row, Col, Button, Space } from 'antd'
import { SxyBadge } from '@/style/module/badge'
import { SxyTable } from '@/style/module/table'

interface PropType {
  visible: boolean
  id: string
  status: number
  onCancel: () => void
}

interface RoleCheckType {
  name: string
  value: string | number
}

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_LOADING = '[SetLoading Action]',
}

const stateValue = {
  loading: false, // 弹窗全局显示loading
}

const GoodsDetailsView = (props: PropType) => {
  const [state] = useReducer<(state: StateType, action: Action) => StateType>(
    (state, action) => {
      switch (action.type) {
        case ActionType.SET_LOADING: // 设置全局显示loading
          return {
            ...state,
            loading: action.payload,
          }
        default:
          return state
      }
    },
    stateValue,
  )

  return (
    <Modal
      width={800}
      visible={props.visible}
      title="商品订单详情"
      onCancel={props.onCancel}
      destroyOnClose
      maskClosable={false}
      footer={null}
    >
      <Spin spinning={state.loading}>
        <Row className="modal-form-height" gutter={20}>
          <Col span={24}>
            <Space size={15} style={{ width: '100%' }}>
              <SxyBadge bg="#5860F8" />
              <span className="font-16">商品信息</span>
            </Space>
            <SxyTable className="mt-4">
              <thead>
                <tr>
                  <th>子单号</th>
                  <th>商品名称</th>
                  <th>商品编号</th>
                  <th>规格</th>
                  <th>价格</th>
                  <th>数量</th>
                  <th>商品金额</th>
                  <th>优惠金额</th>
                  <th>需付金额</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>G20191225171876429</td>
                  <td>XXXX</td>
                  <td>12251718</td>
                  <td>XXX</td>
                  <td>￥39.00</td>
                  <td>2</td>
                  <td>￥58.00</td>
                  <td>￥0.00</td>
                  <td>￥0.00</td>
                </tr>
                <tr>
                  <td>G20191225171876429</td>
                  <td>XXXX</td>
                  <td>12251718</td>
                  <td>XXX</td>
                  <td>￥39.00</td>
                  <td>2</td>
                  <td>￥58.00</td>
                  <td>￥0.00</td>
                  <td>￥0.00</td>
                </tr>
              </tbody>
            </SxyTable>
            <Row className="mt-3" justify="end">
              <Col span={7}>
                <Row>
                  <Col className="text-desc text-right" span={14}>
                    商品总额：
                  </Col>
                  <Col className="text-right" span={9}>
                    ￥146.00
                  </Col>
                </Row>
                <Row>
                  <Col className="text-desc text-right" span={14}>
                    运费：
                  </Col>
                  <Col className="text-right" span={9}>
                    +￥0.00
                  </Col>
                </Row>
                <Row>
                  <Col className="text-desc text-right" span={14}>
                    活动减免金额：
                  </Col>
                  <Col className="text-right" span={9}>
                    -￥10.00
                  </Col>
                </Row>
                <Row>
                  <Col className="text-desc text-right" span={14}>
                    需付总金额：
                  </Col>
                  <Col className="text-right" span={9}>
                    ￥136.00
                  </Col>
                </Row>
                <Row>
                  <Col className="text-desc text-right" span={14}>
                    实付总金额：
                  </Col>
                  <Col className="text-right" span={9}>
                    ￥136.00
                  </Col>
                </Row>
              </Col>
            </Row>
            <div className="mt-5">
              <Space size={15} style={{ width: '100%' }}>
                <SxyBadge bg="#5860F8" />
                <span className="font-16">用户信息</span>
              </Space>
              <div className="ml-6">
                <Row className="mt-2">
                  <Col className="text-desc" span={3}>
                    收货人：
                  </Col>
                  <Col>张先生</Col>
                </Row>
                <Row className="mt-1">
                  <Col className="text-desc" span={3}>
                    联系方式：
                  </Col>
                  <Col>13028888888</Col>
                </Row>
                <Row className="mt-1">
                  <Col className="text-desc" span={3}>
                    所属地区：
                  </Col>
                  <Col>福建厦门</Col>
                </Row>
                <Row className="mt-1">
                  <Col className="text-desc" span={3}>
                    收货地址：
                  </Col>
                  <Col>福建厦门海湾区海尔社区一期</Col>
                </Row>
              </div>
            </div>
            <div className="mt-6">
              <Space size={15} style={{ width: '100%' }}>
                <SxyBadge bg="#5860F8" />
                <span className="font-16">下单信息</span>
              </Space>
              <div className="ml-6">
                <Row className="mt-2">
                  <Col className="text-desc" span={4}>
                    下单人昵称：
                  </Col>
                  <Col>张先生</Col>
                </Row>
                <Row className="mt-1">
                  <Col className="text-desc" span={4}>
                    下单人手机号：
                  </Col>
                  <Col>13028888888</Col>
                </Row>
              </div>
            </div>
            <div className="mt-6">
              <Space size={15} style={{ width: '100%' }}>
                <SxyBadge bg="#5860F8" />
                <span className="font-16">付款方式</span>
              </Space>
              <div className="ml-6">
                <Row className="mt-2">
                  <Col className="text-desc" span={3}>
                    支付状态：
                  </Col>
                  <Col>未支付</Col>
                </Row>
                <Row className="mt-2">
                  <Col className="text-desc" span={3}>
                    支付方式：
                  </Col>
                  <Col>微信支付</Col>
                </Row>
                <Row className="mt-2">
                  <Col className="text-desc" span={3}>
                    支付时间：
                  </Col>
                  <Col>2018-08-01 19:00:00</Col>
                </Row>
              </div>
            </div>
            <div className="mt-6">
              <Space size={15} style={{ width: '100%' }}>
                <SxyBadge bg="#5860F8" />
                <span className="font-16">订单信息</span>
              </Space>
              <div className="ml-6">
                <Row className="mt-2">
                  <Col className="text-desc" span={3}>
                    订单状态：
                  </Col>
                  <Col>待付款</Col>
                </Row>
                <Row className="mt-2">
                  <Col className="text-desc" span={3}>
                    订单编号：
                  </Col>
                  <Col>576723672</Col>
                </Row>
                <Row className="mt-2">
                  <Col className="text-desc" span={3}>
                    订单类型：
                  </Col>
                  <Col>普通订单</Col>
                </Row>
                <Row className="mt-2">
                  <Col className="text-desc" span={3}>
                    备注信息：
                  </Col>
                  <Col>麻烦帮忙推一个专业有耐心的阿姨哦</Col>
                </Row>
                <Row className="mt-2">
                  <Col className="text-desc" span={3}>
                    下单时间：
                  </Col>
                  <Col>2018-08-01 19:00:00</Col>
                </Row>
                <Row className="mt-2">
                  <Col className="text-desc" span={3}>
                    发货时间：
                  </Col>
                  <Col>2018-08-01 19:00:00</Col>
                </Row>
                <Row className="mt-2">
                  <Col className="text-desc" span={3}>
                    签收时间：
                  </Col>
                  <Col>2018-08-01 19:00:00</Col>
                </Row>
                <Row className="mt-2">
                  <Col className="text-desc" span={3}>
                    完成时间：
                  </Col>
                  <Col>2018-08-01 19:00:00</Col>
                </Row>
                <Row className="mt-2">
                  <Col className="text-desc" span={3}>
                    取消时间：
                  </Col>
                  <Col>2018-08-01 19:00:00</Col>
                </Row>
              </div>
            </div>
            <div className="mt-6">
              <Space size={15} style={{ width: '100%' }}>
                <SxyBadge bg="#5860F8" />
                <span className="font-16">发票信息</span>
              </Space>
              <div className="ml-6">
                <Row className="mt-2">
                  <Col span={8}>
                    <Row>
                      <Col className="text-desc" span={9}>
                        发票抬头：
                      </Col>
                      <Col>个人</Col>
                    </Row>
                  </Col>
                  <Col span={8}>
                    <Row>
                      <Col className="text-desc" span={10}>
                        发票抬头：
                      </Col>
                      <Col>公司名称显示这里</Col>
                    </Row>
                    <Row className="mt-2">
                      <Col className="text-desc" span={10}>
                        纳税人识别号：
                      </Col>
                      <Col>576723672</Col>
                    </Row>
                  </Col>
                </Row>
              </div>
            </div>
            <div className="mt-6">
              <Space size={15} style={{ width: '100%' }}>
                <SxyBadge bg="#5860F8" />
                <span className="font-16">配送信息</span>
              </Space>
              <div className="ml-6">
                <Row className="mt-2">
                  <Col className="text-desc" span={3}>
                    物流公司：
                  </Col>
                  <Col>中通快递</Col>
                </Row>
                <Row className="mt-2">
                  <Col className="text-desc" span={3}>
                    物流单号：
                  </Col>
                  <Col>576723672</Col>
                </Row>
              </div>
            </div>
            <div className="mt-6">
              <Space size={15} style={{ width: '100%' }}>
                <SxyBadge bg="#5860F8" />
                <span className="font-16">订单信息</span>
              </Space>
              <div className="ml-6">
                <Row className="mt-2">
                  <Col className="text-desc" span={3}>
                    退款订单号：
                  </Col>
                  <Col>
                    <Button className="is-btn-link" type="link">
                      T202002130001
                    </Button>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col className="text-desc" span={3}>
                    退款金额：
                  </Col>
                  <Col>￥78.00</Col>
                </Row>
                <Row className="mt-2">
                  <Col className="text-desc" span={3}>
                    退款原因：
                  </Col>
                  <Col>不想要了</Col>
                </Row>
                <Row className="mt-2">
                  <Col className="text-desc" span={3}>
                    退款时间：
                  </Col>
                  <Col>2020-02-14 19:00:00</Col>
                </Row>
              </div>
            </div>
          </Col>
        </Row>
        <Row className="mt-10 mb-5" justify="center">
          <Col>
            <Button
              className="font-14"
              size="large"
              onClick={() => props.onCancel()}
            >
              返回
            </Button>
          </Col>
        </Row>
      </Spin>
    </Modal>
  )
}

export default GoodsDetailsView
