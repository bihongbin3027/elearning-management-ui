/*
 * @Description 全局常用配置，配置的参数为不可改变的，当你需要的参数可能改变，不要写在config里面，会和路由缓存组件功能产生一些不易察觉的问题
 * @Author bihongbin
 * @Date 2020-08-18 18:37:48
 * @LastEditors bihongbin
 * @LastEditTime 2020-11-16 11:06:25
 */

const rootConfig = require('../../public/rootConfig.json')

// 全局配置
export const GlobalConstant = {
  // node环境变量地址
  baseUrl: rootConfig.REACT_APP_API_URL,
  // 左侧菜单宽度
  siderWidth: 200,
  // 左侧菜单缩小宽度
  siderCollapsedWidth: 80,
  // card头部搜索表单响应式配置
  formSearchColConfig: {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 5,
    xl: 4,
  },
  // 正则验证
  regular: {
    iPhone: /^[1][3,4,5,7,8,9][0-9]{9}$/, // 手机号
    email: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/, // 邮箱
  },
  // 菜单code
  menuPermissionsCode: {
    // 系统管理
    systemManagement: {
      systemConfig: {
        name: '系统配置',
        code: 'RBAC_SYS_SYSTEM_CONFIG',
      },
      moduleConfig: {
        name: '模块配置',
        code: 'RBAC_SYS_MODULE_CONFIG',
      },
      orgDepartmentUsers: {
        name: '组织管理-部门用户列表',
        code: 'RBAC_ORG_MRG_USER',
      },
    },
  },
  // 按钮权限
  buttonPermissions: {
    // 基本
    basic: {
      ADD: 'ADD', // 新增
      EDIT: 'EDIT', // 编辑
      DELETE: 'DELETE', // 删除
      QUERY: 'QUERY', // 查询
      ENABLEANDSUSPEND: 'ENABLEANDSUSPEND', // 挂起和恢复
      MORE: '	MORE', // 更多
      IMPORT: 'IMPORT', // 导入
      EXPORT: 'EXPORT', // 导出
      ACCREDIT: 'ACCREDIT', // 授权
      VIEW_AUTH: 'VIEW_AUTH', // 查看权限
      AUTHORITY: 'AUTHORITY', // 分配权限
    },
    // 自定义
    customize: {},
  },
  // jsencrypt执行OpenSSL的RSA加密key
  encryptPublicKey:
    '-----BEGIN PUBLIC KEY-----' +
    'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCO+IFV9bc0/s9RZQTnWtMkj2Wu9oNMP2fWSXgCpBWl/hlm/IyZCbV0IikUvYOnb5qyK/YG+grqE36C/1MHyBpxVkYxZ4WsJcJo82meyyklAg4VIOkd6yndLCJcqaBtdapm1v3hBTOXC6L8JXbHbdgoJGxH9u+OoalJckCxjUNbCwIDAQAB' +
    '-----END PUBLIC KEY-----',
  // 文件管理上传文件地址
  fileManageUploadHttp: `${rootConfig.REACT_APP_API_URL}/file/file`,
  // 业财载入账单字段配置上传文件地址-后期删除 // DELETE
  fieldConfigUploadHttp: `${rootConfig.REACT_APP_API_URL}/api/etl/load-config-column/analysis`,
  // 业财应付账单上传文件地址-后期删除 // DELETE
  billHdrUploadHttp: `${rootConfig.REACT_APP_API_URL}/api/order/bill-hdr/upload`,
}
