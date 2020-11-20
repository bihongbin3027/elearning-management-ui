import React from 'react'
import RenderSubRoute from '@/components/RenderSubRoute'
import MainPage from '@/pages/FinancialCenter/ReceivePayment/Main'

const stateValue = {
  tabList: [
    {
      name: '收款管理',
      path: '/main',
      component: MainPage,
    },
  ],
}

const ReceivePayment = () => <RenderSubRoute data={stateValue.tabList} />

export default ReceivePayment
