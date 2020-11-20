import React, { useEffect } from 'react'
import { Modal, Row, Button, Col, Divider, Spin } from 'antd'
import useSetState from '@/hooks/useSetState'
import { AnyObjectType } from '@/typings'
import Empty from '@/components/Empty'
import { SxyButton } from '@/style/module/button'
import { getUserRole } from '@/api/systemManage/user'

interface PropType {
  visible: boolean
  width?: number
  title: string
  id: string
  onCancel: () => void
}

interface StateType {
  loading: boolean
  roleCheckList: AnyObjectType[]
}

const RoleDetailsView = (props: PropType) => {
  const [state, setState] = useSetState<StateType>({
    loading: false, // 弹窗全局显示loading
    roleCheckList: [], // 角色详情数据
  })

  /**
   * @Description 初始化数据
   * @Author bihongbin
   * @Date 2020-08-05 16:21:49
   */
  useEffect(() => {
    const getInit = async () => {
      if (props.id) {
        setState({
          loading: true,
        })
        try {
          const result = await getUserRole(props.id)
          if (result.data.content.length) {
            setState({
              roleCheckList: result.data.content,
            })
          }
        } catch (error) {}
        setState({
          loading: false,
        })
      }
    }
    getInit()
  }, [props.id, setState])

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
            {state.roleCheckList.length ? (
              state.roleCheckList.map((item, index) => (
                <div key={index}>
                  <div className="mb-4">
                    <Button className="is-btn-link" type="link">
                      {item.cname}
                    </Button>
                  </div>
                  {item.categoryList.map((c: AnyObjectType, d: number) => (
                    <div key={d}>
                      <div className="mb-3">{c.categoryName}</div>
                      <Row gutter={[20, 10]}>
                        {c.roleList.map((x: AnyObjectType, m: number) => (
                          <Col span={12} key={m}>
                            <SxyButton
                              mode="dust"
                              size="large"
                              border={false}
                              block
                            >
                              {x.roleCname}
                            </SxyButton>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  ))}
                  <Divider className="mt-7 mb-5" />
                </div>
              ))
            ) : (
              <Empty outerHeight={300} />
            )}
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
