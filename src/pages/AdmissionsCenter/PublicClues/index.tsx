import React from 'react'
import {
  Route,
  Switch,
  Redirect,
  useRouteMatch,
  useLocation,
  useHistory,
} from 'react-router-dom'
import { Card, Row, Col, Tabs } from 'antd'
import Public from '@/pages/AdmissionsCenter/PublicClues/Public'

const { TabPane } = Tabs

const stateValue = {
  tabList: [
    {
      name: '公共线索',
      path: '/pc',
      component: Public,
    },
  ],
}

const PublicClues = () => {
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
              {stateValue.tabList.map((item) => (
                <TabPane tab={item.name} key={`${match.path}${item.path}`} />
              ))}
            </Tabs>
          </Col>
        </Row>
      </Card>
      <Switch>
        {stateValue.tabList.map((item) => (
          <Route
            exact
            path={`${match.path}${item.path}`}
            component={item.component}
            key={item.path}
          />
        ))}
        <Redirect to={`${match.path}/pc`} />
      </Switch>
    </>
  )
}

export default PublicClues
