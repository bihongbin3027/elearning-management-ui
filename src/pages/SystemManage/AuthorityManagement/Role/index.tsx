import React, { useRef, useEffect, useCallback } from 'react'
import {
  Button,
  Tabs,
  Row,
  Col,
  Avatar,
  Modal,
  message,
  Card,
  Space,
} from 'antd'
import _ from 'lodash'
import moment from 'moment'
import { useSelector, useDispatch } from 'react-redux'
import { ColumnType } from 'antd/es/table'
import { RootStateType } from '@/store/rootReducer'
import useSetState from '@/hooks/useSetState'
import { TableCallType } from '@/components/GenerateTable'
import LayoutTableList, {
  FormListCallType,
  CardButtonType,
} from '@/components/LayoutTableList'
import TableOperate, { TableOperateButtonType } from '@/components/TableOperate'
import TreeNode from '@/components/Tree'
import { TreeType, TreeNodeCallType } from '@/components/Tree/interface'
import useToggle from '@/hooks/useToggle'
import PermissionsViewModal from '@/pages/SystemManage/AuthorityManagement/PermissionsViewModal'
import LayoutFormModal, {
  LayoutFormModalCallType,
  LayoutFormPropTypes,
} from '@/components/LayoutFormModal'
import IconSelectionModal from '@/pages/SystemManage/AuthorityManagement/IconSelectionModal'
import Upload from '@/components/Upload'
import { AnyObjectType, SelectType } from '@/typings'
import { GlobalConstant } from '@/config'
import {
  handleRowEnableDisable,
  handleRowDelete,
  transformTreeData,
} from '@/utils'
import { SxyIcon } from '@/style/module/icon'
import { roleClassData, statusData } from '@/config/selectData'
import layoutStore from '@/store/module/layout'
import { getSystemList } from '@/api/systemManage/system'
import {
  getRoleList,
  handleRoleList,
  switchUserList,
  getRoleTreeView,
  saveRoleTreeView,
  getUserGroupTreeView,
  saveUserGroupTreeView,
  getPermissionView,
} from '@/api/systemManage/roles'

const { TabPane } = Tabs

interface StateType {
  searchList: FormListCallType[]
  cardHandleButtonList: CardButtonType[]
  columnsList: ColumnType<AnyObjectType>[]
  currentTableRow: AnyObjectType[]
  basicRuleObj: {
    saveLoading: boolean
    ruleTabKey: string
    permission: TreeType[]
    data: TreeType[]
    resource: TreeType[]
    companyTree: TreeType[]
    userTabKey: string
    routine: TreeType[]
    refuse: TreeType[]
  }
  roleHandleModal: LayoutFormPropTypes
  iconModal: {
    visible: boolean
    src: string
  }
  portUploadModal: {
    visible: boolean
    data: AnyObjectType[]
  }
  ruleViewModal: {
    visible: boolean
    loading: boolean
    treeList: TreeType[]
    companyList: TreeType[]
  }
}

