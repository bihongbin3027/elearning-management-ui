/*
 * @Description 渲染子路由tabs组件
 * @Author bihongbin
 * @Date 2020-09-27 16:42:39
 * @LastEditors bihongbin
 * @LastEditTime 2020-11-12 17:17:03
 */

import React from 'react'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import {
  Redirect,
  useRouteMatch,
  useLocation,
  useHistory,
  RouteProps,
} from 'react-router-dom'
import { Card, Row, Col, Tabs } from 'antd'

const { TabPane } = Tabs

type DataType = {
  visible?: boolean
  name: string
  path: string
  component: RouteProps['component']
}

export interface PropTypes {
  data: DataType[]
}

const RenderSubRoute = (props: PropTypes) => {
  const match = useRouteMatch()
  const history = useHistory()
  const location = useLocation()

  return (
    <>
      <Card className="card-header-tabs">
        <Row align="middle" justify="space-between">
          <Col>
            <Tabs
              activeKey={location.pathname}
              tabBarGutter={60}
              onTabClick={(key) => history.push(key)}
            >
              {props.data.map(
                (item) =>
                  !item.visible && (
                    <TabPane
                      tab={item.name}
                      key={`${match.path}${item.path}`}
                    />
                  ),
              )}
            </Tabs>
          </Col>
        </Row>
      </Card>
      <CacheSwitch>
        {props.data.map((item) => (
          <CacheRoute
            exact
            path={`${match.path}${item.path}`}
            component={item.component}
            key={item.path}
          />
        ))}
        <Redirect
          to={`${match.path}${
            props.data.length ? props.data[0].path : undefined
          }`}
        />
      </CacheSwitch>
    </>
  )
}

export default RenderSubRoute
