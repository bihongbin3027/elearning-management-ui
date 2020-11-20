import React from 'react'
import RenderSubRoute from '@/components/RenderSubRoute'
import MainPage from '@/pages/FinancialCenter/Paying/Main'

const stateValue = {
  tabList: [
    {
      name: '付款管理',
      path: '/main',
      component: MainPage,
    },
  ],
}

const Paying = () => <RenderSubRoute data={stateValue.tabList} />

export default Paying
