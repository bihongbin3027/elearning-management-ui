import React, { useReducer, useEffect } from 'react'
import { Modal, Row, Button, Col, Divider, Spin } from 'antd'
import { AnyObjectType } from '@/typings'
import { SxyButton } from '@/style/module/button'

interface PropType {
  visible: boolean
  width?: number
  title: string
  id?: string
  onCancel: () => void
}

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_LOADING = '[SetLoading Action]',
  SET_ROLE_CHECK_LIST = '[SetRoleCheckList Action]',
}

const stateValue = {
  loading: false, // 弹窗全局显示loading
  roleCheckList: [] as AnyObjectType[], // 角色详情数据
}

const RoleDetailsView = (props: PropType) => {
  const [state, dispatch] = useReducer<
    (state: StateType, action: Action) => StateType
  >((state, action) => {
    switch (action.type) {
      case ActionType.SET_LOADING: // 设置全局显示loading
        return {
          ...state,
          loading: action.payload,
        }
      case ActionType.SET_ROLE_CHECK_LIST: // 设置角色详情数据
        return {
          ...state,
          roleCheckList: action.payload,
        }
      default:
        return state
    }
  }, stateValue)

  /**
   * @Description 设置角色详情数据
   * @Author bihongbin
   * @Date 2020-08-05 16:21:49
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_ROLE_CHECK_LIST,
      payload: [
        {
          name: '华旅云创科技有限公司',
          children: [
            {
              name: '常规角色',
              children: [
                {
                  name: '总经办',
                },
                {
                  name: '财务管理员',
                },
                {
                  name: '系统管理员',
                },
              ],
            },
          ],
        },
        {
          name: '华旅云创科技有限公司',
          children: [
            {
              name: '常规角色',
              children: [
                {
                  name: '总经办',
                },
                {
                  name: '财务管理员',
                },
                {
                  name: '系统管理员',
                },
              ],
            },
          ],
        },
      ],
    })
  }, [])

  return (
    <Modal
      width={props.width}
      visible={props.visible}
      title={props.title}
      onCancel={props.onCancel}
      destroyOnClose
      maskClosable={false}
      footer={null}
    >
      <Spin spinning={state.loading}>
        <Row justify="center">
          <Col span={23}>
            {state.roleCheckList.map((item, index) => (
              <div key={index}>
                <div className="mb-4">
                  <Button className="is-btn-link" type="link">
                    {item.name}
                  </Button>
                </div>
                {item.children.map((c: AnyObjectType, d: number) => (
                  <div key={d}>
                    <div className="mb-3">{c.name}</div>
                    <Row gutter={[20, 10]}>
                      {c.children.map((x: AnyObjectType, m: number) => (
                        <Col span={12} key={m}>
                          <SxyButton
                            mode="dust"
                            size="large"
                            border={false}
                            block
                          >
                            {x.name}
                          </SxyButton>
                        </Col>
                      ))}
                    </Row>
                  </div>
                ))}
                <Divider className="mt-7 mb-5" />
              </div>
            ))}
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

export default RoleDetailsView
