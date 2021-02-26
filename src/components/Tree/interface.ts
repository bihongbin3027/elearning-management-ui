import { TreeProps } from 'antd/es/tree'
import { AnyObjectType, AjaxResultType, SetRowStateType } from '@/typings'

export interface TreeNodeCallType {
  setLoading: (data: boolean) => void
  getSelectNode: () => React.ReactText[]
  getSelectCurrent: () => TreeType[]
  getCheckedNode: () => string[]
  getCheckedCurrent: () => TreeType[]
  setSelectNode: (data: React.ReactText[]) => void
  setCheckedNode: (data: string[]) => void
}

export interface PropTypes {
  data?: TreeType[] // 树结构数据
  searchOpen?: boolean // 是否打开搜索功能
  draggableOpen?: boolean // 是否打开拖拽节点功能
  processOpen?: boolean // 是否打开锁定、解锁、删除功能
  checkedOpen?: boolean // 是否打开复选框功能
  lockApi?: (data: SetRowStateType) => Promise<AjaxResultType> // 挂起api
  unLockApi?: (data: SetRowStateType) => Promise<AjaxResultType> // 启用api
  deleteApi?: (data: string[]) => Promise<AjaxResultType> // 删除api
  updateCallBack?: (data?: { type?: 'hang' | 'enable' | 'delete' }) => void // 更新树回调(挂起，启用，删除)
  onSelect?: (data: React.Key[], e: AnyObjectType) => void // 选中节点触发回调
  onDropCallBack?: (info: AnyObjectType, data: TreeType[]) => void // 拖拽完成回调
  onVerificationDropCallBack?: (
    info: AnyObjectType,
    data: TreeType[],
  ) => boolean // 验证是否可以拖拽
  treeConfig?: TreeProps // 支持antd tree组件全部传参
}

export interface TreeType {
  id?: string
  title: string | JSX.Element
  key: string
  disabled?: boolean // 禁用
  processOpen?: boolean // 控制单个数据是否打开挂起、启用、删除功能(true关闭)
  noDrag?: boolean // 某个节点是否可以拖拽(true不能拖拽)
  status?: 0 | 1 | 2 // 0-无效,1-有效，2-挂起
  children?: TreeType[]
  [key: string]: any
}
