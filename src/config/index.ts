const gatewayField = {
  sibeuaaapi: '/sibeuaaapi',
  sibemanagementapi: '/sibemanagementapi',
  ibfapi: '/ibfapi',
}

// 全局配置
export const GlobalConstant = {
  // node环境变量地址
  baseUrl: process.env.REACT_APP_API_URL,
  gatewayUrl: gatewayField,
  // 默认token
  accessToken: process.env.REACT_APP_TOKEN,
  // http状态码
  codeMessage: {
    '301': '请求的网页已永久移动到新位置',
    '302': '临时性重定向',
    '303': '临时性重定向，且总是使用 GET 请求新的 URI',
    '304': '自从上次请求后，请求的网页未修改过',
    '400':
      '服务器无法理解请求的格式，客户端不应当尝试再次使用相同的内容发起请求',
    '401': '用户没有权限（令牌、用户名、密码错误）',
    '403': '用户得到授权，但是访问是被禁止的。',
    '404': '找不到任何与 URI 相匹配的资源',
    '500': '服务器发生错误，请检查服务器',
    '502': '网关错误',
    '503': '服务不可用，服务器暂时过载或维护',
    '504': '网关超时',
  },
  // 左侧菜单宽度
  siderWidth: 200,
  // 左侧菜单缩小宽度
  siderCollapsedWidth: 80,
  // 分页默认参数
  paginationOptions: {
    total: 10, // 总共多少条
    current: 1, // 当前第几页
    pageSize: 10, // 每页显示多少条数据
  },
  // card头部搜索表单响应式配置
  formSearchColConfig: {
    xs: 24,
    sm: 24,
    md: 12,
    lg: 5,
    xl: 4,
  },
  // 载入账单字段配置上传文件地址
  fieldConfigUploadHttp: `${process.env.REACT_APP_API_URL}${gatewayField.ibfapi}/api/etl/load-config-column/analysis`,
  // 应付账单上传文件地址
  billHdrUploadHttp: `${process.env.REACT_APP_API_URL}${gatewayField.ibfapi}/api/order/bill-hdr/upload`,
}
