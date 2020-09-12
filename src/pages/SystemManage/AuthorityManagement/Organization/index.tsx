import React, { useReducer, useEffect, useRef } from 'react'
import { Button, Divider, message, Avatar, Card } from 'antd'
import TreeNode, { TreeNodeCallType } from '@/components/Tree'
import LayoutTableList, {
  LayoutTableCallType,
  FormListCallType,
} from '@/components/LayoutTableList'
import TableOperate from '@/components/TableOperate'
import LayoutFormModal, {
  LayoutFormModalCallType,
} from '@/components/LayoutFormModal'
import UserListModal from '@/pages/SystemManage/AuthorityManagement/UserListModal'
import IconSelectionModal from '@/pages/SystemManage/AuthorityManagement/IconSelectionModal'
import { handleRowDelete } from '@/utils'
import {
  getBasicQtyList,
  handleBasicQtyList,
  deleteBasicQtyList,
} from '@/api/basicData'

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_ORG_TREE_LIST = '[SetOrgTreeList Action]',
  SET_MIDDLE_EMPTY = '[SetMiddleEmpty Action]',
  SET_ORG_HANDLE_MODAL = '[SetOrgHandleModal Action]',
  SET_ORG_ICON_MODAL = '[SetIconModal Action]',
  SET_CARD_HANDLE_BUTTON_LIST = '[SetCardHandleButtonList Action]',
  SET_ORG_COLUMNS_LIST = '[SetUserCodeColumnsList Action]',
  SET_ORG_USER_MODAL = '[SetOrgUserModal Action]',
}

const stateValue = {
  orgTreeList: [], // 组织架构数据
  middleEmpty: true, // 无数据状态（默认显示）
  // 组织架构新增编辑查看弹窗
  orgHandleModal: {
    visible: false,
    id: '',
    title: '',
    submitApi: handleBasicQtyList,
    formList: [] as FormListCallType[],
  },
  // 组织图标弹窗
  iconModal: {
    visible: false,
    src: '',
  },
  cardHandleButtonList: [], // 部门用户卡片操作按钮
  orgColumnsList: [], // 部门用户列表表头数据
  // 新增部门用户弹窗
  userListModal: {
    visible: false,
    width: 1000,
    title: '部门添加用户',
  },
}

