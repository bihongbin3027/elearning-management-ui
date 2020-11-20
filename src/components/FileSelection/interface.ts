import { FileItemType } from '@/pages/FileCenter/FileItems'

export interface PropTypes {
  title?: string
  visible: boolean
  width?: number
  mode?: 'modal' // 文件管理模式 modal弹窗模式
  selectedMethod?: 'checkbox' | 'radio' // 弹窗模式下单选还是多选
  openManagement?: boolean // 是否打开管理功能
  fileExt?: string // 指定上传文件类型
  sourceType?: string // 业务来源类型
  onCancel: () => void // 取消
  onConfirm: (data: FileItemType[]) => void // 确定
}
