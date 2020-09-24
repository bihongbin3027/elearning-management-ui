import React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from 'styled-components'
import 'moment/locale/zh-cn'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import store, { persistor } from '@/store'
import Layout from '@/pages/Layout'
import Login from '@/pages/Login' // 旧登录页面
import LoginNew from '@/pages/LoginNew' // 新登录页面

import { ThemesDefault } from '@/style/theme'
import { GlobalStyle } from '@/style'

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider theme={ThemesDefault}>
          <ConfigProvider locale={zhCN}>
            <GlobalStyle />
            <Router>
              <Switch>
                <Route path="/login" component={Login} />
                <Route path="/login-new" component={LoginNew} />
                <Route component={Layout} />
              </Switch>
            </Router>
          </ConfigProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
