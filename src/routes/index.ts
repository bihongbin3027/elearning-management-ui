import Home from '@/pages/Home' // 首页
import Workbench from '@/pages/Workbench' // 工作台
import CommonFunctions from '@/pages/Workbench/CommonFunctions' // 工作台-常用功能
import Notice from '@/pages/Workbench/Notice' // 工作台-通知公告
import FileCenter from '@/pages/FileCenter' // 文件中心
import GoodsManage from '@/pages/OrderCenter/Goods' // 订单中心-商品订单
import ServiceManage from '@/pages/OrderCenter/Service' // 订单中心-服务订单
import CourseCenter from '@/pages/CourseCenter/Course' // 课程中心-课程管理
import SubjectManage from '@/pages/CourseCenter/Subject' // 课程管理-科目管理
import MyClueMainList from '@/pages/AdmissionsCenter/Clue' // 招生中心-我的线索
import PublicCluesMainList from '@/pages/AdmissionsCenter/PublicClues' // 招生中心-公共线索
import AdmissionsManageMainList from '@/pages/AdmissionsCenter/AdmissionsList' // 招生中心-招生管理
import EnterpriseGroupNews from '@/pages/AdmissionsCenter/EnterpriseGroupNews' // 招生中心-企业团报
import ClassesCenter from '@/pages/RegistrarCenter/Classes' // 教务中心-班级管理
import ClassesDetails from '@/pages/RegistrarCenter/Classes/ClassesDetails' // 教务中心-班级管理-班级详情
import ClassRegistration from '@/pages/RegistrarCenter/ClassRegistration' // 教务中心-上课登记
import IntelligentCourse from '@/pages/RegistrarCenter/SchedulingCourse' // 教务中心-智能排课
import RegistrarSetting from '@/pages/RegistrarCenter/RegistrarSetting' // 教务中心-教务设置
import QuestionBankMainList from '@/pages/RegistrarCenter/Paper/QuestionBank' // 教务中心-试卷管理-题库管理
import TestQuestionsMainList from '@/pages/RegistrarCenter/Paper/TestQuestions' // 教务中心-试卷管理-试题管理
import StudentCenter from '@/pages/StudentCenter' // 学员中心-班级花名册
import InstitutionalAccount from '@/pages/FinancialCenter/InstitutionalAccount' // 财务中心-机构账户
import BankCard from '@/pages/FinancialCenter/BankCard' // 财务中心-银行卡管理
import Invoice from '@/pages/FinancialCenter/Invoice' // 财务中心-发票管理
import ReceivePayment from '@/pages/FinancialCenter/ReceivePayment' // 财务中心-收款管理
import Paying from '@/pages/FinancialCenter/Paying' // 财务中心-付款管理
import TransactionRecord from '@/pages/FinancialCenter/TransactionRecord' // 财务中心-交易记录
import FinancialSettings from '@/pages/FinancialCenter/FinancialSettings' // 财务中心-财务设置
import AdmissionsForm from '@/pages/MarketingCenter/AdmissionsForm' // 营销管理-招生表单
import Discount from '@/pages/MarketingCenter/Discount' // 营销管理-优惠活动
import GoodsMainList from '@/pages/GoodsCenter/GoodsList' // 商品中心-商品管理
import GoodsSortMainList from '@/pages/GoodsCenter/GoodsSort' // 商品中心-商品分类
import GoodsGroupMainList from '@/pages/GoodsCenter/GoodsGroup' // 商品中心-商品组
import GoodsLabelMainList from '@/pages/GoodsCenter/GoodsLabel' // 商品中心-标签组
import RoleMainList from '@/pages/SystemManage/AuthorityManagement/Role' // 角色管理
import MenuMainList from '@/pages/SystemManage/AuthorityManagement/Menu' // 菜单管理
import UserMainList from '@/pages/SystemManage/AuthorityManagement/User' // 用户管理
import OrganizationMainList from '@/pages/SystemManage/AuthorityManagement/Organization' // 组织管理
import SystemModuleMainList from '@/pages/SystemManage/AuthorityManagement/SystemModule' // 系统模块
import CompanyMainList from '@/pages/SystemManage/AuthorityManagement/Company' // 公司管理
import BasicPermissionsMainList from '@/pages/SystemManage/AuthorityBasic/Basic' // 基础权限
import DataPermissionsMainList from '@/pages/SystemManage/AuthorityBasic/Data' // 数据权限
import PagePermissionsMainList from '@/pages/SystemManage/AuthorityBasic/Page' // 资源权限
import ParameterConfigMainList from '@/pages/SystemManage/AuthorityBasic/ParameterConfig' // 参数配置
import Page404 from '@/pages/Others/404'

const routes = [
  {
    path: '/index',
    component: Home,
  },
  {
    path: '/workbench',
    component: Workbench,
  },
  {
    path: '/common-functions',
    component: CommonFunctions,
  },
  {
    path: '/notice',
    component: Notice,
  },
  {
    path: '/file-center',
    component: FileCenter,
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
    path: '/course-center',
    component: CourseCenter,
  },
  {
    path: '/subject-manage',
    component: SubjectManage,
  },
  {
    path: '/clue',
    component: MyClueMainList,
  },
  {
    path: '/public-clue',
    component: PublicCluesMainList,
  },
  {
    path: '/admissions',
    component: AdmissionsManageMainList,
  },
  {
    path: '/group-newspaper',
    component: EnterpriseGroupNews,
  },
  {
    path: '/classes-manage',
    component: ClassesCenter,
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
    path: '/student-center',
    component: StudentCenter,
  },
  {
    path: '/institutional/org',
    component: InstitutionalAccount,
  },
  {
    path: '/institutional/bank',
    component: BankCard,
  },
  {
    path: '/institutional/invoice',
    component: Invoice,
  },
  {
    path: '/institutional/receive-payment',
    component: ReceivePayment,
  },
  {
    path: '/institutional/paying',
    component: Paying,
  },
  {
    path: '/institutional/transaction-record',
    component: TransactionRecord,
  },
  {
    path: '/institutional/financial-settings',
    component: FinancialSettings,
  },
  {
    path: '/marketing/form',
    component: AdmissionsForm,
  },
  {
    path: '/marketing/discount',
    component: Discount,
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
