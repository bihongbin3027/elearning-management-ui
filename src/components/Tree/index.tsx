/*
 * @Description 树组件
 * @Author bihongbin
 * @Date 2020-07-29 16:57:40
 * @LastEditors bihongbin
 * @LastEditTime 2021-01-20 18:21:26
 */

import React, {
  useEffect,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from 'react'
import { Tree, Input, message, Row, Col, Modal, Empty, Spin } from 'antd'
import _ from 'lodash'
import { SxyIcon } from '@/style/module/icon'
import useSetState from '@/hooks/useSetState'
import {
  TreeNodeCallType,
  PropTypes,
  TreeType,
} from '@/components/Tree/interface'
import { AnyObjectType } from '@/typings'

const { Search } = Input
const { confirm } = Modal

interface StateType {
  loading: boolean
  searchOpen: boolean
  searchValue: string
  treeList: TreeType[]
  draggableOpen: boolean
  processOpen: boolean
  checkedOpen: boolean
  firstLevelCollection: TreeType[]
  expandedKeys: React.ReactText[]
  autoExpandParent: boolean
  selectNode: React.ReactText[]
  selectCurrent: TreeType[]
  checkedNode: string[]
  checkedCurrent: TreeType[]
}

const TreeNode = (props: PropTypes, ref: any) => {
  const [state, setState] = useSetState<StateType>({
    loading: false, // 加载loading
    searchOpen: false, // 是否打开搜索功能（默认打开）
    searchValue: '', // 搜索值
    treeList: [], // 存放树结构数据
    draggableOpen: false, // 是否打开节点拖拽功能（默认打开）
    processOpen: false, // 是否打开挂起、启用、删除功能（默认打开）
    checkedOpen: false, // 是否打开复选框功能（默认不打开）
    firstLevelCollection: [], // 一级树结构（treeList拆分）
    expandedKeys: [], // 指定展开的节点
    autoExpandParent: false, // 是否自动展开父节点
    selectNode: [], // 点击选中的节点key
    selectCurrent: [], // 点击选中的节点数组
    checkedNode: [], // 复选框选中的节点key
    checkedCurrent: [], // 复选框选中的节点数组
  })

  /**
   * @Description 一级树结构（treeList拆分）
   * @Author bihongbin
   * @Date 2020-07-30 14:20:54
   */
  const generateList = useCallback(
    (data: TreeType[]): void => {
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
      setState({
        firstLevelCollection: arr,
      })
    },
    [setState],
  )

  /**
   * @Description 拖拽触发时调用
   * @Author bihongbin
   * @Date 2020-07-30 15:17:58
   */
  const handleDrop = (info: AnyObjectType) => {
    const dropKey = info.node.key
    const dragKey = info.dragNode.key
    const dropPos = info.node.pos.split('-')
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1])
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
    // 父级传入的拖拽验证
    if (
      props.onVerificationDropCallBack &&
      props.onVerificationDropCallBack(info, state.treeList)
    ) {
      return
    }
    // 当节点noDrag=true，不允许修改
    if (info.dragNode.noDrag) {
      message.warn('此节点不支持修改', 1.5)
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
      loop(data, dropKey, (item: TreeType, index: number, arr: TreeType[]) => {
        ar = arr
        i = index
      })
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj)
      } else {
        ar.splice(i + 1, 0, dragObj)
      }
    }
    // 推拽完成以后回调
    if (props.onDropCallBack) {
      props.onDropCallBack(info, data)
    }
    setState({
      treeList: data,
    })
  }

  /**
   * @Description 选择树节点
   * @Author bihongbin
   * @Date 2020-07-30 13:47:29
   */
  const handleSelectTreeNode = useCallback(
    (selectedKeys: React.Key[], e: AnyObjectType): void => {
      if (_.isArray(selectedKeys)) {
        // 设置当前点击选中的节点key
        setState({
          selectNode: selectedKeys,
        })
        if (props.onSelect) {
          props.onSelect(selectedKeys, e)
        }
      }
    },
    [props, setState],
  )

  /**
   * @Description 展开树节点
   * @Author bihongbin
   * @Date 2020-07-30 13:49:01
   */
  const handleExpandTreeNode = useCallback(
    (expandedKeys: React.Key[]): void => {
      setState({
        autoExpandParent: false, // 设置树不展开
        expandedKeys: expandedKeys, // 设置树需要展开的节点
      })
    },
    [setState],
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
      setState({
        searchValue: value, // 设置搜索的值
        expandedKeys: _expandedKeys as React.ReactText[], // 设置树需要展开的节点
        autoExpandParent: true, // 设置树自动展开
      })
    },
    [getParentKey, setState, state.firstLevelCollection, state.treeList],
  )

  /**
   * @Description 节点挂起
   * @Author bihongbin
   * @Date 2020-07-30 17:22:27
   */
  const handleLock = useCallback(
    (item: TreeType) => {
      confirm({
        title: '提示',
        width: 360,
        className: 'confirm-modal',
        content: '确定挂起吗？',
        centered: true,
        onOk() {
          return new Promise(async (resolve, reject) => {
            try {
              if (props.lockApi && item.id) {
                await props.lockApi({
                  ids: [item.id],
                  type: 'pending',
                })
                props.updateCallBack && props.updateCallBack({ type: 'hang' }) // 回调
                message.success('挂起成功', 1.5)
                resolve(true)
              }
            } catch (error) {
              reject(new Error('挂起失败'))
            }
          })
        },
      })
    },
    [props],
  )

  /**
   * @Description 节点启用
   * @Author bihongbin
   * @Date 2020-07-30 17:22:54
   */
  const handleUnLock = useCallback(
    (item: TreeType) => {
      confirm({
        title: '提示',
        width: 360,
        className: 'confirm-modal',
        content: '确定启用吗？',
        centered: true,
        onOk() {
          return new Promise(async (resolve, reject) => {
            try {
              if (props.unLockApi && item.id) {
                await props.unLockApi({
                  ids: [item.id],
                  type: 'recover',
                })
                props.updateCallBack && props.updateCallBack({ type: 'enable' }) // 回调
                message.success('启用成功', 1.5)
                resolve(true)
              }
            } catch (error) {
              reject(new Error('启用失败'))
            }
          })
        },
      })
    },
    [props],
  )

  /**
   * @Description 节点删除
   * @Author bihongbin
   * @Date 2020-07-30 17:24:27
   */
  const handleDelete = useCallback(
    (item: TreeType) => {
      if (item.status === 2) {
        message.warn('当前节点已挂起', 1.5)
        return
      }
      if (parseInt(item.allowDelete) === 0) {
        message.warn('该节点不允许删除', 1.5)
        return
      }
      confirm({
        title: '提示',
        width: 360,
        className: 'confirm-modal',
        content: '确定删除吗？',
        centered: true,
        onOk() {
          return new Promise(async (resolve, reject) => {
            try {
              if (props.deleteApi && item.id) {
                await props.deleteApi([item.id])
                props.updateCallBack && props.updateCallBack({ type: 'delete' }) // 回调
                message.success('删除成功', 1.5)
                resolve(true)
              }
            } catch (error) {
              reject(new Error('删除失败'))
            }
          })
        },
      })
    },
    [props],
  )

  /**
   * @Description 点击复选框触发
   * @Author bihongbin
   * @Date 2020-07-31 09:14:36
   */
  const handleCheckNode = useCallback(
    (checked) => {
      // 设置复选框选中的key
      setState({
        checkedNode: checked.checked || checked,
      })
    },
    [setState],
  )

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
        const beforeStr = t.substr(0, index) // 用来区分搜索结果的数据
        const afterStr = t.substr(index + state.searchValue.length) // 用来区分搜索结果的数据
        const handleHtml = (
          <>
            {item.status === 1 && props.lockApi ? (
              <SxyIcon
                width={20}
                height={20}
                name="icon_list_unlock.png"
                title="点击挂起"
                onClick={(e) => {
                  e.stopPropagation()
                  handleLock(item)
                }}
              />
            ) : null}
            {item.status === 2 && props.unLockApi ? (
              <SxyIcon
                width={20}
                height={20}
                name="icon_list_lock.png"
                title="点击启用"
                onClick={(e) => {
                  e.stopPropagation()
                  handleUnLock(item)
                }}
              />
            ) : null}
            {props.deleteApi ? (
              <SxyIcon
                width={20}
                height={20}
                name="icon_list_delete.png"
                title="删除"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDelete(item)
                }}
              />
            ) : null}
          </>
        )
        // 是否显示右侧操作按钮
        const isRightButton =
          props.processOpen && !item.processOpen && !item.disabled
        const title =
          index > -1 ? (
            <Row justify="space-between" align="middle">
              <Col>
                {beforeStr}
                <span className="text-error">{state.searchValue}</span>
                {afterStr}
              </Col>
              {isRightButton ? (
                <Col className="tree-handle-box">{handleHtml}</Col>
              ) : null}
            </Row>
          ) : (
            <Row justify="space-between" align="middle">
              <Col>{item.title}</Col>
              {isRightButton ? (
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
      props.deleteApi,
      props.lockApi,
      props.processOpen,
      props.unLockApi,
      state.searchValue,
    ],
  )

  /**
   * @Description 复选框选中节点更新的时候(checkedNode)，同步到复选框选中的数组(checkedCurrent)
   * @Author bihongbin
   * @Date 2020-10-19 18:53:49
   */
  useEffect(() => {
    const deep = (data: TreeType[]) => {
      let arr: TreeType[] = []
      const getDeep = (data: TreeType[]) => {
        for (let item of data) {
          if (state.checkedNode.some((i) => i === item.key)) {
            arr.push(item)
          }
          if (item.children) {
            getDeep(item.children)
          }
        }
      }
      getDeep(data)
      return arr
    }
    setState({
      checkedCurrent: deep(state.treeList),
    })
  }, [setState, state.checkedNode, state.treeList])

  /**
   * @Description 点击选中节点更新的时候(selectNode)，同步到点击选中的数组(selectCurrent)
   * @Author bihongbin
   * @Date 2020-10-19 18:58:42
   */
  useEffect(() => {
    const deep = (data: TreeType[]) => {
      let arr: TreeType[] = []
      const getDeep = (data: TreeType[]) => {
        for (let item of data) {
          if (state.selectNode.some((i) => i === item.key)) {
            arr.push(item)
          }
          if (item.children) {
            getDeep(item.children)
          }
        }
      }
      getDeep(data)
      return arr
    }
    setState({
      selectCurrent: deep(state.treeList),
    })
  }, [setState, state.selectNode, state.treeList])

  /**
   * @Description 暴漏组件方法给父级
   * @Author bihongbin
   * @Date 2020-08-04 15:35:55
   */
  useImperativeHandle<any, TreeNodeCallType>(ref, () => ({
    // 设置loading
    setLoading: (data) => {
      setState({
        loading: data,
      })
    },
    // 获取当前点击选中的节点key
    getSelectNode: () => state.selectNode,
    // 获取当前点击选中的节点数组
    getSelectCurrent: () => state.selectCurrent,
    // 获取复选框选中的节点key
    getCheckedNode: () => state.checkedNode,
    // 获取复选框选中的节点数组
    getCheckedCurrent: () => state.checkedCurrent,
    // 设置当前点击选中的节点
    setSelectNode: (data) => {
      setState({
        selectNode: data,
      })
    },
    // 设置复选框选中的节点
    setCheckedNode: (data) => {
      setState({
        checkedNode: data,
      })
    },
  }))

  /**
   * @Description 树结构数据赋值
   * @Author bihongbin
   * @Date 2020-07-31 15:57:46
   */
  useEffect(() => {
    if (_.isArray(props.data)) {
      // 设置树结构数据
      setState({
        treeList: props.data,
      })
      // 一级树结构（treeList拆分）
      generateList(props.data)
    }
  }, [generateList, props.data, setState])

  /**
   * @Description 打开或关闭一些默认功能
   * @Author bihongbin
   * @Date 2020-07-31 15:57:57
   */
  useEffect(() => {
    let data: AnyObjectType = {}
    // 打开搜索功能
    if (props.searchOpen) {
      data.searchOpen = props.searchOpen
    }
    // 打开拖拽功能
    if (props.draggableOpen) {
      data.draggableOpen = props.draggableOpen
    }
    // 打开挂起、恢复、删除功能
    if (props.processOpen) {
      data.processOpen = props.processOpen
    }
    // 打开复选框功能
    if (props.checkedOpen) {
      data.checkedOpen = props.checkedOpen
    }
    if (Object.keys(data).length) {
      setState(data)
    }
  }, [
    props.checkedOpen,
    props.draggableOpen,
    props.processOpen,
    props.searchOpen,
    setState,
  ])

  return (
    <Spin spinning={state.loading}>
      {state.searchOpen ? (
        <Search
          className="mb-4"
          placeholder="输入名称搜索"
          onChange={searchChange}
        />
      ) : null}
      {state.treeList.length ? (
        <Tree
          blockNode
          height={500}
          showLine={{ showLeafIcon: false }}
          checkable={state.checkedOpen}
          treeData={loopTree(state.treeList)}
          expandedKeys={state.expandedKeys}
          selectedKeys={state.selectNode}
          checkedKeys={state.checkedNode}
          autoExpandParent={state.autoExpandParent}
          onSelect={handleSelectTreeNode}
          onExpand={handleExpandTreeNode}
          onCheck={handleCheckNode}
          draggable={state.draggableOpen}
          onDrop={handleDrop}
          onDragEnter={(info) => {
            setState({
              expandedKeys: info.expandedKeys,
            })
          }}
          {...props.treeConfig}
        />
      ) : (
        <Empty />
      )}
    </Spin>
  )
}

export default React.memo(forwardRef(TreeNode))
