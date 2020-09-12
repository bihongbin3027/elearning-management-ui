import Home from '@/pages/Home' // 首页
import FileManage from '@/pages/FileManage' // 文件管理
import GoodsManage from '@/pages/OrderManage/Goods' // 订单管理-商品订单
import ServiceManage from '@/pages/OrderManage/Service' // 订单管理-服务订单
import CourseManage from '@/pages/CourseManage/Course' // 课程管理-课程管理
import SubjectManage from '@/pages/CourseManage/Subject' // 课程管理-科目管理
import ClassesManage from '@/pages/RegistrarManage/Classes' // 教务管理-班级管理
import ClassesDetails from '@/pages/RegistrarManage/Classes/ClassesDetails' // 教务管理-班级管理-班级详情
import ClassRegistration from '@/pages/RegistrarManage/ClassRegistration' // 教务管理-上课登记
import IntelligentCourse from '@/pages/RegistrarManage/SchedulingCourse' // 教务管理-智能排课
import RegistrarSetting from '@/pages/RegistrarManage/RegistrarSetting' // 教务管理-教务设置
import QuestionBankMainList from '@/pages/PaperManage/QuestionBank' // 试卷管理-题库管理
import TestQuestionsMainList from '@/pages/PaperManage/TestQuestions' // 试卷管理-试题管理
import GoodsMainList from '@/pages/GoodsManage/GoodsList' // 商品管理-商品管理
import GoodsSortMainList from '@/pages/GoodsManage/GoodsSort' // 商品管理-商品分类
import GoodsGroupMainList from '@/pages/GoodsManage/GoodsGroup' // 商品管理-商品组
import GoodsLabelMainList from '@/pages/GoodsManage/GoodsLabel' // 商品管理-标签组
import RoleMainList from '@/pages/SystemManage/AuthorityManagement/Role' // 角色管理
import MenuMainList from '@/pages/SystemManage/AuthorityManagement/Menu' // 菜单管理
import UserMainList from '@/pages/SystemManage/AuthorityManagement/User' // 用户管理
import OrganizationMainList from '@/pages/SystemManage/AuthorityManagement/Organization' // 组织管理
import SystemModuleMainList from '@/pages/SystemManage/AuthorityManagement/SystemModule' // 系统模块
import CompanyMainList from '@/pages/SystemManage/AuthorityManagement/Company' // 公司管理
import BasicPermissionsMainList from '@/pages/SystemManage/AuthorityBasic/Basic' // 基础权限
import DataPermissionsMainList from '@/pages/SystemManage/AuthorityBasic/Data' // 数据权限
import PagePermissionsMainList from '@/pages/SystemManage/AuthorityBasic/Page' // 页面权限
import ParameterConfigMainList from '@/pages/SystemManage/AuthorityBasic/ParameterConfig' // 参数配置
import Page404 from '@/pages/Others/404'

const routes = [
  {
    path: '/index',
    component: Home,
  },
  {
    path: '/file-manage',
    component: FileManage,
  },
  {
    path: '/goods-manage',
    component: GoodsManage,
  },
  {
    path: '/service-manage',
    component: ServiceManage,
  },
  {
    path: '/course-manage',
    component: CourseManage,
  },
  {
    path: '/subject-manage',
    component: SubjectManage,
  },
  {
    path: '/classes-manage',
    component: ClassesManage,
  },
  {
    path: '/classes-details',
    component: ClassesDetails,
  },
  {
    path: '/class-registration',
    component: ClassRegistration,
  },
  {
    path: '/intelligent-course',
    component: IntelligentCourse,
  },
  {
    path: '/registrar-setting',
    component: RegistrarSetting,
  },
  {
    path: '/question-bank-manage',
    component: QuestionBankMainList,
  },
  {
    path: '/test-questions-manage',
    component: TestQuestionsMainList,
  },
  {
    path: '/goods-list',
    component: GoodsMainList,
  },
  {
    path: '/goods-sort',
    component: GoodsSortMainList,
  },
  {
    path: '/goods-group',
    component: GoodsGroupMainList,
  },
  {
    path: '/goods-label',
    component: GoodsLabelMainList,
  },
  {
    path: '/role-main-list',
    component: RoleMainList,
  },
  {
    path: '/menu-main-list',
    component: MenuMainList,
  },
  {
    path: '/user-main-list',
    component: UserMainList,
  },
  {
    path: '/org-main-list',
    component: OrganizationMainList,
  },
  {
    path: '/system-module-main-list',
    component: SystemModuleMainList,
  },
  {
    path: '/company-main-list',
    component: CompanyMainList,
  },
  {
    path: '/basic-auth-main-list',
    component: BasicPermissionsMainList,
  },
  {
    path: '/data-auth-main-list',
    component: DataPermissionsMainList,
  },
  {
    path: '/page-auth-main-list',
    component: PagePermissionsMainList,
  },
  {
    path: '/parameter-config-main-list',
    component: ParameterConfigMainList,
  },
  {
    path: '/404',
    component: Page404,
  },
]

export default routes
