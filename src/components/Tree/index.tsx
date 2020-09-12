/*
 * @Description 树组件
 * @Author bihongbin
 * @Date 2020-07-29 16:57:40
 * @LastEditors bihongbin
 * @LastEditTime 2020-08-18 15:07:04
 */

import React, {
  useReducer,
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { Tree, Input, message, Row, Col, Modal } from 'antd'
import { TreeProps } from 'antd/es/tree'
import { LockOutlined, UnlockOutlined, DeleteOutlined } from '@ant-design/icons'
import _ from 'lodash'

const { Search } = Input
const { confirm } = Modal

export interface TreeNodeCallType {
  getSelectNode: () => string[]
  getCheckedNode: () => string[]
}

export interface PropTypes {
  data?: TreeType[] // 树结构数据
  searchOpen?: boolean // 是否打开搜索功能
  draggableOpen?: boolean // 是否打开拖拽节点功能
  processOpen?: boolean // 是否打开锁定、解锁、删除功能
  checkedOpen?: boolean // 是否打开复选框功能
  treeConfig?: TreeProps // 支持antd tree组件全部传参
  onSelect?: (data: React.Key[]) => void // 选中节点触发回调
}

export interface TreeType {
  id?: string
  title: string | JSX.Element
  key: string
  isLocked?: boolean // 节点是否锁定
  children?: TreeType[]
}

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateNormal

enum ActionType {
  SET_SEARCH_OPEN = '[SetSearchOpen Action]',
  SET_SEARCH_VALUE = '[SetSearch Action]',
  SET_TREE_LIST = '[SetTreeList Action]',
  SET_DRAGGABLE_OPEN = '[SetDraggableOpen Action]',
  SET_PROCESS_OPEN = '[SetProcessOpen Action]',
  SET_CHECKED_OPEN = '[SetCheckedOpen Action]',
  SET_FIRST_LEVEL_COLLECTION = '[SetFirstLevelCollection Action]',
  SET_EXPANDED_KEYS = '[SetExpandedKeys Action]',
  SET_AUTO_EXPAND_PARENT = '[SetAutoExpandedParent Action]',
  SET_SELECT_NODE = '[SetSelectNode Action]',
  SET_CHECKED_NODE = '[SetCheckedNode Action]',
}

const stateNormal = {
  searchOpen: false, // 是否打开搜索功能（默认打开）
  searchValue: '', // 搜索值
  treeList: [], // 存放树结构数据
  draggableOpen: false, // 是否打开节点拖拽功能（默认打开）
  processOpen: false, // 是否打开锁定、解锁、删除功能（默认打开）
  checkedOpen: false, // 是否打开复选框功能（默认不打开）
  firstLevelCollection: [], // 一级树结构（treeList拆分）
  expandedKeys: [], // 指定展开的节点
  autoExpandParent: false, // 是否自动展开父节点
  selectNode: [], // 当前点击选中的节点
  checkedNode: [], // 复选框选中的节点
}

const TreeNode = (props: PropTypes, ref: any) => {
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_SEARCH_OPEN: // 设置搜索功能是否打开
        return {
          ...state,
          searchOpen: action.payload,
        }
      case ActionType.SET_SEARCH_VALUE: // 设置搜索值
        return {
          ...state,
          searchValue: action.payload,
        }
      case ActionType.SET_TREE_LIST: // 设置树结构数据
        return {
          ...state,
          treeList: action.payload,
        }
      case ActionType.SET_DRAGGABLE_OPEN: // 设置是否打开节点拖拽功能
        return {
          ...state,
          draggableOpen: action.payload,
        }
      case ActionType.SET_PROCESS_OPEN: // 设置是否打开锁定、解锁、删除功能
        return {
          ...state,
          processOpen: action.payload,
        }
      case ActionType.SET_CHECKED_OPEN: // 设置是否打开复选框功能
        return {
          ...state,
          checkedOpen: action.payload,
        }
      case ActionType.SET_FIRST_LEVEL_COLLECTION: // 设置一级树结构（treeList拆分）
        return {
          ...state,
          firstLevelCollection: action.payload,
        }
      case ActionType.SET_EXPANDED_KEYS: // 设置树指定展开的节点
        return {
          ...state,
          expandedKeys: action.payload,
        }
      case ActionType.SET_AUTO_EXPAND_PARENT: // 设置是否自动展开父节点
        return {
          ...state,
          autoExpandParent: action.payload,
        }
      case ActionType.SET_SELECT_NODE: // 设置当前点击选中的节点
        return {
          ...state,
          selectNode: action.payload,
        }
      case ActionType.SET_CHECKED_NODE: //设置当前复选框选中的节点
        return {
          ...state,
          checkedNode: action.payload,
        }
      default:
        return state
    }
  }, stateNormal)

  /**
   * @Description 一级树结构（treeList拆分）
   * @Author bihongbin
   * @Date 2020-07-30 14:20:54
   */
  const generateList = useCallback((data: TreeType[]): void => {
    const arr: TreeType[] = []
    const eachData = (_data: TreeType[]) => {
      for (let i = 0; i < _data.length; i++) {
        const node = _data[i]
        arr.push(_data[i])
        if (node.children) {
          eachData(node.children)
        }
      }
    }
    eachData(data)
    dispatch({
      type: ActionType.SET_FIRST_LEVEL_COLLECTION,
      payload: arr,
    })
  }, [])

  /**
   * @Description 拖拽触发时调用
   * @Author bihongbin
   * @Date 2020-07-30 15:17:58
   */
  const handleDrop = useCallback(
    (info: any) => {
      const dropKey = info.node.key
      const dragKey = info.dragNode.key
      const dropPos = info.node.pos.split('-')
      const dropPosition =
        info.dropPosition - Number(dropPos[dropPos.length - 1])
      const loop = (data: any, key: string, callback: any) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].key === key) {
            return callback(data[i], i, data)
          }
          if (data[i].children) {
            loop(data[i].children, key, callback)
          }
        }
      }
      if (info.dragNode.isLocked) {
        message.warn('当前节点已锁定', 1.5)
        return
      }
      const data = [...state.treeList]
      // 找到拖拽对象
      let dragObj: TreeType = {
        title: '',
        key: '',
      }
      loop(data, dragKey, (item: TreeType, index: number, arr: TreeType[]) => {
        arr.splice(index, 1)
        dragObj = item
      })
      if (!info.dropToGap) {
        // 放下内容
        loop(data, dropKey, (item: TreeType) => {
          item.children = item.children || []
          // 示例添加到尾部，可以是随意位置
          item.children.push(dragObj)
        })
      } else if (
        (info.node.children || []).length > 0 && // 有子级
        info.node.expanded && // 扩大
        dropPosition === 1 // 在底部间隙
      ) {
        loop(data, dropKey, (item: TreeType) => {
          item.children = item.children || []
          // 示例添加到头部，可以是随意位置
          item.children.unshift(dragObj)
        })
      } else {
        let ar: TreeType[] = []
        let i = 0
        loop(
          data,
          dropKey,
          (item: TreeType, index: number, arr: TreeType[]) => {
            ar = arr
            i = index
          },
        )
        if (dropPosition === -1) {
          ar.splice(i, 0, dragObj)
        } else {
          ar.splice(i + 1, 0, dragObj)
        }
      }
      dispatch({
        type: ActionType.SET_TREE_LIST,
        payload: data,
      })
    },
    [state.treeList],
  )

  /**
   * @Description 选择树节点
   * @Author bihongbin
   * @Date 2020-07-30 13:47:29
   */
  const handleSelectTreeNode = useCallback(
    (selectedKeys: React.Key[]): void => {
      if (_.isArray(selectedKeys)) {
        // 设置当前点击选中的节点
        dispatch({
          type: ActionType.SET_SELECT_NODE,
          payload: selectedKeys,
        })
        if (props.onSelect) {
          props.onSelect(selectedKeys)
        }
      }
    },
    [props],
  )

  /**
   * @Description 展开树节点
   * @Author bihongbin
   * @Date 2020-07-30 13:49:01
   */
  const handleExpandTreeNode = useCallback(
    (expandedKeys: React.Key[]): void => {
      // 设置树不展开
      dispatch({
        type: ActionType.SET_AUTO_EXPAND_PARENT,
        payload: false,
      })
      // 设置树需要展开的节点
      dispatch({
        type: ActionType.SET_EXPANDED_KEYS,
        payload: expandedKeys,
      })
    },
    [],
  )

  /**
   * @Description 获取父级节点key
   * @Author bihongbin
   * @Date 2020-07-30 11:49:20
   */
  const getParentKey = useCallback((key: string, tree: TreeType[]):
    | string
    | undefined => {
    let parentKey
    for (let i = 0; i < tree.length; i++) {
      const node = tree[i]
      if (node.children) {
        if (node.children.some((item: TreeType) => item.key === key)) {
          parentKey = node.key
        } else if (getParentKey(key, node.children)) {
          parentKey = getParentKey(key, node.children)
        }
      }
    }
    return parentKey
  }, [])

  /**
   * @Description 搜索树节点
   * @Author bihongbin
   * @Date 2020-07-30 10:29:25
   */
  const searchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target
      const _expandedKeys = state.firstLevelCollection
        .map((item: TreeType) => {
          let t = item.title as string
          if (t.indexOf(value) > -1) {
            return getParentKey(item.key, state.treeList)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      // 设置搜索的值
      dispatch({
        type: ActionType.SET_SEARCH_VALUE,
        payload: value,
      })
      // 设置树需要展开的节点
      dispatch({
        type: ActionType.SET_EXPANDED_KEYS,
        payload: _expandedKeys,
      })
      // 设置树自动展开
      dispatch({
        type: ActionType.SET_AUTO_EXPAND_PARENT,
        payload: true,
      })
    },
    [getParentKey, state.firstLevelCollection, state.treeList],
  )

  /**
   * @Description 节点锁定
   * @Author bihongbin
   * @Date 2020-07-30 17:22:27
   */
  const handleLock = useCallback((item: TreeType) => {
    confirm({
      title: '提示',
      content: '确定锁定吗？',
      centered: true,
      onOk() {},
    })
  }, [])

  /**
   * @Description 节点解锁
   * @Author bihongbin
   * @Date 2020-07-30 17:22:54
   */
  const handleUnLock = useCallback((item: TreeType) => {
    confirm({
      title: '提示',
      content: '确定解锁吗？',
      centered: true,
      onOk() {},
    })
  }, [])

  /**
   * @Description 节点删除
   * @Author bihongbin
   * @Date 2020-07-30 17:24:27
   */
  const handleDelete = useCallback((item: TreeType) => {
    if (item.isLocked) {
      message.warn('当前节点已锁定', 1.5)
      return
    }
    confirm({
      title: '提示',
      content: '确定删除吗？',
      centered: true,
      onOk() {},
    })
  }, [])

  /**
   * @Description 点击复选框触发
   * @Author bihongbin
   * @Date 2020-07-31 09:14:36
   */
  const handleCheckNode = useCallback((checked) => {
    // 设置复选框选中的值
    dispatch({
      type: ActionType.SET_CHECKED_NODE,
      payload: checked,
    })
  }, [])

  /**
   * @Description 渲染最终树结构
   * @Author bihongbin
   * @Date 2020-07-30 11:22:02
   */
  const loopTree = useCallback(
    (data: TreeType[]): TreeType[] => {
      return data.map((item) => {
        const t = item.title as string
        const index = t.indexOf(state.searchValue)
        const beforeStr = t.substr(0, index)
        const afterStr = t.substr(index + state.searchValue.length)
        const handleHtml = (
          <>
            {item.isLocked ? (
              <LockOutlined title="已锁定" onClick={() => handleUnLock(item)} />
            ) : (
              <UnlockOutlined title="已启用" onClick={() => handleLock(item)} />
            )}
            <DeleteOutlined
              className="ml-2"
              title="删除"
              onClick={() => handleDelete(item)}
            />
          </>
        )
        const title =
          index > -1 ? (
            <Row justify="space-between" align="middle">
              <Col>
                {beforeStr}
                <span className="text-error">{state.searchValue}</span>
                {afterStr}
              </Col>
              {props.processOpen ? (
                <Col className="tree-handle-box">{handleHtml}</Col>
              ) : null}
            </Row>
          ) : (
            <Row justify="space-between" align="middle">
              <Col>{item.title}</Col>
              {props.processOpen ? (
                <Col className="tree-handle-box">{handleHtml}</Col>
              ) : null}
            </Row>
          )
        if (item.children) {
          return {
            ...item,
            title,
            children: loopTree(item.children),
          }
        }
        return {
          ...item,
          title,
        }
      })
    },
    [
      handleDelete,
      handleLock,
      handleUnLock,
      props.processOpen,
      state.searchValue,
    ],
  )

  /**
   * @Description 暴漏组件方法给父级
   * @Author bihongbin
   * @Date 2020-08-04 15:35:55
   */
  useImperativeHandle<any, TreeNodeCallType>(ref, () => ({
    // 获取当前点击选中的节点
    getSelectNode: () => state.selectNode,
    // 获取复选框选中的节点
    getCheckedNode: () => state.checkedNode,
  }))

  /**
   * @Description 树结构数据赋值
   * @Author bihongbin
   * @Date 2020-07-31 15:57:46
   */
  useEffect(() => {
    if (_.isArray(props.data)) {
      // 设置树结构数据
      dispatch({
        type: ActionType.SET_TREE_LIST,
        payload: props.data,
      })
      // 一级树结构（treeList拆分）
      generateList(props.data)
    }
  }, [generateList, props.data])

  /**
   * @Description 打开或关闭一些默认功能
   * @Author bihongbin
   * @Date 2020-07-31 15:57:57
   */
  useEffect(() => {
    // 打开搜索功能
    if (props.searchOpen) {
      dispatch({
        type: ActionType.SET_SEARCH_OPEN,
        payload: props.searchOpen,
      })
    }
    // 打开拖拽功能
    if (props.draggableOpen) {
      dispatch({
        type: ActionType.SET_DRAGGABLE_OPEN,
        payload: props.draggableOpen,
      })
    }
    // 打开锁定、解锁、删除功能
    if (props.processOpen) {
      dispatch({
        type: ActionType.SET_PROCESS_OPEN,
        payload: props.processOpen,
      })
    }
    // 打开复选框功能
    if (props.checkedOpen) {
      dispatch({
        type: ActionType.SET_CHECKED_OPEN,
        payload: props.checkedOpen,
      })
    }
  }, [
    props.checkedOpen,
    props.draggableOpen,
    props.processOpen,
    props.searchOpen,
  ])

  return (
    <>
      {state.searchOpen ? (
        <Search
          className="mb-5"
          placeholder="输入名称搜索"
          onChange={searchChange}
        />
      ) : null}
      <Tree
        showLine
        blockNode
        checkable={state.checkedOpen}
        treeData={loopTree(state.treeList)}
        expandedKeys={state.expandedKeys}
        autoExpandParent={state.autoExpandParent}
        onSelect={handleSelectTreeNode}
        onExpand={handleExpandTreeNode}
        onCheck={handleCheckNode}
        draggable={state.draggableOpen}
        onDrop={handleDrop}
        onDragEnter={(info) => {
          dispatch({
            type: ActionType.SET_EXPANDED_KEYS,
            payload: info.expandedKeys,
          })
        }}
        {...props.treeConfig}
      />
    </>
  )
}

export default forwardRef(TreeNode)
