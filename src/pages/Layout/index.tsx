import React from 'react'
import { Layout } from 'antd'
import HeaderBox from '@/pages/Layout/Header' // 页面头部
import SiderBox from '@/pages/Layout/Sider' // 页面左侧菜单
import ContentBox from '@/pages/Layout/Container' // 页面主内容

const LayoutBox = () => {
  return (
    <Layout>
      <SiderBox />
      <HeaderBox />
      <ContentBox />
    </Layout>
  )
}

export default LayoutBox
