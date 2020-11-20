import React from 'react'
import RenderSubRoute from '@/components/RenderSubRoute'
import AdmissionsManage from '@/pages/AdmissionsCenter/AdmissionsList/Manage'

const stateValue = {
  tabList: [
    {
      name: '招生管理',
      path: '/manage',
      component: AdmissionsManage,
    },
  ],
}

const AdmissionsList = () => <RenderSubRoute data={stateValue.tabList} />

export default AdmissionsList
