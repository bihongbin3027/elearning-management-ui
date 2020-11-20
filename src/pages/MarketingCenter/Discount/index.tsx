import React from 'react'
import RenderSubRoute from '@/components/RenderSubRoute'
import Discount from '@/pages/MarketingCenter/Discount/Main'

const stateValue = {
  tabList: [
    {
      name: '优惠活动',
      path: '/main',
      component: Discount,
    },
  ],
}

const DiscountActivity = () => <RenderSubRoute data={stateValue.tabList} />

export default DiscountActivity
