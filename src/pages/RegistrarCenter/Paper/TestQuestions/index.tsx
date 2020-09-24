import React from 'react'
// import { useSelector } from 'react-redux'
// import { RootStateType } from '@/store/rootReducer'
import RenderChildViews, { RenderPageNode } from '@/routes/ChildPageView'
import TestQuestions from '@/pages/RegistrarCenter/Paper/TestQuestions/MainList'

const PageViews = () => {
  // const { tabLayout } = useSelector(({ auth }: RootStateType) => auth)
  // const pathString = tabLayout.tabList[tabLayout.current].path

  let nodeData: RenderPageNode[] = [
    {
      path: '/test-questions-manage',
      component: TestQuestions,
      exact: true,
    },
  ]

  return <RenderChildViews data={nodeData} />
}

export default PageViews
