import React, { useReducer, useRef, useEffect } from 'react'
import { Card, message } from 'antd'
import TreeNode from '@/components/Tree'
import GenerateForm from '@/components/GenerateForm'
import LayoutFormModal, {
  LayoutFormModalCallType,
} from '@/components/LayoutFormModal'
import LayoutTableList, {
  FormFuncCallType,
  FormListCallType,
  LayoutTableCallType,
} from '@/components/LayoutTableList'
import TableOperate from '@/components/TableOperate'
import PermissionsViewModal from '@/pages/SystemManage/AuthorityManagement/PermissionsViewModal'
import AssigningRolesModal from '@/pages/SystemManage/AuthorityManagement/AssigningRolesModal'
import RoleDetailsModal from '@/pages/SystemManage/AuthorityManagement/RoleDetailsModal'
import ResetPasswordModal from '@/pages/SystemManage/AuthorityManagement/ResetPasswordModal'
import { handleRowEnableDisable, handleRowDelete } from '@/utils'
import {
  getBasicQtyList,
  handleBasicQtyList,
  setBasicQtyStatus,
  deleteBasicQtyList,
} from '@/api/basicData'

type ReducerType = (state: StateType, action: Action) => StateType

interface Action {
  type: ActionType
  payload: any
}

type StateType = typeof stateValue

enum ActionType {
  SET_SEARCH_LIST = '[SetSearchList Action]',
  SET_ORG_TREE_LIST = '[SetOrgTreeList Action]',
  SET_MIDDLE_EMPTY = '[SetMiddleEmpty Action]',
  SET_CARD_HANDLE_BUTTON_LIST = '[SetCardHandleButtonList Action]',
  SET_COLUMNS_LIST = '[SetColumnsList Action]',
  SET_USER_HANDLE_MODAL = '[SetUserHandleModal Action]',
  SET_RULE_VIEW_MODAL = '[SetRuleViewModal Action]',
  SET_ASSIGNING_ROLES_MODAL = '[SetAssigningRolesModal Action]',
  SET_ROLE_DETAILS_MODAL = '[SetRoleDetailsModal Action]',
  SET_RESET_PASSWORD_MODAL = '[SetResetPasswordModal Action]',
}

const stateValue = {
  searchList: [] as FormListCallType[], // 头部搜索数据
  orgTreeList: [], // 归属组织数据
  orgCardTitle: '组织/研发部', // 组织卡片标题
  middleEmpty: true, // 无数据状态（默认显示）
  // 组织详情
  orgFormList: [
    {
      componentName: 'Input',
      name: 'a1',
      label: '组织编码',
    },
    {
      componentName: 'Input',
      name: 'b1',
      label: '组织类型',
    },
    {
      componentName: 'Input',
      name: 'c1',
      label: '组织中文名',
    },
    {
      componentName: 'Input',
      name: 'd1',
      label: '组织英文名',
    },
  ] as FormListCallType[],
  cardHandleButtonList: [], // 用户列表卡片操作按钮数据
  columnsList: [], // 表格头数据
  // 新增编辑查看角色弹窗
  userHandleModal: {
    visible: false,
    disable: false,
    id: '',
    title: '',
    submitApi: handleBasicQtyList,
    formList: [] as FormListCallType[],
  },
  // 角色权限视图弹窗
  ruleViewModal: {
    visible: false,
    id: '',
  },
  // 分配角色弹窗
  assigningRolesModal: {
    visible: false,
    width: 640,
    title: '给用户分配角色',
    id: '',
  },
  // 角色详情弹窗
  roleDetailsModal: {
    visible: false,
    width: 640,
    title: '用户角色详情',
    id: '',
  },
  // 重置密码弹窗
  resetPasswordModal: {
    visible: false,
    title: '重置密码',
    id: '',
  },
}

