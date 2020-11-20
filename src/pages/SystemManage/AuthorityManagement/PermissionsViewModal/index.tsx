// TODO 相关页面需要这个弹窗的功能还没做

import React, { useEffect } from 'react'
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
import useSetState from '@/hooks/useSetState'
import TreeNode from '@/components/Tree'
import { TreeType } from '@/components/Tree/interface'
import { AnyObjectType } from '@/typings'

const { Panel } = Collapse

interface PropType {
  visible: boolean
  loading: boolean
  treeList: TreeType[]
  companyList: AnyObjectType[]
  onCancel: () => void
}

interface StateType {
  loading: boolean
  basicMenu: TreeType[]
  currentTreeRow: AnyObjectType
  companyList: AnyObjectType[]
}

const PermissionsView = (props: PropType) => {
  const [state, setState] = useSetState<StateType>({
    loading: false, // 弹窗全局显示loading
    basicMenu: [], // 基础菜单数据
    currentTreeRow: {}, // 树选中的数据
    companyList: [], // 公司数据
  })

  /**
   * @Description 设置loading
   * @Author bihongbin
   * @Date 2020-10-20 11:35:22
   */
  useEffect(() => {
    setState({
      loading: props.loading,
    })
  }, [props.loading, setState])

  /**
   * @Description 设置基础菜单树
   * @Author bihongbin
   * @Date 2020-10-20 11:35:31
   */
  useEffect(() => {
    setState({
      basicMenu: props.treeList,
    })
  }, [props.treeList, setState])

  /**
   * @Description 设置公司数据
   * @Author bihongbin
   * @Date 2020-10-20 11:35:45
   */
  useEffect(() => {
    setState({
      companyList: props.companyList,
    })
  }, [props.companyList, setState])

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
                  <Tag className="tag-size-middle tag-finish">资源权限</Tag>
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
