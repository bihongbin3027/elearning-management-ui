import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { ThemeProvider } from 'styled-components'
import 'moment/locale/zh-cn'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import store, { persistor } from '@/store'
import Layout from '@/pages/Layout'
import Login from '@/pages/Login'
import { ThemesDefault } from '@/style/theme'
import { GlobalStyle } from '@/style'

import ComStyle from '@/style/comStyle'

function App() {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor}>
        <ThemeProvider theme={ThemesDefault}>
          <ConfigProvider locale={zhCN}>
            <GlobalStyle />
            <ComStyle />
            <HashRouter>
              <Switch>
                <Route path="/login" component={Login} />
                <Layout />
              </Switch>
            </HashRouter>
          </ConfigProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  )
}

export default App
