// 全局配色 变量配置参考 https://github.com/ant-design/ant-design-mobile/blob/master/components/style/themes/default.less
export enum ThemesDefault {
  // 文本
  '@color-text' = '#6a717f',
  '@color-text-success' = '#52c41a',
  '@color-text-error' = '#ff4d4f',
  '@color-text-warning' = '#faad14',
  '@color-text-description' = '#6a717f',
  '@color-text-normal' = '#878d99',
  '@color-text-finish' = '#46d49f',
  '@color-text-primary' = '#5860f8',
  '@color-text-primary-hover' = '#828cff',
  '@color-text-secondary' = '#e5eaee',
  '@color-text-secondary-hover' = '#d9e0e6',

  // 边框
  '@color-border-base' = '#e3e5e6',
  '@color-border-default' = '#f0f0f0',
  '@color-border-grey' = '#f2f2f3',
  '@color-border-primary' = '#5860f8',
  '@color-border-primary-hover' = '#828cff',
  '@color-border-warning' = '#faad14',
  '@color-border-finish' = '#46d49f',
  '@border-radius-base' = '8px',

  // 背景
  '@color-bg-skin' = '#001529',
  '@color-bg-thumb' = '#878d99',
  '@color-bg-track' = '#e3e5e6',
  '@color-bg-grey' = '#f2f2f3',
  '@color-bg-dark-grey' = '#ced1d7',
  '@color-bg-disabled' = '#e5e5e5',
  '@color-bg-warning' = '#faad14',
  '@color-bg-yellow' = '#fdca40',
  '@color-bg-yellow-hover' = '#ffd35c',
  '@color-bg-error' = '#ff4d4f',
  '@color-bg-error-hover' = '#ff6769',
  '@color-bg-finish' = '#46d49f',
  '@color-bg-finish-hover' = '#3ad098',
  '@color-bg-light-red' = '#feefee',
  '@color-bg-light-red-hover' = '#fbe7e6',
  '@color-bg-primary' = '#5860f8',
  '@color-bg-primary-hover' = '#828cff',
  '@color-bg-light-blue' = '#efeffe',
  '@color-bg-light-blue-hover' = '#e6e6f7',
  '@color-bg-light-green' = '#ecfaf5',
  '@color-bg-light-green-hover' = '#dcf5eb',
  '@color-bg-pale-yellow' = '#fffae5',
  '@color-bg-pale-yellow-hover' = '#f9f3d9',
}

export type ThemesDefaultType = {
  theme: typeof ThemesDefault
}
