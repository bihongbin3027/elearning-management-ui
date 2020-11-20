import React, { useReducer, useRef } from 'react'
import { Modal, Spin, Row, Col, Button, Space } from 'antd'
import GenerateTable, { TableCallType } from '@/components/GenerateTable'
import { SxyBadge } from '@/style/module/badge'

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
  SET_HANDLE_MODAL = '[SetHandleModal Action]',
}

const stateValue = {
  loading: false, // 弹窗全局显示loading
  handleModal: {
    shopTableColumns: [
      { title: '子单号', dataIndex: 'qtyEname' },
      { title: '商品名称', dataIndex: 'qtyEname' },
      { title: '商品编号', dataIndex: 'qtyEname' },
      { title: '规格', dataIndex: 'qtyEname' },
      { title: '价格', dataIndex: 'qtyEname' },
      { title: '数量', dataIndex: 'qtyEname' },
      { title: '商品金额', dataIndex: 'qtyEname' },
      { title: '优惠金额', dataIndex: 'qtyEname' },
      { title: '需付金额', dataIndex: 'qtyEname' },
    ],
    shopTableData: [],
  },
}

const GoodsDetailsView = (props: PropType) => {
  const shopModalRef = useRef<TableCallType>(null)
  const [state] = useReducer<(state: StateType, action: Action) => StateType>(
    (state, action) => {
      switch (action.type) {
        case ActionType.SET_LOADING: // 设置全局显示loading
          return {
            ...state,
            loading: action.payload,
          }
        case ActionType.SET_HANDLE_MODAL: // 设置新增编辑弹窗
          return {
            ...state,
            handleModal: {
              ...state.handleModal,
              ...action.payload,
            },
          }
        default:
          return state
      }
    },
    stateValue,
  )

  return (
    <Modal
      width={700}
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
            <div className="mt-3">
              <GenerateTable
                ref={shopModalRef}
                data={state.handleModal.shopTableData}
                columns={state.handleModal.shopTableColumns}
                tableConfig={{
                  className: 'table-header-grey',
                  scroll: {
                    x: 800,
                    y: 300,
                  },
                }}
              />
            </div>
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
