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
import Classroom from '@/pages/RegistrarManage/RegistrarSetting/Classroom'

const { TabPane } = Tabs

const stateValue = {
  tabList: [
    {
      name: '教室管理',
      path: '/classroom',
      component: Classroom,
    },
  ],
}

const Subjects = () => {
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
                placeholder="请输入教师名称"
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
        <Redirect to={`${match.path}/classroom`} />
      </Switch>
    </>
  )
}

export default Subjects
