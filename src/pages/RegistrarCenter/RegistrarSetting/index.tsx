import React from 'react'
import RenderSubRoute from '@/components/RenderSubRoute'
import Classroom from '@/pages/RegistrarCenter/RegistrarSetting/Classroom'
import StudentAppointmentRule from '@/pages/RegistrarCenter/RegistrarSetting/StudentAppointmentRule'
import EliminationOfClass from '@/pages/RegistrarCenter/RegistrarSetting/EliminationOfClass'
import SignIn from '@/pages/RegistrarCenter/RegistrarSetting/SignIn'
import Holidays from '@/pages/RegistrarCenter/RegistrarSetting/Holidays'

const stateValue = {
  tabList: [
    {
      name: '教室管理',
      path: '/classroom',
      component: Classroom,
    },
    {
      name: '学员预约规则',
      path: '/student-rule',
      component: StudentAppointmentRule,
    },
    {
      name: '消课设置',
      path: '/elimination-class',
      component: EliminationOfClass,
    },
    {
      name: '签到设置',
      path: '/sign',
      component: SignIn,
    },
    {
      name: '节假日设置',
      path: '/holidays',
      component: Holidays,
    },
  ],
}

const Subjects = () => <RenderSubRoute data={stateValue.tabList} />

export default Subjects
