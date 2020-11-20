import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
import { useSelector } from 'react-redux'
import { Layout } from 'antd'
import { RootStateType } from '@/store/rootReducer'
import { GlobalConstant } from '@/config'
import * as authTypes from '@/store/module/auth/types'
import { ContentStyle } from '@/pages/Layout/Container/style'

// const req = require.context('components', false, /\.(tsx)$/); // 使用这种方法加载下面组件内的动态组件

const { Content } = Layout

const ContainerBox = () => {
  const { authToken, tabLayout, openSider } = useSelector(
    (state: RootStateType) => ({
      ...state.auth,
      ...state.layout,
    }),
  )

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
          <CacheSwitch>
            {!authToken ? (
              <Redirect to="/login" />
            ) : (
              tabLayout.tabList.map(
                (item: authTypes.SetUserMenuPayloadType) => {
                  try {
                    return (
                      <CacheRoute
                        cacheKey={item.navigateUrl}
                        key={item.navigateUrl}
                        path={item.navigateUrl}
                        component={
                          require(`@/pages${item.interfaceRef}`).default
                        }
                      />
                    )
                  } catch (error) {
                    return null
                  }
                },
              )
            )}
            <Route path="/" exact render={() => <Redirect to="/index" />} />
            <Redirect to="/404" />
          </CacheSwitch>
        </div>
      </Content>
    </ContentStyle>
  )
}

export default ContainerBox
