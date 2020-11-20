import React from 'react'
import RenderSubRoute from '@/components/RenderSubRoute'
import Check from '@/pages/FinancialCenter/BankCard/Main'

const stateValue = {
  tabList: [
    {
      name: '银行卡管理',
      path: '/main',
      component: Check,
    },
  ],
}

const BankCard = () => <RenderSubRoute data={stateValue.tabList} />

export default BankCard
