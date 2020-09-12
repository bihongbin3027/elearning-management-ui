import React, { useReducer } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Layout } from 'antd'
import routes from '@/routes'
import { RootStateType } from '@/store/rootReducer'
import { GlobalConstant } from '@/config'
import { ContentStyle } from '@/pages/Layout/Container/style'

const { Content } = Layout

type ReducerType = (state: StateType, action: Action) => StateType
interface Action {
  type: ActionType
  payload: any
}
type StateType = typeof stateValue

enum ActionType {
  SET_CRUMBS_LIST = '[SetCrumbsList Action]',
}

const stateValue = {
  // 面包屑
  crumbsList: [],
}

const ContainerBox = () => {
  const { openSider } = useSelector((state: RootStateType) => state.layout)

  const [state] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_CRUMBS_LIST: // 设置面包屑内容
        return {
          ...state,
          crumbsList: action.payload,
        }
    }
  }, stateValue)

  console.log('面包屑内容', state.crumbsList)

  return (
    <ContentStyle
      style={{
        marginLeft: openSider
          ? GlobalConstant.siderCollapsedWidth
          : GlobalConstant.siderWidth,
      }}
    >
      <Content>
        <div className="site-layout-background">
          <Switch>
            {routes.map((item: any) => {
              return (
                <Route
                  key={item.path}
                  path={item.path}
                  render={(props) => <item.component {...props} />}
                />
              )
            })}
            <Route path="/" exact render={() => <Redirect to="/index" />} />
            <Redirect to="/404" />
          </Switch>
        </div>
      </Content>
    </ContentStyle>
  )
}

export default ContainerBox
