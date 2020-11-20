import React from 'react'
import RenderSubRoute from '@/components/RenderSubRoute'
import Check from '@/pages/FinancialCenter/Invoice/Main'

const stateValue = {
  tabList: [
    {
      name: '发票管理',
      path: '/main',
      component: Check,
    },
  ],
}

const Invoice = () => <RenderSubRoute data={stateValue.tabList} />

export default Invoice
