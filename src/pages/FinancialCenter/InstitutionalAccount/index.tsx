import React from 'react'
import RenderSubRoute from '@/components/RenderSubRoute'
import Account from '@/pages/FinancialCenter/InstitutionalAccount/Main'

const stateValue = {
  tabList: [
    {
      name: '机构账户',
      path: '/main',
      component: Account,
    },
  ],
}

const InstitutionalAccount = () => <RenderSubRoute data={stateValue.tabList} />

export default InstitutionalAccount
