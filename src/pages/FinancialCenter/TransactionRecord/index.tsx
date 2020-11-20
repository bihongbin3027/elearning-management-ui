import React from 'react'
import RenderSubRoute from '@/components/RenderSubRoute'
import MainPage from '@/pages/FinancialCenter/TransactionRecord/Main'

const stateValue = {
  tabList: [
    {
      name: '交易记录',
      path: '/main',
      component: MainPage,
    },
  ],
}

const TransactionRecord = () => <RenderSubRoute data={stateValue.tabList} />

export default TransactionRecord