const OrganizationMainList = () => {
  const layoutTableRef = useRef<LayoutTableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const treeNodeRef = useRef<TreeNodeCallType>()
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_ORG_TREE_LIST: // 设置组织架构数据
        return {
          ...state,
          orgTreeList: action.payload,
        }
      case ActionType.SET_MIDDLE_EMPTY: // 设置无数据状态
        return {
          ...state,
          middleEmpty: action.payload,
        }
      case ActionType.SET_ORG_HANDLE_MODAL: // 设置组织架构新增编辑查看弹窗数据
        return {
          ...state,
          orgHandleModal: {
            ...state.orgHandleModal,
            ...action.payload,
          },
        }
      case ActionType.SET_ORG_ICON_MODAL: // 设置组织图标弹窗数据
        return {
          ...state,
          iconModal: {
            ...state.iconModal,
            ...action.payload,
          },
        }
      case ActionType.SET_CARD_HANDLE_BUTTON_LIST: // 设置部门用户卡片操作按钮数据
        return {
          ...state,
          cardHandleButtonList: action.payload,
        }
      case ActionType.SET_ORG_COLUMNS_LIST: // 设置部门用户列表表头数据
        return {
          ...state,
          orgColumnsList: action.payload,
        }
      case ActionType.SET_ORG_USER_MODAL: // 设置部门用户弹窗数据
        return {
          ...state,
          userListModal: {
            ...state.userListModal,
            ...action.payload,
          },
        }
    }
  }, stateValue)

  /**
   * @Description 基础菜单节点选择
   * @Author bihongbin
   * @Date 2020-08-05 14:48:46
   */
  const handleTreeSelectNode = async (data: React.Key[]) => {
    if (data.length && layoutTableRef.current) {
      // 控制无数据状态
      await dispatch({
        type: ActionType.SET_MIDDLE_EMPTY,
        payload: false,
      })
      layoutTableRef.current.getTableList()
    }
  }

  /**
   * @Description 设置新增编辑查看菜单数据
   * @Author bihongbin
   * @Date 2020-08-04 15:24:35
   */
  const handleOrgState = (data: Partial<StateType['orgHandleModal']>) => {
    dispatch({
      type: ActionType.SET_ORG_HANDLE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置菜单图标弹窗相关
   * @Author bihongbin
   * @Date 2020-08-04 16:52:03
   */
  const handleIconState = (data: Partial<StateType['iconModal']>) => {
    dispatch({
      type: ActionType.SET_ORG_ICON_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置部门用户弹窗数据
   * @Author bihongbin
   * @Date 2020-08-04 17:05:29
   */
  const handleOrgUserState = (data: Partial<StateType['userListModal']>) => {
    dispatch({
      type: ActionType.SET_ORG_USER_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 获取树选中的节点
   * @Author bihongbin
   * @Date 2020-08-04 15:43:13
   */
  const getTreeSelectNode = () => {
    if (treeNodeRef.current) {
      let selectData = treeNodeRef.current.getSelectNode()
      if (!selectData.length) {
        message.warn('请选择节点', 1.5)
        return []
      }
      return selectData
    }
    return []
  }

  /**
   * @Description 新增组织
   * @Author bihongbin
   * @Date 2020-08-06 10:33:15
   */
  const handleAddMenu = () => {
    let selectData = getTreeSelectNode()
    if (selectData.length) {
      handleOrgState({
        id: '',
        visible: true,
        title: '新增组织',
      })
    }
  }

  /**
   * @Description 编辑组织
   * @Author bihongbin
   * @Date 2020-08-06 10:33:23
   */
  const handleEditMenu = () => {
    let selectData = getTreeSelectNode()
    if (selectData.length) {
      handleOrgState({
        id: '123',
        visible: true,
        title: '编辑组织',
      })
    }
  }

  /**
   * @Description 设置基础菜单数据
   * @Author bihongbin
   * @Date 2020-08-03 16:59:37
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_ORG_TREE_LIST,
      payload: [
        {
          title: '华旅云创科技有限公司',
          key: '0-0',
          isLocked: false,
          children: [
            {
              title: '研发部',
              key: '0-0-1',
              isLocked: false,
              children: [
                {
                  title: '技术组',
                  key: '0-0-1-0',
                  isLocked: false,
                },
                {
                  title: '运维组',
                  key: '0-0-1-1',
                  isLocked: true,
                },
                {
                  title: '测试组',
                  key: '0-0-1-2',
                  isLocked: false,
                },
              ],
            },
            {
              title: '销售部',
              key: '0-0-2',
              isLocked: false,
            },
          ],
        },
        {
          title: '森鑫源实业发展有限公司',
          key: '0-1',
          isLocked: false,
          children: [
            {
              title: '财务部',
              key: '0-1-1',
              isLocked: false,
              children: [
                {
                  title: '结算部',
                  key: '0-1-1-0',
                  isLocked: false,
                },
                {
                  title: '会计部',
                  key: '0-1-1-1',
                  isLocked: false,
                },
              ],
            },
            {
              title: '人力资源部',
              key: '0-1-2',
              isLocked: false,
            },
          ],
        },
      ],
    })
  }, [])

  /**
   * @Description 设置组织架构新增编辑查看弹窗数据
   * @Author bihongbin
   * @Date 2020-08-06 10:46:54
   */
  useEffect(() => {
    handleOrgState({
      formList: [
        {
          componentName: 'Input',
          name: 'a',
          label: '组织编码',
          placeholder: '请输入组织编码',
          rules: [
            {
              required: true,
              message: '请输入组织编码',
            },
          ],
        },
        {
          componentName: 'Select',
          name: 'b',
          label: '组织类型',
          placeholder: '请选择组织类型',
          selectData: [],
          rules: [
            {
              required: true,
              message: '请选择组织类型',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'c',
          label: '组织中文名',
          placeholder: '请输入组织中文名',
          rules: [
            {
              required: true,
              message: '请输入组织中文名',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'd',
          label: '组织英文名',
          placeholder: '请输入组织英文名',
          rules: [
            {
              required: true,
              message: '请输入组织英文名',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'e',
          label: '组织中文全称',
          placeholder: '请输入组织中文全称',
          rules: [
            {
              required: true,
              message: '请输入组织中文全称',
            },
          ],
        },
        {
          componentName: 'Input',
          name: 'f',
          label: '组织英文全称',
          placeholder: '请输入组织英文全称',
          rules: [
            {
              required: true,
              message: '请输入组织英文全称',
            },
          ],
        },
        {
          componentName: 'Select',
          name: 'g',
          label: '层级',
          placeholder: '请选择层级',
          selectData: [],
        },
        {
          componentName: 'Input',
          name: 'h',
          label: '排序序号',
          placeholder: '请输入排序序号',
        },
        {
          componentName: 'DatePicker',
          name: 'startTime',
          label: '生效日期',
        },
        {
          componentName: 'DatePicker',
          name: 'endTime',
          label: '失效日期',
        },
        {
          componentName: 'Select',
          name: 'i',
          label: '父级组织',
          placeholder: '请选择父级组织',
          selectData: [],
        },
        {
          componentName: 'Radio',
          name: 'j',
          label: '节点',
          selectData: [
            {
              label: '父节点',
              value: '0',
            },
            {
              label: '子节点',
              value: '1',
            },
          ],
        },
        {
          componentName: 'HideInput',
          name: 'ii',
          label: '组织图标',
          render: () => {
            return (
              <div
                className="mb-5"
                onClick={() => handleIconState({ visible: true })}
              >
                <Avatar
                  className="pointer"
                  src={state.iconModal.src}
                  shape="square"
                  size="large"
                  alt="组织图标"
                />
                <span className="text-desc font-12 ml-2">
                  - 请选择自己心仪的图标
                </span>
              </div>
            )
          },
        },
        {
          componentName: 'Switch',
          name: 'o',
          label: '内部组织开关',
          valuePropName: 'checked',
        },
        {
          componentName: 'TextArea',
          name: 'remark',
          label: '备注',
          rows: 3,
          colProps: { span: 24 },
          placeholder: '请输入备注',
        },
      ],
    })
  }, [state.iconModal.src])

  /**
   * @Description 新增部门用户
   * @Author bihongbin
   * @Date 2020-08-06 11:15:02
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_CARD_HANDLE_BUTTON_LIST,
      payload: [
        {
          name: '新增',
          clickConfirm: () => {
            handleOrgUserState({
              title: '部门添加用户',
              visible: true,
            })
          },
        },
      ],
    })
  }, [])

  /**
   * @Description 设置部门用户列表表头数据
   * @Author bihongbin
   * @Date 2020-08-03 18:19:06
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_ORG_COLUMNS_LIST,
      payload: [
        {
          width: 60,
          title: '序号',
          dataIndex: 'sortSeq',
        },
        {
          title: '用户名',
          dataIndex: 'a',
        },
        {
          title: '工号',
          dataIndex: 'b',
        },
        {
          title: '用户姓名',
          dataIndex: 'c',
        },
        {
          title: '性别',
          dataIndex: 'd',
        },
        {
          title: 'QQ号码',
          dataIndex: 'qq',
        },
        {
          title: '手机号',
          dataIndex: 'phone',
        },
        {
          title: '企业QQ号码',
          dataIndex: 'e',
        },
        {
          title: '部门',
          dataIndex: 'bm',
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 60,
          render: (value: number, record: any) => {
            const operatingData = []
            // 删除权限
            operatingData.push({
              name: '删除',
              onClick: () => {
                if (layoutTableRef.current) {
                  handleRowDelete(
                    [record.id],
                    deleteBasicQtyList,
                    layoutTableRef.current.getTableList,
                  )
                }
              },
              svg: 'table_delete.png',
            })
            return <TableOperate operateButton={operatingData} />
          },
        },
      ],
    })
  }, [])

  return (
    <>
      <LayoutTableList
        ref={layoutTableRef}
        api={getBasicQtyList}
        middleEmpty={state.middleEmpty}
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle="部门用户列表"
        searchRightBtnOpen={false}
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.orgColumnsList,
          size: {
            xs: 24,
            sm: 24,
            xxl: 18,
          },
          tableConfig: {
            scroll: { x: 1200, y: 500 },
          },
        }}
        leftRender={{
          size: {
            xs: 24,
            sm: 24,
            xxl: 6,
          },
          jsx: (
            <Card
              title="组织架构"
              extra={
                <>
                  <Button type="text" onClick={handleAddMenu}>
                    新增
                  </Button>
                  <Divider type="vertical" />
                  <Button type="text" onClick={handleEditMenu}>
                    编辑
                  </Button>
                </>
              }
            >
              <TreeNode
                ref={treeNodeRef}
                searchOpen
                processOpen
                data={state.orgTreeList}
                onSelect={handleTreeSelectNode}
              />
            </Card>
          ),
        }}
      />
      <LayoutFormModal
        ref={layoutFormModalRef}
        onCancel={() => handleOrgState({ visible: false })}
        {...state.orgHandleModal}
      />
      <UserListModal
        onCancel={() => handleOrgUserState({ visible: false })}
        {...state.userListModal}
      />
      <IconSelectionModal
        {...state.iconModal}
        onCancel={() => handleIconState({ visible: false })}
        onConfirm={(item) => {
          layoutFormModalRef.current?.setFormValues({
            ii: item.src,
          })
          handleIconState({
            visible: false,
            src: item.src,
          })
        }}
      />
    </>
  )
}

export default OrganizationMainList
