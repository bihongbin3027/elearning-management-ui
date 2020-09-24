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
import Classroom from '@/pages/RegistrarCenter/RegistrarSetting/Classroom'
import StudentAppointmentRule from '@/pages/RegistrarCenter/RegistrarSetting/StudentAppointmentRule'
import EliminationOfClass from '@/pages/RegistrarCenter/RegistrarSetting/EliminationOfClass'
import SignIn from '@/pages/RegistrarCenter/RegistrarSetting/SignIn'
import Holidays from '@/pages/RegistrarCenter/RegistrarSetting/Holidays'

const { TabPane } = Tabs

const stateValue = {
  tabList: [
    {
      name: '教室管理',
      path: '/classroom',
      component: Classroom,
    },
    {
      name: '学员预约规则',
      path: '/student-rule',
      component: StudentAppointmentRule,
    },
    {
      name: '消课设置',
      path: '/elimination-class',
      component: EliminationOfClass,
    },
    {
      name: '签到设置',
      path: '/sign',
      component: SignIn,
    },
    {
      name: '节假日设置',
      path: '/holidays',
      component: Holidays,
    },
  ],
}

const Subjects = () => {
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
        <Redirect to={`${match.path}/classroom`} />
      </Switch>
    </>
  )
}

export default Subjects