const UserMainList = () => {
  const orgInfoFormRef = useRef<FormFuncCallType>()
  const layoutTableRef = useRef<LayoutTableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const [state, dispatch] = useReducer<ReducerType>((state, action) => {
    switch (action.type) {
      case ActionType.SET_SEARCH_LIST: // 设置头部搜索数据
        return {
          ...state,
          searchList: action.payload,
        }
      case ActionType.SET_ORG_TREE_LIST: // 设置归属组织数据
        return {
          ...state,
          orgTreeList: action.payload,
        }
      case ActionType.SET_MIDDLE_EMPTY: // 设置无数据状态
        return {
          ...state,
          middleEmpty: action.payload,
        }
      case ActionType.SET_CARD_HANDLE_BUTTON_LIST: // 设置用户列表卡片操作按钮数据
        return {
          ...state,
          cardHandleButtonList: action.payload,
        }
      case ActionType.SET_COLUMNS_LIST: // 设置表格头数据
        return {
          ...state,
          columnsList: action.payload,
        }
      case ActionType.SET_USER_HANDLE_MODAL: // 设置新增编辑查看角色弹窗数据
        return {
          ...state,
          userHandleModal: {
            ...state.userHandleModal,
            ...action.payload,
          },
        }
      case ActionType.SET_RULE_VIEW_MODAL: // 设置角色权限视图弹窗数据
        return {
          ...state,
          ruleViewModal: {
            ...state.ruleViewModal,
            ...action.payload,
          },
        }
      case ActionType.SET_ASSIGNING_ROLES_MODAL: // 设置分配角色弹窗数据
        return {
          ...state,
          assigningRolesModal: {
            ...state.assigningRolesModal,
            ...action.payload,
          },
        }
      case ActionType.SET_ROLE_DETAILS_MODAL: // 设置角色详情弹窗数据
        return {
          ...state,
          roleDetailsModal: {
            ...state.roleDetailsModal,
            ...action.payload,
          },
        }
      case ActionType.SET_RESET_PASSWORD_MODAL: // 设置重置密码弹窗数据
        return {
          ...state,
          resetPasswordModal: {
            ...state.resetPasswordModal,
            ...action.payload,
          },
        }
      default:
        return state
    }
  }, stateValue)

  /**
   * @Description 设置新增编辑查看用户弹窗数据
   * @Author bihongbin
   * @Date 2020-08-04 18:04:51
   */
  const handleUserState = (data: Partial<StateType['userHandleModal']>) => {
    dispatch({
      type: ActionType.SET_USER_HANDLE_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 权限查看
   * @Author bihongbin
   * @Date 2020-08-05 14:51:13
   */
  const handlePreviewState = (data: Partial<StateType['ruleViewModal']>) => {
    dispatch({
      type: ActionType.SET_RULE_VIEW_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置分配角色弹窗数据
   * @Author bihongbin
   * @Date 2020-08-05 15:23:54
   */
  const handleAssigningRoleState = (
    data: Partial<StateType['assigningRolesModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_ASSIGNING_ROLES_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置角色详情弹窗数据
   * @Author bihongbin
   * @Date 2020-08-05 17:33:19
   */
  const handleRoleDetailsState = (
    data: Partial<StateType['roleDetailsModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_ROLE_DETAILS_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 设置重置密码弹窗数据
   * @Author bihongbin
   * @Date 2020-08-06 09:30:27
   */
  const handleResetPasswordState = (
    data: Partial<StateType['resetPasswordModal']>,
  ) => {
    dispatch({
      type: ActionType.SET_RESET_PASSWORD_MODAL,
      payload: data,
    })
  }

  /**
   * @Description 归属组织节点选择
   * @Author bihongbin
   * @Date 2020-08-05 14:23:54
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
   * @Description 设置头部表单搜索数据
   * @Author bihongbin
   * @Date 2020-08-04 18:05:34
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_SEARCH_LIST,
      payload: [
        {
          componentName: 'Input',
          name: 'a',
          placeholder: '账号',
        },
        {
          componentName: 'Input',
          name: 'b',
          placeholder: '中英文名',
        },
        {
          componentName: 'Input',
          name: 'c',
          placeholder: 'QQ号码',
        },
        {
          componentName: 'Input',
          name: 'd',
          placeholder: '手机号',
        },
        {
          componentName: 'Select',
          name: 'e',
          placeholder: '状态',
          selectData: [],
        },
        {
          componentName: 'Select',
          name: 'f',
          placeholder: '部门',
          selectData: [],
        },
      ],
    })
  }, [])

  /**
   * @Description 设置归属组织数据
   * @Author bihongbin
   * @Date 2020-08-05 10:17:12
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
   * @Description 设置用户列表卡片操作按钮数据
   * @Author bihongbin
   * @Date 2020-08-05 10:21:10
   */
  useEffect(() => {
    /**
     * @Description 验证是否选择
     * @Author bihongbin
     * @Date 2020-08-05 15:28:08
     */
    const layoutTableVerification = () => {
      let bool = false
      if (layoutTableRef.current) {
        let ids = layoutTableRef.current.getSelectIds()
        if (!ids.length) {
          message.warn('请选择数据', 1.5)
          return bool
        }
        if (ids.length > 1) {
          message.warn('最多只能选个1条', 1.5)
          return bool
        }
        return ids
      }
      return bool
    }
    dispatch({
      type: ActionType.SET_CARD_HANDLE_BUTTON_LIST,
      payload: [
        {
          name: '权限',
          clickConfirm: () => {
            let ids = layoutTableVerification()
            if (ids) {
              handlePreviewState({ visible: true })
            }
          },
        },
        {
          name: '分配',
          clickConfirm: () => {
            let ids = layoutTableVerification()
            if (ids) {
              handleAssigningRoleState({ visible: true })
            }
          },
        },
        {
          name: '新增',
          clickConfirm: (e: any) => {
            handleUserState({
              visible: true,
              disable: false,
              title: '新增用户账号',
            })
          },
        },
        {
          name: '导出',
          clickConfirm: () => {},
        },
      ],
    })
  }, [])

  /**
   * @Description 设置新增编辑查看角色弹窗表单数据
   * @Author bihongbin
   * @Date 2020-08-05 18:14:10
   */
  useEffect(() => {
    handleUserState({
      formList: [
        {
          componentName: 'Input',
          name: 'a11',
          label: '用户名',
          placeholder: '请输入用户名',
          rules: [
            {
              required: true,
              message: '请输入用户名',
            },
          ],
          disabled: state.userHandleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'b11',
          label: '应用级别',
          placeholder: '请选择应用级别',
          selectData: [],
          rules: [
            {
              required: true,
              message: '请选择应用级别',
            },
          ],
          disabled: state.userHandleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'c11',
          label: '手机号码',
          placeholder: '请输入手机号码',
          rules: [
            {
              required: true,
              message: '请输入手机号码',
            },
          ],
          disabled: state.userHandleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'd11',
          label: '邮箱',
          placeholder: '请输入邮箱',
          rules: [
            {
              required: true,
              message: '请输入邮箱',
            },
          ],
          disabled: state.userHandleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'e11',
          label: '用户中文名',
          placeholder: '请输入用户中文名',
          rules: [
            {
              required: true,
              message: '请输入用户中文名',
            },
          ],
          disabled: state.userHandleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'f11',
          label: '用户英文名',
          placeholder: '请输入用户英文名',
          disabled: state.userHandleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'g11',
          label: '排序序号',
          placeholder: '请输入排序序号',
          disabled: state.userHandleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'h11',
          label: '性别',
          placeholder: '请选择性别',
          selectData: [],
          disabled: state.userHandleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'i11',
          label: '工作QQ',
          placeholder: '请输入工作QQ',
          rules: [
            {
              required: true,
              message: '请输入工作QQ',
            },
          ],
          disabled: state.userHandleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'j11',
          label: '工号',
          placeholder: '请输入工号',
          rules: [
            {
              required: true,
              message: '请输入工号',
            },
          ],
          disabled: state.userHandleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'k11',
          label: '设置密码',
          placeholder: '请输入密码',
          rules: [
            {
              required: true,
              message: '请输入密码',
            },
          ],
          disabled: state.userHandleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'l11',
          label: '确认密码',
          placeholder: '请输入确认密码',
          rules: [
            {
              required: true,
              message: '请输入确认密码',
            },
          ],
          disabled: state.userHandleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'startTime',
          label: '生效日期',
          disabled: state.userHandleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'endTime',
          label: '失效日期',
          disabled: state.userHandleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'm11',
          label: '是否首次登录',
          placeholder: '请选择是否首次登录',
          selectData: [],
          disabled: state.userHandleModal.disable,
        },
        {
          componentName: 'Radio',
          name: 'n11',
          label: '是否设为管理员',
          selectData: [
            {
              label: '是',
              value: '0',
            },
            {
              label: '否',
              value: '1',
            },
          ],
          disabled: state.userHandleModal.disable,
        },
        {
          componentName: 'Switch',
          name: 'o11',
          label: '禁用开关',
          valuePropName: 'checked',
          disabled: state.userHandleModal.disable,
        },
        {
          componentName: 'Switch',
          name: 'p11',
          label: '锁定开关',
          valuePropName: 'checked',
          disabled: state.userHandleModal.disable,
        },
        {
          componentName: 'Switch',
          name: 'p12',
          label: '登录设备（是否为多台设备同时登录）',
          valuePropName: 'checked',
          colProps: { span: 24 },
          disabled: state.userHandleModal.disable,
        },
        {
          componentName: 'TextArea',
          name: 'remark',
          label: '备注',
          rows: 3,
          colProps: { span: 24 },
          placeholder: '请输入备注',
          disabled: state.userHandleModal.disable,
        },
      ],
    })
  }, [state.userHandleModal.disable])

  /**
   * @Description 设置用户列表表格头
   * @Author bihongbin
   * @Date 2020-08-05 10:16:41
   */
  useEffect(() => {
    dispatch({
      type: ActionType.SET_COLUMNS_LIST,
      payload: [
        {
          width: 60,
          title: '序号',
          dataIndex: 'sortSeq',
        },
        {
          title: '账号',
          dataIndex: 'a',
        },
        {
          title: '昵称',
          dataIndex: 'b',
        },
        {
          title: '中文名',
          dataIndex: 'c',
        },
        {
          title: '英文',
          dataIndex: 'd',
        },
        {
          title: '级别',
          dataIndex: 'e',
        },
        {
          title: '手机号',
          dataIndex: 'f',
        },
        {
          title: 'QQ号码',
          dataIndex: 'g',
        },
        {
          title: '状态',
          dataIndex: 'h',
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          width: 170,
          render: (value: number, record: any) => {
            const operatingData = []
            // 查看权限
            operatingData.push({
              name: '查看',
              onClick: () => {
                handleUserState({
                  visible: true,
                  disable: true,
                  title: '用户账号详情',
                  id: record.id,
                })
              },
              svg: 'table_see.png',
            })
            // 编辑权限
            operatingData.push({
              name: '编辑',
              onClick: () => {
                handleUserState({
                  visible: true,
                  disable: false,
                  title: '编辑用户账号',
                  id: record.id,
                })
              },
              svg: 'table_edit.png',
            })
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
            // 更多
            operatingData.push({
              name: '更多',
              type: 'more',
              svg: 'table_more.png',
              moreList: [
                {
                  name:
                    (value === 1 && '禁用') ||
                    (value === 2 && '启用') ||
                    '未知',
                  onClick: () => {
                    if (layoutTableRef.current) {
                      handleRowEnableDisable(
                        {
                          id: record.id,
                          status: (value === 1 && 2) || (value === 2 && 1) || 0,
                        },
                        setBasicQtyStatus,
                        layoutTableRef.current.getTableList,
                      )
                    }
                  },
                },
                {
                  name: '重置密码',
                  onClick: () => {
                    handleResetPasswordState({
                      visible: true,
                      id: record.id,
                    })
                  },
                },
                {
                  name: '查看角色',
                  onClick: () => {
                    handleRoleDetailsState({
                      id: record.id,
                      visible: true,
                    })
                  },
                },
              ],
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
        searchFormList={state.searchList}
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle="用户列表"
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.columnsList,
          size: {
            xs: 24,
            sm: 24,
            xxl: 18,
          },
          tableConfig: {
            scroll: { x: 1300, y: 500 },
          },
        }}
        leftRender={{
          size: {
            xs: 24,
            sm: 24,
            xxl: 6,
          },
          jsx: (
            <Card title="归属组织">
              <TreeNode
                searchOpen
                data={state.orgTreeList}
                onSelect={handleTreeSelectNode}
              />
            </Card>
          ),
        }}
        topRender={{
          jsx: (
            <Card className="mb-5" title={state.orgCardTitle}>
              <GenerateForm
                className="form-margin-bottom-none"
                formConfig={{ size: 'large', labelCol: { span: 5 } }}
                rowGridConfig={{ gutter: 60 }}
                colGirdConfig={{
                  span: 12,
                }}
                ref={orgInfoFormRef}
                list={state.orgFormList}
              />
            </Card>
          ),
        }}
      />
      <LayoutFormModal
        ref={layoutFormModalRef}
        onCancel={() => handleUserState({ visible: false })}
        {...state.userHandleModal}
      />
      <PermissionsViewModal
        onCancel={() => handlePreviewState({ visible: false })}
        {...state.ruleViewModal}
      />
      <AssigningRolesModal
        onCancel={() => handleAssigningRoleState({ visible: false })}
        {...state.assigningRolesModal}
      />
      <RoleDetailsModal
        onCancel={() => handleRoleDetailsState({ visible: false })}
        {...state.roleDetailsModal}
      />
      <ResetPasswordModal
        onCancel={() => handleResetPasswordState({ visible: false })}
        {...state.resetPasswordModal}
      />
    </>
  )
}

export default UserMainList
