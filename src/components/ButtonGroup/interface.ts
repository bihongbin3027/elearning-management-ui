import { SxyButtonType } from '@/style/module/button'

export interface ButtonGroupListType {
  name: string
  value: string | number
  selected?: boolean
  disabled?: boolean
  [key: string]: any
}

export interface ButtonGroupTypeProps {
  className?: string
  buttonClassName?: string // button的className
  size?: SxyButtonType['size']
  checkType?: 'checkbox' | 'radio' // 单选和多选
  deleteOpen?: boolean // 是否打开删除功能
  data: ButtonGroupListType[] // 按钮组数据
  onChange?: (data: ButtonGroupListType[]) => void
}

export interface ButtonGroupCallType {
  getButtonGroupSelected: () => ButtonGroupListType[]
}
