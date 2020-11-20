import React from 'react'
import RenderSubRoute from '@/components/RenderSubRoute'
import My from '@/pages/AdmissionsCenter/Clue/My'
import Origin from '@/pages/AdmissionsCenter/Clue/Origin'

const stateValue = {
  tabList: [
    {
      name: '我的线索',
      path: '/my',
      component: My,
    },
    {
      name: '线索来源',
      path: '/origin',
      component: Origin,
    },
  ],
}

const MyClue = () => <RenderSubRoute data={stateValue.tabList} />

export default MyClue
