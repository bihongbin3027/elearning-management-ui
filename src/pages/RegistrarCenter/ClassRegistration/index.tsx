import React from 'react'
import RenderSubRoute from '@/components/RenderSubRoute'
import ClassNotes from '@/pages/RegistrarCenter/ClassRegistration/ClassNotes'
import RememberLesson from '@/pages/RegistrarCenter/ClassRegistration/RememberLesson'
import MakeUpLessons from '@/pages/RegistrarCenter/ClassRegistration/MakeUpLessons'
import ClassHourSummary from '@/pages/RegistrarCenter/ClassRegistration/ClassHourSummary'
import TeacherAudition from '@/pages/RegistrarCenter/ClassRegistration/TeacherAudition'

const stateValue = {
  tabList: [
    {
      name: '记上课',
      path: '/remember-lesson',
      component: RememberLesson,
    },
    {
      name: '上课记录',
      path: '/class-notes',
      component: ClassNotes,
    },
    {
      name: '补课管理',
      path: '/make-lessons',
      component: MakeUpLessons,
    },
    {
      name: '课时汇总',
      path: '/class-hour-summary',
      component: ClassHourSummary,
    },
    {
      name: '教师试听',
      path: '/teacher-audition',
      component: TeacherAudition,
    },
  ],
}

const ClassRegistration = () => <RenderSubRoute data={stateValue.tabList} />

export default ClassRegistration
