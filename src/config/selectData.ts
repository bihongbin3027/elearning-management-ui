// 启用禁用和是否失效状态下拉菜单
export const statusData = [
  { label: '无效', value: '0' },
  { label: '有效', value: '1' },
  { label: '挂起', value: '2' },
]

// 角色分类
export const roleClassData = [
  { label: '常规角色', value: 'ROLE' },
  { label: '用户组', value: 'USERGROUP' },
  { label: '拒绝角色', value: 'DENY' },
]

// 性别
export const genderData = [
  { label: '男', value: '1' },
  { label: '女', value: '2' },
]

// 权限管理-是否保留数据
export const persistFlagData = [
  { label: '否', value: '0' },
  { label: '是', value: '1' },
]

// 权限管理-是否需要认证
export const authFlagData = [
  { label: '无认证', value: '0' },
  { label: '身份认证', value: '1' },
]

// 权限管理-是否公开
export const publicFlagData = [
  { label: '否', value: '0' },
  { label: '是', value: '1' },
]

// 权限管理-是否权限域
export const scopeFlagData = [
  { label: '否', value: '0' },
  { label: '是', value: '1' },
]
