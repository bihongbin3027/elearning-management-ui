import React from 'react'
import RenderSubRoute from '@/components/RenderSubRoute'
import WeChat from '@/pages/FinancialCenter/FinancialSettings/WeChat'
import AliPay from '@/pages/FinancialCenter/FinancialSettings/AliPay'
import SetSwitch from '@/pages/FinancialCenter/FinancialSettings/SetSwitch'
import CollectionSwitch from '@/pages/FinancialCenter/FinancialSettings/CollectionSwitch'

const stateValue = {
  tabList: [
    {
      name: '微信账户配置',
      path: '/we-chat',
      component: WeChat,
    },
    {
      name: '支付宝账号配置',
      path: '/ali-pay',
      component: AliPay,
    },
    {
      name: '设置开关',
      path: '/set-switch',
      component: SetSwitch,
    },
    {
      name: '现金收款开关',
      path: '/collection-switch',
      component: CollectionSwitch,
    },
  ],
}

const FinancialSettings = () => <RenderSubRoute data={stateValue.tabList} />

export default FinancialSettings
