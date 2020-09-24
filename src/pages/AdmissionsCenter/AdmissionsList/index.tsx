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
import AdmissionsManage from '@/pages/AdmissionsCenter/AdmissionsList/Manage'

const { TabPane } = Tabs

const stateValue = {
  tabList: [
    {
      name: '招生管理',
      path: '/manage',
      component: AdmissionsManage,
    },
  ],
}

const AdmissionsList = () => {
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
        <Redirect to={`${match.path}/manage`} />
      </Switch>
    </>
  )
}

export default AdmissionsList
