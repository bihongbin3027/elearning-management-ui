import React from 'react'
import RenderSubRoute from '@/components/RenderSubRoute'
import AllForm from '@/pages/MarketingCenter/AdmissionsForm/Main'
import Statistics from '@/pages/MarketingCenter/AdmissionsForm/Statistics'

const stateValue = {
  tabList: [
    {
      name: '全部表单',
      path: '/main',
      component: AllForm,
    },
    {
      visible: true,
      name: '表单统计',
      path: '/statistics',
      component: Statistics,
    },
  ],
}

const AdmissionsForm = () => <RenderSubRoute data={stateValue.tabList} />

export default AdmissionsForm
