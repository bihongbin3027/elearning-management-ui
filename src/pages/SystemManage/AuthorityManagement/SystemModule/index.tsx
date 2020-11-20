import React from 'react'
import RenderSubRoute from '@/components/RenderSubRoute'
import System from '@/pages/SystemManage/AuthorityManagement/SystemModule/system'
import Module from '@/pages/SystemManage/AuthorityManagement/SystemModule/module'

const stateValue = {
  tabList: [
    {
      name: '系统配置',
      path: '/system-config',
      component: System,
    },
    {
      name: '模块配置',
      path: '/module-config',
      component: Module,
    },
  ],
}

const SystemModule = () => <RenderSubRoute data={stateValue.tabList} />

export default SystemModule
