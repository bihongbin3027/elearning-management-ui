import React from 'react'
import RenderSubRoute from '@/components/RenderSubRoute'
import TestQuestions from '@/pages/RegistrarCenter/Paper/TestQuestions/MainList'

const stateValue = {
  tabList: [
    {
      name: '试题管理',
      path: '/test-questions-manage',
      component: TestQuestions,
    },
  ],
}

const PageViews = () => <RenderSubRoute data={stateValue.tabList} />

export default PageViews
