import React, { useReducer, useEffect } from 'react'
import {
  Modal,
  Tag,
  Row,
  Col,
  Descriptions,
  Collapse,
  Badge,
  Spin,
  Card,
} from 'antd'
import TreeNode from '@/components/Tree'

const { Panel } = Collapse

interface PropType {
  visible: boolean
  onCancel: () => void
}

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_LOADING = '[SetLoading Action]',
  SET_BASIC_MENU = '[SetBasicMenu Action]',
}

const stateValue = {
  loading: false, // 弹窗全局显示loading
  basicMenu: [], // 基础菜单数据
}

const PermissionsView = (props: PropType) => {
  const [state, dispatch] = useReducer<
    (state: StateType, action: Action) => StateType
  >((state, action) => {
    switch (action.type) {
      case ActionType.SET_LOADING: // 设置全局显示loading
        return {
          ...state,
          loading: action.payload,
        }
      case ActionType.SET_BASIC_MENU: // 设置基础菜单数据
        return {
          ...state,
          basicMenu: action.payload,
        }
      default:
        return state
    }
  }, stateValue)

  useEffect(() => {
    dispatch({
      type: ActionType.SET_BASIC_MENU,
      payload: [
        {
          title: '华旅云创科技有限公司',
          key: '0-0',
          isLocked: false,
          children: [
            {
              title: '研发部',
              key: '0-0-1',
              isLocked: false,
              children: [
                {
                  title: '技术组',
                  key: '0-0-1-0',
                  isLocked: false,
                },
                {
                  title: '运维组',
                  key: '0-0-1-1',
                  isLocked: true,
                },
                {
                  title: '测试组',
                  key: '0-0-1-2',
                  isLocked: false,
                },
              ],
            },
            {
              title: '销售部',
              key: '0-0-2',
              isLocked: false,
            },
          ],
        },
        {
          title: '森鑫源实业发展有限公司',
          key: '0-1',
          isLocked: false,
          children: [
            {
              title: '财务部',
              key: '0-1-1',
              isLocked: false,
              children: [
                {
                  title: '结算部',
                  key: '0-1-1-0',
                  isLocked: false,
                },
                {
                  title: '会计部',
                  key: '0-1-1-1',
                  isLocked: false,
                },
              ],
            },
            {
              title: '人力资源部',
              key: '0-1-2',
              isLocked: false,
            },
          ],
        },
      ],
    })
  }, [])

  return (
    <Modal
      width={1200}
      visible={props.visible}
      title="角色权限视图"
      onCancel={props.onCancel}
      destroyOnClose
      maskClosable={false}
      footer={null}
    >
      <Spin spinning={state.loading}>
        <Row className="modal-form-height" gutter={20}>
          <Col span={6}>
            <Card className="card-border-block" title="角色权限视图">
              <div className="font-12 text-desc mb-2">基础菜单</div>
              <TreeNode searchOpen data={state.basicMenu} />
            </Card>
          </Col>
          <Col span={18}>
            <Descriptions
              className="card-descriptions card-desc-center card-desc-average"
              layout="vertical"
              bordered
              column={{ xs: 8, sm: 16, md: 24 }}
            >
              <Descriptions.Item
                label={<Tag className="tag-size-middle tag-info">基础权限</Tag>}
              >
                <Collapse
                  className="collapse-text-primary"
                  defaultActiveKey={['1']}
                  ghost
                >
                  <Panel showArrow={false} header="权限管理" key="1">
                    <p>1</p>
                  </Panel>
                  <Panel showArrow={false} header="参数配置" key="2">
                    <p>2</p>
                  </Panel>
                  <Panel showArrow={false} header="数字字典" key="3">
                    <p>3</p>
                  </Panel>
                </Collapse>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Tag className="tag-size-middle tag-warning">数据权限</Tag>
                }
              >
                <ul className="mb-5">
                  <li className="mb-2">
                    <Badge status="warning" />
                    DR12 可看下属业务数据
                  </li>
                  <li className="mb-2">
                    <Badge status="warning" />
                    DR12 可看下属业务数据
                  </li>
                  <li className="mb-2">
                    <Badge status="warning" />
                    DR10 限只能看自己
                  </li>
                </ul>
                <ul className="mb-5">
                  <li className="mb-2">
                    <Badge status="warning" />
                    DR12 可看下属业务数据
                  </li>
                  <li className="mb-2">
                    <Badge status="warning" />
                    DR12 可看下属业务数据
                  </li>
                  <li className="mb-2">
                    <Badge status="warning" />
                    DR10 限只能看自己
                  </li>
                </ul>
              </Descriptions.Item>
              <Descriptions.Item
                label={
                  <Tag className="tag-size-middle tag-finish">页面权限</Tag>
                }
              >
                <ul>
                  <li className="mb-2">
                    <Badge status="success" />
                    DR13 限只能看自己数据
                  </li>
                  <li className="mb-2">
                    <Badge status="success" />
                    DR06 查看系统组织数据
                  </li>
                </ul>
              </Descriptions.Item>
            </Descriptions>
          </Col>
        </Row>
      </Spin>
    </Modal>
  )
}

export default PermissionsView
