import React from 'react'
import RenderSubRoute from '@/components/RenderSubRoute'
import Public from '@/pages/AdmissionsCenter/PublicClues/Public'

const stateValue = {
  tabList: [
    {
      name: '公共线索',
      path: '/pc',
      component: Public,
    },
  ],
}

const PublicClues = () => <RenderSubRoute data={stateValue.tabList} />

export default PublicClues