const RoleMainList = () => {
  const dispatchRedux = useDispatch()
  const authBasic = GlobalConstant.buttonPermissions.basic // 基础权限
  const layoutTableRef = useRef<TableCallType>()
  const layoutFormModalRef = useRef<LayoutFormModalCallType>()
  const permissionTreeNodeRef = useRef<TreeNodeCallType>()
  const dataTreeNodeRef = useRef<TreeNodeCallType>()
  const resourceTreeNodeRef = useRef<TreeNodeCallType>()
  const companyTreeNodeRef = useRef<TreeNodeCallType>()
  const userGroupOneTreeNodeRef = useRef<TreeNodeCallType>()
  const userGroupTwoTreeNodeRef = useRef<TreeNodeCallType>()
  // 角色权限授权菜单卡片显示隐藏状态
  const [controlLayoutState, { setLeft, setRight }] = useToggle(
    {
      size: {
        xs: 24,
        sm: 24,
        xxl: 24,
      },
      visible: false,
    },
    {
      size: {
        xs: 24,
        sm: 24,
        xxl: 18,
      },
      visible: true,
    },
  )
  const {
    companyData, // 公司
    useLevelSelectList, // 使用等级
  } = useSelector((state: RootStateType) => ({
    ...state.layout,
  }))
  const [state, setState] = useSetState<StateType>({
    searchList: [], // 头部搜索数据
    cardHandleButtonList: [], // 卡片操作按钮数据
    columnsList: [], // 表格头数据
    currentTableRow: [], // 表格行选中
    // 设置角色权限授权菜单数据
    basicRuleObj: {
      saveLoading: false,
      ruleTabKey: 'PERMISSION',
      permission: [], // 基础权限
      data: [], // 数据权限
      resource: [], // 资源权限
      companyTree: [], // 公司
      userTabKey: 'routine',
      routine: [], // 常规
      refuse: [], // 拒绝
    },
    // 新增编辑查看角色弹窗
    roleHandleModal: {
      visible: false,
      disable: false,
      id: '',
      title: '',
      submitApi: handleRoleList,
      formList: [],
    },
    // 角色图标弹窗
    iconModal: {
      visible: false,
      src: '',
    },
    // 导入上传弹窗
    portUploadModal: {
      visible: false,
      data: [],
    },
    // 角色权限视图弹窗
    ruleViewModal: {
      visible: false,
      loading: false,
      treeList: [],
      companyList: [],
    },
  })

  /**
   * @Description 上传成功回调
   * @Author bihongbin
   * @Date 2020-08-03 11:43:42
   */
  const handlePortUploadSuccess = (data: AnyObjectType[]) => {
    let params: AnyObjectType[] = []
    for (let item of data) {
      if (item.response && _.isArray(item.response.data)) {
        params = [...params, ...item.response.data]
      }
    }
    setState((prev) => {
      prev.portUploadModal.data = params
      return prev
    })
  }

  /**
   * @Description 导入
   * @Author bihongbin
   * @Date 2020-08-03 13:46:53
   */
  const handlePortUploadSave = () => {
    console.log('需要导入的数据', state.portUploadModal.data)
  }

  /**
   * @Description 查看权限视图
   * @Author bihongbin
   * @Date 2020-10-20 11:27:10
   */
  const lookRuleViewModal = async () => {
    setState((prev) => {
      prev.ruleViewModal.visible = true
      prev.ruleViewModal.loading = true
      return prev
    })
    try {
      if (layoutTableRef.current) {
        let ids = layoutTableRef.current.getSelectIds()
        const result = await getPermissionView(ids[0])
        setState((prev) => {
          prev.ruleViewModal.loading = false
          prev.ruleViewModal.treeList = transformTreeData(
            result.data.treeList || [],
            'name',
            true,
          )
          prev.ruleViewModal.companyList = transformTreeData(
            result.data.companyList || [],
            'companyName',
            true,
          )
          return prev
        })
      }
    } catch (error) {
      setState((prev) => {
        prev.ruleViewModal.loading = false
        return prev
      })
    }
  }

  /**
   * @Description 获取详情
   * @Author bihongbin
   * @Date 2020-10-14 11:11:06
   */
  const getListDetails = useCallback(async (id: string) => {
    if (layoutFormModalRef.current) {
      layoutFormModalRef.current.setFormLoading(true)
      try {
        const result = await handleRoleList({ id }, 'get')
        const {
          roleCategory,
          sysId,
          roleCname,
          roleEname,
          cid,
          allCompany,
          sortSeq,
          permissionGrade,
          startTime,
          endTime,
          defaultOrgFlag,
          visibleFlag,
          remark,
        } = result.data
        layoutFormModalRef.current.setFormValues({
          roleCategory,
          sysId: String(sysId),
          roleCname,
          roleEname,
          cid,
          allCompany: String(allCompany),
          sortSeq,
          permissionGrade,
          startTime: moment(startTime),
          endTime: moment(endTime),
          defaultOrgFlag: parseInt(defaultOrgFlag) === 1 ? true : false,
          visibleFlag: parseInt(visibleFlag) === 1 ? true : false,
          remark,
        })
      } catch (error) {}
      layoutFormModalRef.current.setFormLoading(false)
    }
  }, [])

  /**
   * @Description 获取角色权限授权菜单
   * @Author bihongbin
   * @Date 2020-10-19 14:42:02
   */
  const getRuleMenuView = useCallback(async () => {
    const rows = state.currentTableRow
    if (!rows.length) {
      return
    }
    const { id, roleCategory } = rows[0]
    // 获取选中的数据
    const getTreeChecked = (list: TreeType[]) => {
      let checkedKeys: string[] = []
      const getDeep = (data: TreeType[]) => {
        for (let item of data) {
          if (item.checked) {
            checkedKeys.push(item.key)
          }
          if (item.children) {
            getDeep(item.children)
          }
        }
      }
      getDeep(list)
      return checkedKeys
    }
    // 常规角色和拒绝角色
    if (roleCategory === 'ROLE' || roleCategory === 'DENY') {
      const getTreeData = async (
        tabKey: 'PERMISSION' | 'DATA' | 'RESOURCE',
      ) => {
        const result = await getRoleTreeView({
          id,
          params: {
            category: tabKey,
          },
        })
        const ruleContent = transformTreeData(
          result.data.treeList,
          'name',
          true,
        )
        const companyContent = transformTreeData(
          result.data.companyList,
          'companyName',
          true,
        )
        return {
          ruleContent,
          companyContent,
          ruleCheckedKeys: getTreeChecked(ruleContent),
          companyCheckedKeys: getTreeChecked(companyContent),
        }
      }
      if (permissionTreeNodeRef.current) {
        permissionTreeNodeRef.current.setLoading(true)
        try {
          const permissionResult = await getTreeData('PERMISSION') // 基础数据
          const dataResult = await getTreeData('DATA') // 数据权限
          const resourceResult = await getTreeData('RESOURCE') // 资源权限
          setState((prev) => {
            prev.basicRuleObj.permission = permissionResult.ruleContent
            prev.basicRuleObj.data = dataResult.ruleContent
            prev.basicRuleObj.resource = resourceResult.ruleContent
            prev.basicRuleObj.companyTree = permissionResult.companyContent
            return prev
          })
          permissionTreeNodeRef.current.setCheckedNode(
            permissionResult.ruleCheckedKeys,
          )
          dataTreeNodeRef.current?.setCheckedNode(dataResult.ruleCheckedKeys)
          resourceTreeNodeRef.current?.setCheckedNode(
            resourceResult.ruleCheckedKeys,
          )
          companyTreeNodeRef.current?.setCheckedNode(
            permissionResult.companyCheckedKeys,
          )
        } catch (error) {}
        permissionTreeNodeRef.current.setLoading(false)
      }
    }
    // 用户组
    if (roleCategory === 'USERGROUP') {
      if (userGroupOneTreeNodeRef.current && userGroupTwoTreeNodeRef.current) {
        userGroupOneTreeNodeRef.current.setLoading(true)
        try {
          const result = await getUserGroupTreeView({ id })
          const roleContent = transformTreeData(
            result.data.roleList,
            'roleCname',
          )
          const denyContent = transformTreeData(
            result.data.denyList,
            'roleCname',
          )
          setState((prev) => {
            prev.basicRuleObj.routine = roleContent
            prev.basicRuleObj.refuse = denyContent
            return prev
          })
          userGroupOneTreeNodeRef.current.setCheckedNode(
            getTreeChecked(roleContent),
          )
          userGroupTwoTreeNodeRef.current.setCheckedNode(
            getTreeChecked(denyContent),
          )
        } catch (error) {}
        userGroupOneTreeNodeRef.current.setLoading(false)
      }
    }
  }, [setState, state.currentTableRow])

  /**
   * @Description 渲染角色授权菜单
   * @Author bihongbin
   * @Date 2020-10-14 15:56:16
   */
  const getRoleAuthRender = () => {
    let renderJsx = null
    const rows = state.currentTableRow
    if (rows.length && rows.length === 1) {
      const { roleCategory } = rows[0]
      // 常规角色和拒绝角色
      if (roleCategory === 'ROLE' || roleCategory === 'DENY') {
        renderJsx = (
          <>
            <Tabs
              className="mb-4"
              activeKey={state.basicRuleObj.ruleTabKey}
              style={{ marginTop: -20 }}
              onChange={(activeKey: string) => {
                setState((prev) => {
                  prev.basicRuleObj.ruleTabKey = activeKey
                  return prev
                })
              }}
            >
              <TabPane tab="基础权限" key="PERMISSION" forceRender>
                <TreeNode
                  ref={permissionTreeNodeRef}
                  searchOpen
                  checkedOpen
                  data={state.basicRuleObj.permission}
                  treeConfig={{ checkStrictly: true }}
                />
              </TabPane>
              <TabPane tab="数据权限" key="DATA" forceRender>
                <TreeNode
                  ref={dataTreeNodeRef}
                  searchOpen
                  checkedOpen
                  data={state.basicRuleObj.data}
                  treeConfig={{ checkStrictly: true }}
                />
              </TabPane>
              <TabPane tab="资源权限" key="RESOURCE" forceRender>
                <TreeNode
                  ref={resourceTreeNodeRef}
                  searchOpen
                  checkedOpen
                  data={state.basicRuleObj.resource}
                  treeConfig={{ checkStrictly: true }}
                />
              </TabPane>
              <TabPane tab="分配公司" key="COMPANY" forceRender>
                <TreeNode
                  ref={companyTreeNodeRef}
                  searchOpen
                  checkedOpen
                  data={state.basicRuleObj.companyTree}
                />
              </TabPane>
            </Tabs>
          </>
        )
      }
      // 用户组
      if (roleCategory === 'USERGROUP') {
        renderJsx = (
          <Tabs
            className="mb-4"
            activeKey={state.basicRuleObj.userTabKey}
            style={{ marginTop: -20 }}
            onChange={(activeKey) => {
              setState((prev) => {
                prev.basicRuleObj.userTabKey = activeKey
                return prev
              })
            }}
          >
            <TabPane tab="常规角色" key="routine" forceRender>
              <TreeNode
                ref={userGroupOneTreeNodeRef}
                checkedOpen
                data={state.basicRuleObj.routine}
              />
            </TabPane>
            <TabPane tab="拒绝角色" key="refuse" forceRender>
              <TreeNode
                ref={userGroupTwoTreeNodeRef}
                checkedOpen
                data={state.basicRuleObj.refuse}
              />
            </TabPane>
          </Tabs>
        )
      }
      return renderJsx
    }
  }

  /**
   * @Description 角色权限授权菜单保存
   * @Author bihongbin
   * @Date 2020-10-19 16:49:08
   */
  const saveRuleAuth = async () => {
    const rows = state.currentTableRow
    if (rows.length) {
      const { id, roleCategory } = rows[0]
      setState((prev) => {
        prev.basicRuleObj.saveLoading = true
        return prev
      })
      try {
        // 常规角色和拒绝角色
        if (roleCategory === 'ROLE' || roleCategory === 'DENY') {
          let params = {
            permissionList: permissionTreeNodeRef.current?.getCheckedCurrent(),
            dataList: dataTreeNodeRef.current?.getCheckedCurrent(),
            resourceList: resourceTreeNodeRef.current?.getCheckedCurrent(),
            companyIds: companyTreeNodeRef.current
              ?.getCheckedCurrent()
              .reduce<string[]>((prev, arr) => {
                prev.push(arr.companyId)
                return prev
              }, []),
          }
          await saveRoleTreeView({
            id: state.currentTableRow[0].id,
            params,
          })
          message.success('保存成功', 1.5)
        }
        // 用户组
        if (roleCategory === 'USERGROUP') {
          const one = userGroupOneTreeNodeRef.current?.getCheckedNode()
          const two = userGroupTwoTreeNodeRef.current?.getCheckedNode()
          const concat = [...one, ...two]
          await saveUserGroupTreeView({
            userGroupIds: [id],
            roleIds: concat,
          })
          message.success('保存成功', 1.5)
        }
      } catch (error) {}
      setState((prev) => {
        prev.basicRuleObj.saveLoading = false
        return prev
      })
    }
  }

  /**
   * @Description 数据字典
   * @Author bihongbin
   * @Date 2020-10-14 12:03:00
   */
  useEffect(() => {
    // 公司
    dispatchRedux(layoutStore.actions.getCompanyData())
    // 使用等级
    dispatchRedux(
      layoutStore.actions.getDictionary({
        code: 'RBAC_PERMISSION_GRADE',
        saveName: 'useLevelSelectList',
      }),
    )
  }, [dispatchRedux])

  /**
   * @Description 设置头部搜索数据
   * @Author bihongbin
   * @Date 2020-07-31 16:19:56
   */
  useEffect(() => {
    setState({
      searchList: [
        {
          componentName: 'Input',
          name: 'roleCname',
          placeholder: '请输入角色名称',
        },
        {
          componentName: 'Select',
          name: 'status',
          placeholder: '角色状态',
          selectData: statusData,
        },
        {
          componentName: 'Select',
          name: 'roleCategory',
          placeholder: '角色类型',
          selectData: roleClassData,
        },
      ],
    })
  }, [setState])

  /**
   * @Description 设置卡片头操作数据
   * @Author bihongbin
   * @Date 2020-08-01 16:25:57
   */
  useEffect(() => {
    /**
     * @Description 验证是否选择
     * @Author bihongbin
     * @Date 2020-08-05 15:13:45
     */
    const layoutTableVerification = () => {
      let bool = false
      if (layoutTableRef.current) {
        let ids = layoutTableRef.current.getSelectIds()
        let row = layoutTableRef.current.getSelectRowsArray()
        if (!ids.length) {
          message.warn('请选择数据', 1.5)
          return bool
        }
        if (ids.length > 1) {
          message.warn('最多只能选个1条', 1.5)
          return bool
        }
        // 设置当前选中行
        setState({
          currentTableRow: row,
        })
        return ids
      }
      return bool
    }
    setState({
      cardHandleButtonList: [
        {
          name: '查看',
          authCode: authBasic.QUERY,
          icon: 'icon_list_see.png',
          clickConfirm: () => {
            let ids = layoutTableVerification()
            if (ids) {
              lookRuleViewModal()
            }
          },
        },
        {
          name: '授权',
          authCode: authBasic.ACCREDIT,
          icon: 'icon_list_empower.png',
          clickConfirm: () => {
            let ids = layoutTableVerification()
            if (ids) {
              // 重置tab到第一页
              setState((prev) => {
                prev.basicRuleObj.ruleTabKey = 'PERMISSION'
                prev.basicRuleObj.userTabKey = 'routine'
                return prev
              })
              setRight() // 打开右侧角色权限授权菜单
              getRuleMenuView() // 获取授权信息
            }
          },
        },
        {
          name: '新增',
          authCode: authBasic.ADD,
          icon: 'icon_list_add.png',
          clickConfirm: () => {
            setState((prev) => {
              prev.roleHandleModal.visible = true
              prev.roleHandleModal.disable = false
              prev.roleHandleModal.id = ''
              prev.roleHandleModal.title = '新增角色信息'
              return prev
            })
          },
        },
        {
          name: '导入',
          authCode: authBasic.EXPORT,
          icon: 'icon_list_import.png',
          clickConfirm: () => {
            setState((prev) => {
              prev.portUploadModal.visible = true
              return prev
            })
          },
        },
        {
          name: '导出',
          authCode: authBasic.IMPORT,
          icon: 'icon_list_export.png',
          clickConfirm: () => {},
        },
      ],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /**
   * @Description 设置新增编辑查看角色弹窗表单数据
   * @Author bihongbin
   * @Date 2020-08-01 16:30:55
   */
  useEffect(() => {
    setState((prev) => {
      prev.roleHandleModal.formList = [
        {
          componentName: 'Select',
          name: 'roleCategory',
          label: '角色类型',
          selectData: roleClassData,
          placeholder: '请选择角色类型',
          rules: [
            {
              required: true,
              message: '请选择角色类型',
            },
          ],
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'RemoteSearch',
          name: 'sysId',
          label: '系统',
          placeholder: '请选择系统',
          remoteConfig: {
            remoteApi: (val) => {
              return new Promise((resolve, reject) => {
                getSystemList({ sysCname: val })
                  .then((res) => {
                    let result: SelectType[] = []
                    if (_.isArray(res.data.content)) {
                      result = res.data.content.map((item) => ({
                        label: item.sysCname,
                        value: item.id,
                      }))
                    }
                    resolve(result)
                  })
                  .catch((err) => {
                    reject(err)
                  })
              })
            },
          },
          rules: [
            {
              required: true,
              message: '请选择系统',
            },
          ],
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'roleCname',
          label: '角色中文名',
          placeholder: '请输入角色中文名',
          rules: [
            {
              required: true,
              message: '请输入角色中文名',
            },
          ],
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'roleEname',
          label: '角色英文名',
          placeholder: '请输入角色英文名',
          rules: [
            {
              required: true,
              message: '请输入角色英文名',
            },
          ],
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'cId',
          label: '公司',
          placeholder: '请选择公司',
          selectData: companyData,
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'allCompany',
          label: '公司范围',
          placeholder: '请选择公司范围',
          selectData: [
            { label: '指定范围', value: '0' },
            { label: '全部公司', value: '1' },
          ],
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'Input',
          name: 'sortSeq',
          label: '排序序号',
          placeholder: '请输入排序序号',
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'Select',
          name: 'permissionGrade',
          label: '使用等级',
          placeholder: '请选择使用等级',
          selectData: useLevelSelectList,
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'startTime',
          label: '生效日期',
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'DatePicker',
          name: 'endTime',
          label: '失效日期',
          disabled: state.roleHandleModal.disable,
        },
        // TODO 图标功能未做
        {
          componentName: 'HideInput',
          name: 'roleIcon',
          label: '角色图标',
          disabled: state.roleHandleModal.disable,
          colProps: { span: 24 },
          render: () => {
            return (
              <div
                className="mb-5"
                onClick={() => {
                  if (!state.roleHandleModal.disable) {
                    setState((prev) => {
                      prev.iconModal.visible = true
                      return prev
                    })
                  }
                }}
              >
                <Avatar
                  className="pointer"
                  src={state.iconModal.src}
                  shape="square"
                  size="large"
                  alt="角色图标"
                />
                <span className="text-desc font-12 ml-2">
                  - 点击图标可以任意更换角色图标哦
                </span>
              </div>
            )
          },
        },
        {
          componentName: 'Switch',
          name: 'defaultOrgFlag',
          label: '默认组织',
          valuePropName: 'checked',
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'Switch',
          name: 'visibleFlag',
          label: '是否显示',
          valuePropName: 'checked',
          disabled: state.roleHandleModal.disable,
        },
        {
          componentName: 'TextArea',
          name: 'remark',
          label: '备注',
          rows: 3,
          colProps: { span: 24 },
          placeholder: '请输入备注',
          disabled: state.roleHandleModal.disable,
        },
      ]
      return prev
    })
  }, [
    companyData,
    setState,
    state.iconModal.src,
    state.roleHandleModal.disable,
    useLevelSelectList,
  ])

  /**
   * @Description 设置表格头
   * @Author bihongbin
   * @Date 2020-08-01 16:26:41
   */
  useEffect(() => {
    setState({
      columnsList: [
        {
          width: 80,
          title: '序号',
          dataIndex: 'sortSeq',
          ellipsis: true,
        },
        {
          title: '角色名称',
          dataIndex: 'roleCname',
          ellipsis: true,
        },
        {
          title: '英文名称',
          dataIndex: 'roleEname',
          ellipsis: true,
        },
        {
          title: '状态',
          dataIndex: 'status',
          ellipsis: true,
          render: (value: number) => {
            let result = statusData.find(
              (item) => parseInt(item.value) === value,
            )
            return result && result.label
          },
        },
        {
          title: '系统',
          dataIndex: 'sysCname',
          ellipsis: true,
        },
        {
          title: '角色公司',
          dataIndex: 'companyName',
          ellipsis: true,
        },
        {
          title: '级别',
          dataIndex: 'permissionGrade',
          ellipsis: true,
          render: (value: string) => {
            let result = useLevelSelectList.find((item) => item.value === value)
            return result && result.label
          },
        },
        {
          title: '操作',
          dataIndex: 'status',
          fixed: 'right',
          align: 'right',
          width: 170,
          render: (value: number, record: any) => {
            const operatingData: TableOperateButtonType[] = []
            // 查看
            operatingData.push({
              name: '查看',
              authCode: authBasic.QUERY,
              svg: 'table_see.png',
              onClick: () => {
                setState((prev) => {
                  prev.roleHandleModal.visible = true
                  prev.roleHandleModal.disable = true
                  prev.roleHandleModal.id = record.id
                  prev.roleHandleModal.title = '查看角色信息'
                  return prev
                })
                getListDetails(record.id)
              },
            })
            if (value > 0) {
              // 编辑
              operatingData.push({
                name: '编辑',
                authCode: authBasic.EDIT,
                svg: 'table_edit.png',
                onClick: () => {
                  setState((prev) => {
                    prev.roleHandleModal.visible = true
                    prev.roleHandleModal.disable = false
                    prev.roleHandleModal.id = record.id
                    prev.roleHandleModal.title = '编辑角色信息'
                    return prev
                  })
                  getListDetails(record.id)
                },
              })
              // 挂起和启用
              operatingData.push({
                name: value === 1 ? '启用' : '挂起',
                authCode: authBasic.ENABLEANDSUSPEND,
                svg: value === 1 ? 'table_enable.png' : 'table_locking.png',
                onClick: () => {
                  if (layoutTableRef.current) {
                    handleRowEnableDisable(
                      {
                        id: [record.id],
                        status: record.status,
                      },
                      switchUserList,
                      layoutTableRef.current.getTableList,
                      ['', '挂起', '启用'],
                    )
                  }
                },
              })
              // 删除
              operatingData.push({
                name: '删除',
                authCode: authBasic.DELETE,
                svg: 'table_delete.png',
                onClick: () => {
                  handleRowDelete([record.id], handleRoleList, () => {
                    setLeft() // 关闭右侧角色权限授权菜单
                    if (layoutTableRef.current) {
                      layoutTableRef.current.getTableList()
                    }
                  })
                },
              })
            }
            return <TableOperate operateButton={operatingData} />
          },
        },
      ],
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getListDetails])

  /**
   * @Description 设置角色权限授权菜单
   * @Author bihongbin
   * @Date 2020-08-01 16:27:25
   */
  useEffect(() => {
    getRuleMenuView()
  }, [getRuleMenuView])

  return (
    <>
      <LayoutTableList
        ref={layoutTableRef}
        api={getRoleList}
        autoGetList
        searchFormList={state.searchList}
        cardTopButton={state.cardHandleButtonList}
        cardTopTitle="角色列表"
        tableColumnsList={{
          rowType: 'checkbox',
          list: state.columnsList,
          size: controlLayoutState.size,
          tableConfig: {
            scroll: { x: 1500, y: 500 },
          },
        }}
        rightRender={
          controlLayoutState.visible
            ? {
                jsx: (
                  <Card
                    title="角色权限授权菜单"
                    extra={
                      <Button
                        type="text"
                        onClick={() => {
                          setState((prev) => {
                            prev.ruleViewModal.visible = false
                            return prev
                          })
                        }}
                      >
                        <Space>
                          <SxyIcon
                            width={16}
                            height={16}
                            name="icon_list_preview.png"
                          />
                          <span>预览</span>
                        </Space>
                      </Button>
                    }
                  >
                    {getRoleAuthRender()}
                    <Row justify="center">
                      <Button className="mr-5" onClick={setLeft}>
                        关闭
                      </Button>
                      <Button
                        type="primary"
                        loading={state.basicRuleObj.saveLoading}
                        onClick={saveRuleAuth}
                      >
                        保存
                      </Button>
                    </Row>
                  </Card>
                ),
                size: {
                  xs: 24,
                  sm: 24,
                  xxl: 6,
                },
              }
            : undefined
        }
      />
      <IconSelectionModal
        {...state.iconModal}
        onCancel={() => {
          setState((prev) => {
            prev.iconModal.visible = false
            return prev
          })
        }}
        onConfirm={(item) => {
          layoutFormModalRef.current?.setFormValues({
            ii: item.src,
          })
          setState((prev) => {
            prev.iconModal.visible = false
            prev.iconModal.src = item.src
            return prev
          })
        }}
      />
      <Modal
        width={360}
        title="文件导入"
        visible={state.portUploadModal.visible}
        destroyOnClose
        onCancel={() => {
          setState((prev) => {
            prev.portUploadModal.visible = false
            return prev
          })
        }}
        maskClosable={false}
        footer={null}
      >
        <Upload
          action={GlobalConstant.fieldConfigUploadHttp}
          uploadType={['xls', 'xlsx']}
          uploadSuccess={handlePortUploadSuccess}
          multiple
        >
          <>
            <Row className="ml-5" align="middle">
              <Col>
                <SxyIcon
                  className="pointer"
                  width={60}
                  height={60}
                  name="curriculum_upload.png"
                />
              </Col>
              <Col>
                <div className="ml-3">请选择文件</div>
              </Col>
            </Row>
            <div className="text-desc mt-5 ml-5">支持xls、xlsx文件格式</div>
          </>
        </Upload>
        <Row className="mt-10 mb-5" justify="center">
          <Col>
            <Button
              className="font-14"
              size="large"
              onClick={() => {
                setState((prev) => {
                  prev.portUploadModal.visible = false
                  return prev
                })
              }}
            >
              取消
            </Button>
            <Button
              className="font-14 ml-5"
              size="large"
              type="primary"
              onClick={handlePortUploadSave}
            >
              导入
            </Button>
          </Col>
        </Row>
      </Modal>
      <LayoutFormModal
        ref={layoutFormModalRef}
        formConfig={{
          initialValues: {
            roleCategory: 'ROLE',
            permissionGrade: 'U2',
            allCompany: '1',
            defaultOrgFlag: true,
            visibleFlag: true,
          },
        }}
        switchTransform={['defaultOrgFlag', 'visibleFlag']}
        onCancel={() => {
          setState((prev) => {
            prev.roleHandleModal.visible = false
            return prev
          })
        }}
        onConfirm={() => {
          layoutTableRef.current?.getTableList()
        }}
        {...state.roleHandleModal}
      />
      <PermissionsViewModal
        onCancel={() => {
          setState((prev) => {
            prev.ruleViewModal.visible = false
            return prev
          })
        }}
        {...state.ruleViewModal}
      />
    </>
  )
}

export default RoleMainList
