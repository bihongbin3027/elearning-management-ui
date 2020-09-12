import React from 'react'
import {
  Route,
  Switch,
  Redirect,
  useRouteMatch,
  useLocation,
  useHistory,
} from 'react-router-dom'
import { Card, Row, Col, Tabs, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import ClassNotes from '@/pages/RegistrarManage/ClassRegistration/ClassNotes'
import RememberLesson from '@/pages/RegistrarManage/ClassRegistration/RememberLesson'
import MakeUpLessons from '@/pages/RegistrarManage/ClassRegistration/MakeUpLessons'
import ClassHourSummary from '@/pages/RegistrarManage/ClassRegistration/ClassHourSummary'
import TeacherAudition from '@/pages/RegistrarManage/ClassRegistration/TeacherAudition'

const { TabPane } = Tabs

const stateValue = {
  tabList: [
    {
      name: '记上课',
      path: '/remember-lesson',
      component: RememberLesson,
    },
    {
      name: '上课记录',
      path: '/class-notes',
      component: ClassNotes,
    },
    {
      name: '补课管理',
      path: '/make-lessons',
      component: MakeUpLessons,
    },
    {
      name: '课时汇总',
      path: '/class-hour-summary',
      component: ClassHourSummary,
    },
    {
      name: '教师试听',
      path: '/teacher-audition',
      component: TeacherAudition,
    },
  ],
}

const ClassRegistration = () => {
  const match = useRouteMatch()
  const history = useHistory()
  const location = useLocation()

  /**
   * @Description 搜索
   * @Author bihongbin
   * @Date 2020-09-10 16:35:07
   */
  const onSearchText = (e: any) => {
    e.persist()
    console.log(e.target.value)
  }

  return (
    <>
      <Card className="card-header-tabs">
        <Row align="middle" justify="space-between">
          <Col>
            <Tabs
              defaultActiveKey={location.pathname}
              tabBarGutter={60}
              onTabClick={(key) => history.push(key)}
            >
              {stateValue.tabList.map((item) => (
                <TabPane tab={item.name} key={`${match.path}${item.path}`} />
              ))}
            </Tabs>
          </Col>
          <Col className="ant-form form-ash-theme">
            <div className="ant-form-item-control">
              <Input
                className="search-input"
                placeholder="请输入班级/一对一名称"
                prefix={<SearchOutlined />}
                onPressEnter={(e) => onSearchText(e)}
              />
            </div>
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
        <Redirect to={`${match.path}/remember-lesson`} />
      </Switch>
    </>
  )
}

export default ClassRegistration
