import React from 'react'
import RenderSubRoute from '@/components/RenderSubRoute'
import ClassRoster from '@/pages/StudentCenter/ClassRoster'
import EnrolledStudents from '@/pages/StudentCenter/EnrolledStudents'

const stateValue = {
  tabList: [
    {
      name: '班级花名册',
      path: '/class-roster',
      component: ClassRoster,
    },
    {
      name: '报读学生',
      path: '/enrolled-students',
      component: EnrolledStudents,
    },
  ],
}

const Subjects = () => <RenderSubRoute data={stateValue.tabList} />

export default Subjects
