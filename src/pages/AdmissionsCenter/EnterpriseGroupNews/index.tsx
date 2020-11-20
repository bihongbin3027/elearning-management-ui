import React from 'react'
import RenderSubRoute from '@/components/RenderSubRoute'
import MainList from '@/pages/AdmissionsCenter/EnterpriseGroupNews/MainList'

const stateValue = {
  tabList: [
    {
      name: '企业团报',
      path: '/main-list',
      component: MainList,
    },
  ],
}

const EnterpriseGroupNews = () => <RenderSubRoute data={stateValue.tabList} />

export default EnterpriseGroupNews
